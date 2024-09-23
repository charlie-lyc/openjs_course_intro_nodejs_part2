'use strict'

export default async function (fastify, opts) {

    /** For Bidirectional Real-Time Communication **/
    function monitorMessages (socket) {
        socket.on('message', (data) => {
            try {
                const { cmd, payload } = JSON.parse(data)
                if (cmd === 'update-category') {
                    sendCurrentOrders(payload.category, socket)
                }
            } catch (err) {
                fastify.log.warn('WebSocket Message (data: %o) Error: %s', data, err.message)
            }
        })
    }
    function sendCurrentOrders (category, socket) {
        // for (const order of fastify.currentOrders(category)) {
        //     socket.send(order)
        // }

        const orders = Array.from(fastify.currentOrders(category))
        for (const order of orders) {
            socket.send(order)
        }
    }
    /** ----------------------------------------- **/

    fastify.get('/:category', { websocket: true }, async (websocket, request) => {
        // websocket.socket.send(JSON.stringify({ id: 'A1', total: 3 }))

        /* Mocking realtime functionality */
        // for (const order of fastify.currentOrders(request.params.category)) {
        //     websocket.socket.send(order)
        // }

        /** For Bidirectional Real-Time Communication **/
        monitorMessages(websocket.socket)
        sendCurrentOrders(request.params.category, websocket.socket)
        /** ----------------------------------------- **/

        for await (const order of fastify.realtimeOrders()) {
            if (websocket.socket.readyState >= websocket.socket.CLOSING) {
                break
            }
            websocket.socket.send(order)
        }
        /* ------------------------------ */
    })

    /* Add Order Handler */
    fastify.post('/:id', async (request) => {
        fastify.addOrder(request.params.id, request.body.amount)
        return { ok: true }
    })



}