const { Writable }  = require('node:stream');
const fs = require('node:fs');

class FileWriteStream extends Writable {
    constructor ({highWaterMark, fileName}) {
        super({highWaterMark});
        this.fileName = fileName;
        this.fd = null;
        this.chunks = [];
        this.chuksSize = 0;
        this.writesCount = 0;
    }

    // this will run after the constructor, and it will put of calling all the other methods
    // until we call the callback function
    _construct(callback) {
        fs.open(this.fileName, 'w', (err, fd) => {
            if (err) {
                // so if we call the callback with an argument, it means that we have an error
                // and we sould not proceed.
                return callback(err)
            } else {
                this.fd = fd;
                // no argument means it was successfull
                callback();
            }
        });
    }

    _write(chunk, encoding, callback) {
        this.chunks.push(chunk);
        this.chuksSize += chunk.length;
        // do our write operation

        if (this.chuksSize > this.writableHighWaterMark) {
            fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
                if (err) {
                    return callback(err);
                } else {
                    this.chunks = [];
                    ++this.writesCount;
                    this.chuksSize = 0;
                    callback();
                }
            })
        } else {
            // when we're done, we should call the callback
            callback(null);
        }
    }

    _final (callback) {
        fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
            if (err) {
                return callback(err);
            } else {
                this.chunks = [];
                ++this.writesCount;
                this.chuksSize = 0;
                callback();
            }
        });
    }

    _destroy (error, callback) {
        console.log("Number of writes: ", this.writesCount);
        if (this.fd) {
            fs.close(this.fd, (err) => {
                callback(err || error);
            })
        } else {
            callback(error)
        }
    }

}


// const stream = new FileWriteStream({highWaterMark: 1800, fileName: 'text.txt'});
// stream.write(Buffer.from("this is some string."));
// stream.end(Buffer.from('Our last write.'));
// stream.on('finish', () => {
//     console.log("Stream was finished.");
// })
// // stream.on('drain', () => {});


(async()=> {
    console.time('writeMany');
    const stream = new FileWriteStream({ fileName: 'text.txt'});
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
    });
})()
