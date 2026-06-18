const EventEmmiter = require('./events');

const myEm = new EventEmmiter();

const callback1 = () => {
    console.log("calling second time")
}

const callback2 = () => {
    console.log("calling once")
}

myEm.once("once", callback1);

myEm.once("once", callback2);

myEm.emit("once")
myEm.emit("once")
