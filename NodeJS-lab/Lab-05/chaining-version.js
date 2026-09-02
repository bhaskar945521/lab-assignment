function placeOrder() {

    return new Promise((resolve) => {

        setTimeout(() => {

            console.log("Order Placed");

            resolve();

        }, 1000);

    });

}


function prepareOrder() {

    return new Promise((resolve) => {

        setTimeout(() => {

            console.log("Preparing Food");

            resolve();

        }, 1000);

    });

}


function outForDelivery() {

    return new Promise((resolve) => {

        setTimeout(() => {

            console.log("Out For Delivery");

            resolve();

        }, 1000);

    });

}


function delivered() {

    return new Promise((resolve) => {

        setTimeout(() => {

            console.log("Delivered");

            resolve();

        }, 1000);

    });

}

placeOrder()

    .then(() => prepareOrder())

    .then(() => outForDelivery())

    .then(() => delivered())

    .then(() => {

        console.log("Order Completed Successfully!");

    })

    .catch((error) => {

        console.log(error);

    });