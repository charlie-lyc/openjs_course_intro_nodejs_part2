'use strict'
import { createServer } from 'node:http'

const mockData = [
    {
        id: "A1",
        name: "Vacuum Cleaner",
        rrp: "99.99",
        info: "The most powerful vacuum in the world.",
    },
    {
        id: "A2",
        name: "Leaf Blower",
        rrp: "303.33",
        info: "This product will blow your socks off.",
    },
    {
        id: "B1",
        name: "Chocolate Bar",
        rrp: "22.40",
        info: "Deliciously overpriced chocolate.",
    },
]

/**
 * Request Handler's two arguments
 *                                     instance                     extends
 * - req(uest): incoming HTTP request(<-------- http.ServerRequest <------- http.IncomingMessage)
 * - res(ponse): outgoing HTTP response(<------ http.ServerResponse <------ http.OutgoingMessage)
 */
const server = await createServer((req, res) => {
    /* Set CORS(Cross-Origin Resource Sharing) Headers */
    res.setHeader('Access-Control-Allow-Origin', '*')
    /* Set Content-Type Header to JSON */
    res.writeHead(200, { 'Content-Type': 'application/json' })
    /* Send Data */
    res.end(JSON.stringify(mockData))
})

const port = 3000
server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
})
