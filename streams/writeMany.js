

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
// (async()=> {
//     console.time('writeMany');
//     const fileHandler = await fs.open('abc.txt', 'w');
//     const stream = fileHandler.createWriteStream();
//     for (let i = 0; i < 1000000; i++) {
//         const buffer = Buffer.from(` ${i} `, 'utf8');
//         stream.write(buffer);
//     }
//     console.timeEnd('writeMany');
//     fileHandler?.close();
// })()


// Execution time : 140ms
// CPU usage: 100% (one core)
// Memory usage: 50MB
(async()=> {
    console.time('writeMany');
    const fileHandler = await fs.open('abc.txt', 'w');
    // 8bits = 1 byte
    // 1000 bytes = 1kb
    // 1000 kilobytes = 1mb

    const stream = fileHandler.createWriteStream();
    // const buff = Buffer.alloc(65535, 10);
    // console.log(stream.write(buff));
    // console.log(stream.write(Buffer.alloc(1, 10)));
    // stream.on('drain', () => {
    //     console.log('calling>>>>.')
    // })
    // console.log(stream.writableHighWaterMark);
    // console.log(buff);
    const numberOfWrites = 10000000;
    let i = 0;
    const writeMany = () => {
        while (i < numberOfWrites) {
            const buffer = Buffer.from(` ${i} `, 'utf8');
            // this is our last write
            if (i === numberOfWrites - 1) {
                return stream.end(buffer);
                // stream.write(buffer); // errror
            }
            i++;
            // if stream.write return false, stop the loop
            if (!stream.write(buffer)) {
                break;
            }
        }
    }
    writeMany();
    let j = 0;
    stream.on('drain', () => {
        console.log("Drained!!", j++);
        writeMany();
    })
    // resume the loop once the internal buffer is empty
    stream.on('finish', () => {
        console.timeEnd('writeMany');
        fileHandler?.close();
    });
})()
