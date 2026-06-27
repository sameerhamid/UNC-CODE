

// const fs = require('fs/promises');
// Execution time : 9s
// CPU usage: 100% (one core)
// Memory usage: 50MB
// (async()=> {
    //     console.time('writeMany');
    //     const fileHandler = await fs.open('abc.txt', 'w');
    //     for (let i = 0; i < 1000000; i++) {
        //         await fileHandler.write(` ${i} `);
        //     }
        //     console.timeEnd('writeMany');
        //     fileHandler?.close();
        // })()


// const fs = require('fs');
// Execution time : 1.3s
// CPU usage: 100% (one core)
// Memory usage: 30MB
// (()=> {
//     console.time('writeMany');
//     const fileHandler = fs.open('abc.txt', 'w', (err, fd) => {
//         for (let i = 0; i < 1000000; i++) {
//             const buffer = Buffer.from(` ${i} `, 'utf8');
//             fs.writeSync(fd, buffer);
//         }
//         console.timeEnd('writeMany');
//     });
//     fileHandler?.close();
// })()


const fs = require('fs/promises');

// Don't do it this way (Bad Practice) becoz it takes more memory
// Execution time : 270ms
// CPU usage: 100% (one core)
// Memory usage: 200MB
(async()=> {
    console.time('writeMany');
    const fileHandler = await fs.open('abc.txt', 'w');
    const stream = fileHandler.createWriteStream();
    for (let i = 0; i < 1000000; i++) {
        const buffer = Buffer.from(` ${i} `, 'utf8');
        stream.write(buffer);
    }
    console.timeEnd('writeMany');
    fileHandler?.close();
})()
