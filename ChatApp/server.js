const net = require('net');

const server = net.createServer();

const PORT = 4020;
const HOST = '172.31.0.44'
// An array of client sockets
const clients = [];

server.on('connection', (socket) => {
    console.log("A new connection to the server!");
    const clientId = clients.length + 1;
    // Broadcasting everyone when someone enters the chat room.
    clients.forEach(client => {
        client.socket.write(`User ${clientId} joined! `);
    })
    socket.write(`id-${clientId}`);
    socket.on('data', (data) => {
        const dataString = data.toString('utf-8');
        const id = dataString.substring(0, dataString.indexOf('-'));
        const message = dataString.substring(dataString.indexOf('-message-') + 9);
        clients.forEach(client => {
            client.socket.write(`User ${id}: ${message}`);
        })
    })

    // Broadcasting everyone when someone leaves the chat room.
    socket.on('end', () => {
        clients.forEach(client => {
            client.socket.write(`User ${clientId} left!`);
        })
    })
    clients.push({id: clientId.toString(), socket});
})

server.listen(PORT, HOST , () => {
    console.log("Opened server on", server.address());
})
