const fspromises = require('fs/promises');

// const content = fs.readFileSync("./text.txt");

// console.log(content); // Buffer

// console.log(content.toString('utf-8'));

// Promise Api

(async() => {
    try {
        await fspromises.copyFile('file.txt', "coppied-promise.txt");
    } catch (error) {
        console.log(error);
    }
})()

const fs = require('fs');
// Callback Api
fs.copyFile('file.txt', "coppied-callback.txt",  (err) => {
    if (err) {
        console.log(err);
    }
})

// Synchronous API
fs.copyFileSync('file.txt', "copied-sync.txt");
