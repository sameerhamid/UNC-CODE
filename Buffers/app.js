const {Buffer} = require('buffer');

const memoryContainer = Buffer.alloc(4) // 4 bytes (32 bits)

memoryContainer.write("same");

// const buff = Buffer.from(['0x48', '0x69', '0x21']);
const buff = Buffer.from('486921', 'hex');

console.log(buff.toString('utf-8'));

// console.log(memoryContainer);
