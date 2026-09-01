function processOrder(item) {

    return new Promise((resolve) => {

        setTimeout(() => {

            console.log(`${item} completed`);

            resolve(`${item} order completed`);

        }, 2000);

    });

}


const startTime = Date.now();


Promise.all([
    processOrder("Pizza"),
    processOrder("Burger"),
    processOrder("Coffee")
])

.then((results) => {

    console.log(results);

    const endTime = Date.now();

    console.log(`Total Time: ${endTime - startTime} ms`);

})

.catch((error) => {

    console.log(error);

});