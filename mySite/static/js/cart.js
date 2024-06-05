document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('orderForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const emailError = document.getElementById('emailError');

        fetch('/submit_order', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/orderPlaced';
            } else {
                if (data.errors.email) {
                    emailError.textContent = data.errors.email[0];
                } else {
                    emailError.textContent = '';
                }
            }
        })
        .catch(error => console.error('Error:', error));
    });

    initializeCart();
     // Add event listener for the close button
     document.getElementById('closeOrderFormButton').addEventListener('click', function() {
        document.getElementById('orderFormContainer').style.display = 'none';
        document.getElementById('cartMainContainer').style.display = 'block';
    });
});

console.clear();

let contentTitle = [];  // Global variable to store product data

function initializeCart() {
    if (document.cookie.indexOf(',counter=') >= 0) {
        let counter = document.cookie.split(',')[1].split('=')[1];
        document.getElementById("badge").innerHTML = counter;
    }

    let cartContainer = document.getElementById('cartContainer');
    let boxContainerDiv = document.createElement('div');
    boxContainerDiv.id = 'boxContainer';
    cartContainer.appendChild(boxContainerDiv);

    let totalContainerDiv = document.createElement('div');
    totalContainerDiv.id = 'totalContainer';
    cartContainer.appendChild(totalContainerDiv);

    let totalDiv = document.createElement('div');
    totalDiv.id = 'total';
    totalContainerDiv.appendChild(totalDiv);

    let totalh2 = document.createElement('h2');
    let h2Text = document.createTextNode('Total Amount');
    totalh2.appendChild(h2Text);
    totalDiv.appendChild(totalh2);

    // Create the buttonDiv here but do not append it yet
    let buttonDiv = document.createElement('div');
    buttonDiv.id = 'button';

    let buttonTag = document.createElement('button');
    buttonDiv.appendChild(buttonTag);

    let buttonLink = document.createElement('a');
    buttonLink.href = 'javascript:void(0);';  // Prevent default navigation
    buttonTag.appendChild(buttonLink);

    let buttonText = document.createTextNode('Place Order');
    buttonTag.appendChild(buttonText);

    buttonTag.onclick = function () {
        // Hide the cart container and show the order form
        document.getElementById('cartMainContainer').style.display = 'none';
        document.getElementById('orderFormContainer').style.display = 'block';
    }

    // Backend call to fetch product data
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status == 200) {
            contentTitle = JSON.parse(this.responseText);  // Store product data globally
            console.log('Fetched products:', contentTitle); // Debugging information

            let counter = Number(document.cookie.split(',')[1].split('=')[1]);
            document.getElementById("totalItem").innerHTML = ('Total Items: ' + counter);

            let items = document.cookie.split(',')[0].split('=')[1].split(" ").filter(item => item);
            let totalAmount = 0;
            let itemIndices = [];

            items.forEach((itemId, index) => {
                if (!itemIndices.includes(itemId)) {
                    let itemCounter = items.filter(id => id == itemId).length;
                    let product = contentTitle[itemId - 1];
                    if (product) {  // Check if the product exists
                        totalAmount += Number(product.price) * itemCounter;
                        dynamicCartSection(product, itemCounter, index);
                    } else {
                        console.warn('Product not found for itemId:', itemId);  // Debugging information
                    }
                    itemIndices.push(itemId);
                }
            });
            amountUpdate(totalAmount);
        } else if (this.readyState === 4) {
            console.log('call failed!');
        }
    };

    httpRequest.open('GET', 'https://5d76bf96515d1a0014085cf9.mockapi.io/product', true);
    httpRequest.send();

    // Attach the buttonDiv to totalDiv after amount update
    amountUpdate(0);  // Initialize with 0 amount
}

function dynamicCartSection(ob, itemCounter, itemIndex) {
    let boxContainerDiv = document.getElementById('boxContainer');

    let boxDiv = document.createElement('div');
    boxDiv.id = 'box';
    boxDiv.dataset.index = itemIndex; // Store the index for later use
    boxContainerDiv.appendChild(boxDiv);

    let boxImg = document.createElement('img');
    boxImg.src = ob.preview;
    boxDiv.appendChild(boxImg);

    let boxh3 = document.createElement('h3');
    let h3Text = document.createTextNode(ob.name + ' × ' + itemCounter);
    boxh3.appendChild(h3Text);
    boxDiv.appendChild(boxh3);

    let boxh4 = document.createElement('h4');
    let h4Text = document.createTextNode('Amount: $' + (ob.price * itemCounter / 100).toFixed(2));
    boxh4.appendChild(h4Text);
    boxDiv.appendChild(boxh4);

    // Add Remove button
    let removeButton = document.createElement('button');
    removeButton.id = 'removeButton';
    removeButton.textContent = 'Remove';
    removeButton.onclick = function () {
        removeItemFromCart(itemIndex);
    };
    boxDiv.appendChild(removeButton);
}

function removeItemFromCart(itemIndex) {
    let orderId = document.cookie.split(',')[0].split('=')[1].split(' ');
    let counter = Number(document.cookie.split(',')[1].split('=')[1]);

    orderId.splice(itemIndex, 1); // Remove the item from the orderId array
    counter--;

    // Update the cookie
    document.cookie = "orderId=" + orderId.join(' ') + ",counter=" + counter;
    
    // Update the displayed counter
    document.getElementById("badge").innerHTML = counter;
    document.getElementById("totalItem").innerHTML = 'Total Items: ' + counter;

    // Remove the item from the DOM
    document.querySelector(`[data-index='${itemIndex}']`).remove();

    // Recalculate the total amount
    let totalAmount = 0;
    let items = orderId.filter(item => item);
    items.forEach(id => {
        let itemData = contentTitle[id - 1];
        if (itemData) {  // Check if the item data exists
            totalAmount += Number(itemData.price);
        } else {
            console.warn('Product not found for itemId:', id);  // Debugging information
        }
    });
    amountUpdate(totalAmount);
}

// Function to update the total amount displayed
function amountUpdate(amount) {
    let totalDiv = document.getElementById('total');
    let totalh4 = document.getElementById('toth4');
    if (totalh4) {
        totalh4.remove(); // Remove the old total amount display
    }

    totalh4 = document.createElement('h4');
    let totalh4Text = document.createTextNode('Amount: $ ' + (amount / 100).toFixed(2));
    totalh4.id = 'toth4';
    totalh4.appendChild(totalh4Text);
    totalDiv.appendChild(totalh4);

    // Ensure buttonDiv is appended after the amount
    let buttonDiv = document.getElementById('button');
    if (buttonDiv) {
        buttonDiv.remove(); // Remove the old buttonDiv if it exists
    }
    buttonDiv = document.createElement('div');
    buttonDiv.id = 'button';

    let buttonTag = document.createElement('button');
    buttonDiv.appendChild(buttonTag);

    let buttonLink = document.createElement('a');
    buttonLink.href = 'javascript:void(0);';  // Prevent default navigation
    buttonTag.appendChild(buttonLink);

    let buttonText = document.createTextNode('Place Order');
    buttonTag.appendChild(buttonText);

    buttonTag.onclick = function () {
        // Hide the cart container and show the order form
        document.getElementById('cartMainContainer').style.display = 'none';
        document.getElementById('orderFormContainer').style.display = 'block';
    }
    
    totalDiv.appendChild(buttonDiv);
}
