function* gen() {
    console.log("A");
    yield;

    console.log("B");
    yield;

    console.log("C");
    yield;

    console.log("D");
}


const funCall = gen();

// console.log(funCall.next());
// console.log(funCall.next());
// console.log(funCall.next());
// console.log(funCall.next());
// console.log(funCall.next());

function* fun2() {
    const a = yield;
    const b = yield;

    console.log(a + b);
}


const fun2Call = fun2();

// console.log(fun2Call.next());
// console.log(fun2Call.next(2));
// console.log(fun2Call.next(3));

function* fun3() {
    console.log("calling>>>>");
    yield 1;
    yield 2;
    yield 3;
}

const fun3Call = fun3();
// console.log(fun3Call.next());
// console.log(fun3Call.next());
// console.log(fun3Call.next());
// console.log(fun3Call.next().done);


function* fun4() {
    yield* fun3();
    yield 4;
    yield 5;
    yield 6;
}


// for(let val of fun4()) {
//     console.log('value>>>>', val)
// }

function* fun5() {
    let count = 0;
    while(true) {
        yield count;
        count++;
    }
    console.log("count>>>>>>>>>>>", count);
}


const fun5Call = fun5();

console.log(fun5Call.next().value);
console.log(fun5Call.next().value);
console.log(fun5Call.next().value);
console.log(fun5Call.next().value);
console.log(fun5Call.next().value);
console.log(fun5Call.next().value);
