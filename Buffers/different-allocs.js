const {Buffer} = require('buffer');

const buff1 = Buffer.alloc(1000, 0);

const unSafeBuff = Buffer.allocUnsafe(100000000) // Faster

for(let i = 0; i < unSafeBuff.length; i++) {
    if (unSafeBuff[i] !== 0) {
        console.log(`Element at position ${i} has value: ${unSafeBuff[i].toString(2)}`)
    }
}

const buff = Buffer.allocUnsafeSlow(1000)
// Buffer.from();
// Buffer.concat()


 console.log(Buffer.poolSize)
