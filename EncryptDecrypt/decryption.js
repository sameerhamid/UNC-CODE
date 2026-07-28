const {Transform} = require('node:stream');
const fs = require('node:fs/promises');

class Decryption extends Transform {
    _transform(chunk, encoding, callback) {
        for (let i = 0; i < chunk.length; i++) {
            if (chunk[i] !== 255) {
                chunk[i] = chunk[i] - 1
            }
        }
        callback(null, chunk);
    }
}


(async () => {
    const readFileHandle = await fs.open('write.txt', 'r');
    const writeFileHandle = await fs.open('decrypted.txt', 'w');

    const readStream = readFileHandle.createReadStream();
    const writeStream = writeFileHandle.createWriteStream();
    const decryption = new Decryption();
    readStream.pipe(decryption).pipe(writeStream);
})()
