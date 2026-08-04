const net = require('net');
const readline = require('readline/promises');

const PORT = 4020;
const HOST = '3.111.32.72'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

let id = '';

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
    await moveCursor(0, -1);
    await clearLine(0);
    socket.write(`${id}-message-${message}`);
    ask();                     // loop here, not from the data handler
}


const socket = net.createConnection({ port: PORT, host: HOST }, async () => {
    console.log("Connected to the server!");
    ask();
});

socket.on('data', async (data) => {
    // when we are getting a message
    console.log("");
    await moveCursor(0, -1) // move the cursor one line up
    await clearLine(0); // clear the current line that the cursor is in
    // when we are getting the id
    if (data.toString('utf-8').startsWith('id-')) {
        // everything from the 3rd char up until the end
        id = data.toString('utf-8').substring(3);
        console.log(`Your id is ${id}!\n`);
    } else {
        console.log(data.toString('utf-8'));
    }
    rl.prompt(true);
})

socket.on('end', () => {
    rl.close();
    console.log("Connection was ended!");
})
