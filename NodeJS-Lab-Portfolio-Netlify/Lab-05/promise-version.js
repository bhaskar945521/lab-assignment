function placeOrder(item) { 

    return new Promise((resolve, reject) => {

        console.log(`Order placed: ${item}`); 

        setTimeout(() => {

            const success = Math.random() > 0.2; //randome no. to track delivery success or fail

            if (success) {

                resolve(`${item} is out for delivery!`);

            } else {

                reject(`Sorry, the restaurant could not prepare ${item}`);

            }

        }, 2000); //2 second 

    });
}


placeOrder("Pizza")

    .then((message) => {

        console.log(message);

    })

    .catch((error) => {

        console.log(error);

    });