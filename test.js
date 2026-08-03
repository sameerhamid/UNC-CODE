
// const str = "sameer";
// str.name = "sameer";
// console.log(str.name)


// const person = {
//     name: "sameer"
// }

// function greet(args) {
//     console.log(`Hello ${this.name}`);
//     console.log(args);
// }


// greet.call(person, ['sameer']);


const person = {
    name: "Sameer",

    greet() {
        console.log(this.name);
    }
};

const fn = person.greet;

fn(); // undefined
