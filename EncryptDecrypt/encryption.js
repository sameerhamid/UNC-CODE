const {Transform} = require('node:stream');
const fs = require('node:fs/promises');

class Encryption extends Transform {
    _transform(chunk, encoding, callback) {
        // console.log(chunk.toString('utf-8'));
        for (let i = 0; i < chunk.length; i++) {
            if (chunk[i] !== 255) {
                // < 34 + 1, 45 + 1, 56 + 1, 28 +1 , 68 + 1 + .....>
                chunk[i] = chunk[i] +1;
             }
        }
        callback(null, chunk);
    }
}


(async () => {
    const readFileHandle = await fs.open('read.txt', 'r');
    const writeFileHandle = await fs.open('write.txt', 'w');

    const readStream = readFileHandle.createReadStream();
    const writeStream = writeFileHandle.createWriteStream();
    const encryption = new Encryption();
    readStream.pipe(encryption).pipe(writeStream);
})()
