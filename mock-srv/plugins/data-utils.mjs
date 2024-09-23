'use strict'
import fp from 'fastify-plugin'
// import { promisify } from 'node:util' // <- mocking realtime orders
import { PassThrough } from 'node:stream' // <- realtime order stream


const orders = {
    A1: { total: 3 },
    A2: { total: 7 },
    B1: { total: 101 },
}

/* Mocking Real-time Orders */
// const timeout = promisify(setTimeout)
// async function* realtimeOrdersSimulator() {
//     const ids = Object.keys(orders)
//     while (true) {
//         const delta = Math.floor(Math.random() * 7) + 1
//         const id = ids[Math.floor(Math.random() * ids.length)]
//         orders[id].total += delta
//         const { total } = orders[id]
//         yield JSON.stringify({ id, total }) // <- string like realtime stream
//         await timeout(1500)
//     }
// }
/* Real-time Order Stream */
const orderStream = new PassThrough({ objectMode: true})
async function* realtimeOrders() {
    for await (const { id, total } of orderStream) {
        yield JSON.stringify({ id, total })
    }
}
/* ------------------------ */

const catToPrefix = {
    electronics: 'A',
    confectionery: 'B'
}

/* Initialize Current Orders */
function* currentOrders (category) {
    const idPrefix = catToPrefix[category]
    if (!idPrefix) return
    const ids = Object.keys(orders).filter((id) => id[0] === idPrefix)
    for (const id of ids) {
        yield JSON.stringify({ id, ...orders[id] }) // <- string like realtime stream
    }
}
/* ------------------------------ */

const calculateId = (idPrefix, data) => {
    const sorted = [...new Set( data.map((ele) => ele.id) )]
    const next = Number(sorted.pop().slice(1)) + 1
    return `${idPrefix}${next}`
}


export default fp(async function (fastify, opts) {
    fastify.decorate('mockDataInsert', function (request, category, data) {
        const idPrefix = catToPrefix[category]
        const id = calculateId(idPrefix, data)
        data.push({ id, ...request.body })
        return data
    })

    /* Mocking Real-time Orders */
    // fastify.decorate('realtimeOrders', realtimeOrdersSimulator)
    /* Real-time Order Stream */
    fastify.decorate('realtimeOrders', realtimeOrders)
    /* ------------------------ */    

    /* Initialize Current Orders */
    fastify.decorate('currentOrders', currentOrders)

    /* Add Order Plug-in */
    fastify.decorate('addOrder', function (id, amount) {
        if (orders.hasOwnProperty(id) === false) {
            const err = new Error(`Order ID '${id}' not found.`)
            err.status = 404
            throw err
        }
        if (Number.isInteger(amount) === false) {
            const err = new Error(`Supplied amount must be an integer.`)
            err.status = 400
            throw err
        }
        orders[id].total += amount
        const { total } = orders[id]
        orderStream.write({ id, total })
        console.log(`Adding Order : %o`, { id, total })
    })
})