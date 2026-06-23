const fs = require('fs/promises');

// when we have to read a file, first we have to open that file
// eg: open (32) file descriptor  - Each open file has a unique file descriptor - think of it like angit a id
// then read/write

(async () => {

    async function createFile(path) {
        if (!path && !path?.length) {
            console.log("Please provide file path");
            return;
        }
        try {
            // check weather or not already have that file
            const existingFileHandle = await fs.open(path, 'r');
            if (existingFileHandle) {
                // we already have that file...
                existingFileHandle?.close();
                return console.log(`The file ${path} already exists`)
            }
        } catch (error) {
            // we don't have that file, now we should create it
            const newFileHandle = await fs.open(path, 'w');
            console.log("A new file was successfully created.");
            newFileHandle?.close();
        }

    }


    const CREATE_FILE = 'create a file'
    const commandFileHandler = await fs.open('./command.txt', 'r');

    commandFileHandler.on('change', async() => { // FileHandler extends EventEmmiter class so i can listen for events
        // get the size of the file
        const stat = await commandFileHandler.stat();
        // allocate our buffer with the size of the file
        const buff = Buffer.alloc(stat?.size);
        // the location at which we want to start filling our buffer
        const offset = 0;
        // how many bytes we want to read
        const length = buff.byteLength;
        // from whcih postion we want to read the file
        const position = 0;
        // we want to read a file
        const content = await commandFileHandler.read(buff, offset, length, position);
        // decoder 01 => meaningful
        // encoder meaningful => 01
        const command = buff.toString('utf-8');
        // create a file:
        // create a file <path>
        if (command.toLowerCase().includes(CREATE_FILE)) {
            const filePath = command.substring(CREATE_FILE.length + 1);
            createFile(filePath);
        }
    })

    // const watcher = fs.watch('./');
    const watcher = fs.watch('./command.txt');

    for await (const event of watcher) {
        // if (event.eventType === "change" && event.filename === "command.txt") {
        if (event.eventType === "change") {
            commandFileHandler.emit("change");
        }
    }
})()
