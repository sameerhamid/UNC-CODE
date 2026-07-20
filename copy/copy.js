const { pipeline } = require('node:stream');
const fs = require('node:fs/promises');


// (async () => {
//     console.time("copy");
//     const destFile = await fs.open('abc.txt', 'w');
//     const result = await fs.readFile('read-big.txt');

//     await destFile.write(result);
//     console.timeEnd("copy");
// })()


// 145.133ms

// (async () => {
//     console.time("copy");
//     const destFile = await fs.open('abc.txt', 'w');
//     const srcFile = await fs.open('read-big.txt', 'r');

//     let bytesRead = -1;
//     while (bytesRead !== 0) {
//         const readResult = await srcFile.read();
//         bytesRead = readResult.bytesRead;

//         if (bytesRead === 0) break;

//         await destFile.write(readResult.buffer, 0, bytesRead);
//     }

//     await srcFile.close();
//     await destFile.close();
//     console.timeEnd("copy");
// })()


(async () => {
    console.time("copy");
    const destFile = await fs.open('abc.txt', 'w');
    const srcFile = await fs.open('read-big.txt', 'r');

    const readStream = await srcFile.createReadStream();
    const writeStream = await destFile.createWriteStream();

    // readStream.pipe(writeStream);
    // readStream.on('end', () => {
    //     await srcFile.close();
    //     await destFile.close();
    //     console.timeEnd("copy");
    // })

    pipeline(readStream, writeStream, (err) => {
        console.log("error>>>>>>>>>", err);
        console.timeEnd("copy");
    })
})()
