function increaseByTen(array) {
    return array.map(number => number + 10);
}


function test() {
    let result = [11, 20, 30];
    let realResult = increaseByTen([1,10,20]);
    const compareArrays = (a, b) => {
        return JSON.stringify(a) === JSON.stringify(b);
    };

    if(compareArrays(result,realResult)) {
        console.log('test passed');
    } else {
        console.error('test not passed');
    }
}
test();
//asdasdasd