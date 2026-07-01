const fs = require('fs/promises');


(async () => {
    const fileHandleRead = await fs.open('./abc.txt', 'r');
    const fileHandleWrite = await fs.open('./dest.txt', 'w');

    const streamRead =  fileHandleRead.createReadStream();
    const streamWrite =  fileHandleWrite.createWriteStream();

    streamRead.on('data', (chunk) => {
        const numbers = chunk.toString('utf-8').split('  ');
        console.log('number', number);
        if (!streamWrite.write(chunk)) {
            streamRead.pause();
        }
    });

    streamWrite.on('drain', () => {
        streamRead.resume();
    })

})()
