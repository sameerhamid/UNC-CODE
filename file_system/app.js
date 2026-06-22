const fs = require('fs/promises');

(async () => {
    // const watcher = fs.watch('./');
    const watcher = fs.watch('./command.txt');

    for await (const event of watcher) {
        // if (event.eventType === "change" && event.filename === "command.txt") {
        if (event.eventType === "change") {
            // the file was changed
            console.log(`The ${event.filename} was changed`);
        }
    }
})()
