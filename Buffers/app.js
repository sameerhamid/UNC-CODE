const {Buffer} = require('buffer');

const memoryContainer = Buffer.alloc(4) // 4 bytes (32 bits)

memoryContainer.write("same");

console.log(memoryContainer);
