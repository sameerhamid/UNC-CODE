const fs = require('node:fs/promises');


// (async () => {
//     console.time("copy");
//     const destFile = await fs.open('abc.txt', 'w');
//     const result = await fs.readFile('read-big.txt');

//     await destFile.write(result);
//     console.timeEnd("copy");
// })()


(async () => {
    console.time("copy");
    const destFile = await fs.open('abc.txt', 'w');
    const srcFile = await fs.open('read-big.txt', 'r');

    let bytesRead = -1;
    while (bytesRead !== 0) {
        const readResult = await srcFile.read();
        bytesRead = readResult.bytesRead;

        if (bytesRead === 0) break;

        await destFile.write(readResult.buffer, 0, bytesRead);
    }

    await srcFile.close();
    await destFile.close();
    console.timeEnd("copy");
})()
