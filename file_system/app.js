const fs = require('fs/promises');

// when we have to read a file, first we have to open that file
// eg: open (32) file descriptor  - Each open file has a unique file descriptor - think of it like angit a id
// then read/write

(async () => {
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
        console.log(content);
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
