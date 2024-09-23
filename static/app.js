/* Mock Data */
// const data = [
//     {
//         id: "A1",
//         name: "Vacuum Cleaner",
//         rrp: "99.99",
//         info: "The most powerful vacuum in the world.",
//     },
//     {
//         id: "A2",
//         name: "Leaf Blower",
//         rrp: "303.33",
//         info: "This product will blow your socks off.",
//     },
//     {
//         id: "B1",
//         name: "Chocolate Bar",
//         rrp: "22.40",
//         info: "Deliciously overpriced chocolate.",
//     },
// ]

const API = 'http://localhost:3000' // <- server.mjs
const WS_API = 'ws://localhost:3000' // <- realtime orders

const populateProducts = async(category, method='GET', payload) => { // <- mock data, server.mjs, Fastify
    const products = document.querySelector('#products')
    products.innerHTML = ''

    /* Fastify: GET, POST */
    const options = method === 'GET' ? {} : {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }

    const res = await fetch(`${API}/${category}`, options) // <- server.mjs, Fastify
    const data = await res.json() // <- server.mjs

    for (const product of data) {
        const item = document.createElement('product-item')
        
        item.dataset.id = product.id // <- realtime orders

        for (const key of ['name', 'rrp', 'info']) {
            const span = document.createElement('span')
            span.slot = key
            span.textContent = product[key]
            item.appendChild(span)
        }
        products.appendChild(item)
    }    
}

// document.querySelector('#fetch').addEventListener('click', async() => await populateProducts()) // mock data, server.mjs

/* Fastify: GET */
// const category = document.querySelector('#category')
// category.addEventListener('input', async(e) => await populateProducts(e.target.value))
// const add = document.querySelector('#add')
// add.addEventListener('submit', async(e) => {
//     e.preventDefault()
//     const payload = {
//         name: e.target.name.value,
//         rrp: e.target.rrp.value,
//         info: e.target.info.value
//     }
//     await populateProducts(category.value, 'POST', payload)
//     e.target.reset()
// })

/* Fastify: GET, POST */
const category = document.querySelector('#category')
const add = document.querySelector('#add')

/* Realtime Orders via WebSocket */
let socket = null
const realtimeOrders = (category) => {
    
    /** For Bidirectional Real-Time Communication **/
    // if (socket) socket.close()
    // socket = new WebSocket(`${WS_API}/orders/${category}`)

    if (socket === null) {
        socket = new WebSocket(`${WS_API}/orders/${category}`)
    } else {
        socket.send(JSON.stringify({ cmd: 'update-category', payload: { category } }))
    }
    /** ----------------------------------------- **/

    socket.addEventListener('message', (payload) => {
        try {
            const { id, total } = JSON.parse(payload.data)
            const item = document.querySelector(`[data-id="${id}"]`)
            if (item === null) return
            const span = item.querySelector('[slot="orders"]') || document.createElement('span')
            span.slot = "orders"
            span.textContent = total
            item.appendChild(span)
        } catch (err) {
            console.error(err)
        }
    })
}
/* --------------------------------------- */

category.addEventListener('input', async(e) => {
    await populateProducts(e.target.value) // GET
    add.style.display = 'block'    // <- POST
    realtimeOrders(e.target.value) // <- realtime orders
})
add.addEventListener('submit', async(e) => {
    e.preventDefault()
    const payload = {
        name: e.target.name.value,
        rrp: e.target.rrp.value,
        info: e.target.info.value
    }
    await populateProducts(category.value, 'POST', payload)
    e.target.reset()
    realtimeOrders(category.value) // <- realtime orders
})

customElements.define(
    'product-item', 
    class Item extends HTMLElement {
        constructor() {
            super()
            const itemTemplate = document.querySelector('#item').content.cloneNode(true)
            this.attachShadow({ mode: 'open' }).appendChild(itemTemplate)
        }
    }
)