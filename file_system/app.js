const fs = require('fs/promises');

// when we have to read a file, first we have to open that file
// eg: open (32) file descriptor  - Each open file has a unique file descriptor - think of it like angit a id
// then read/write

(async () => {
    const commandFileHandler = await fs.open('./command.txt', 'r');

    // const watcher = fs.watch('./');
    const watcher = fs.watch('./command.txt');

    for await (const event of watcher) {
        // if (event.eventType === "change" && event.filename === "command.txt") {
        if (event.eventType === "change") {
            // the file was changed
            console.log(`The ${event.filename} was changed`);
            // get the size of the file
            const stat = await commandFileHandler.stat()
            const buff = Buffer.alloc(stat?.size);
            const offset = 0;
            const length = buff.byteLength;
            const position = 0;
            // we want to read a file
            const content = await commandFileHandler.read(buff, offset, length, position);
            console.log(content);
        }
    }
})()
