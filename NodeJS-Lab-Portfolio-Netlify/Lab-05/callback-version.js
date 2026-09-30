function placeOrderCallback(item, callback) {

    console.log(`Order placed: ${item}`); //Order place - Pizza 

    setTimeout(() => {

        callback();

    }, 2000);
}


function trackOrderCallback(item, callback) {

    console.log(`Tracking order: ${item}`); //Track order - Pizza 

    setTimeout(() => {

        callback();

    }, 2000);
}


function confirmDeliveryCallback(item, callback) {

    console.log(`Delivery confirmed: ${item}`); // Delevery confirmed - Pizza 

    setTimeout(() => {

        callback();

    }, 2000);
}


// Callback Nesting

placeOrderCallback("Pizza", () => {

    trackOrderCallback("Pizza", () => {

        confirmDeliveryCallback("Pizza", () => {

            console.log("Order completed successfully!");

        });

    });

});