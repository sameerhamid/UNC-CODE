const net = require('net');
const readline = require('readline/promises');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const clearLine = (dir) => {
    return new Promise((resolve, reject) => {
        process.stdout.clearLine(dir, () => {
            resolve();
        })
    })
}

const moveCursor = (dx, dy) => {
    return new Promise((resolve, reject) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve();
        })
    })
}

const ask = async () => {
    const message = await rl.question('Enter a message > ');
    socket.write(message);
}

const socket = net.createConnection({port: 3008, host: '127.0.0.1'}, async () => {
    console.log("Connected to the server!");
    await moveCursor(0, -1) // move the cursor one line up
    await clearLine(0); // clear the current line that the cursor is in
    ask();
});

socket.on('data', async (data) => {
    console.log("");
    await moveCursor(0, -1) // move the cursor one line up
    await clearLine(0); // clear the current line that the cursor is in
    console.log(data.toString('utf-8'));
    ask();
})

socket.on('end', () => {
    console.log("Connection was ended!");
})
