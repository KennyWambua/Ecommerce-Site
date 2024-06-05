let contentTitle; 

console.log(document.cookie);
function dynamicClothingSection(ob) {
  let boxDiv = document.createElement("div");
  boxDiv.id = "box";

  let boxLink = document.createElement("a");
  // boxLink.href = '#'
  boxLink.href = "/contentDetails?" + ob.id;
  // console.log('link=>' + boxLink);

  let imgTag = document.createElement("img");
  // imgTag.id = 'image1'
  // imgTag.id = ob.photos
  imgTag.src = ob.preview;

  let detailsDiv = document.createElement("div");
  detailsDiv.id = "details";

  let h3 = document.createElement("h3");
  let h3Text = document.createTextNode(ob.name);
  h3.appendChild(h3Text);

  let h4 = document.createElement("h4");
  let h4Text = document.createTextNode(ob.brand);
  h4.appendChild(h4Text);

  let h2 = document.createElement("h2");
  let h2Text = document.createTextNode("$  " + (ob.price)/100);
  h2.appendChild(h2Text);

  boxDiv.appendChild(boxLink);
  boxLink.appendChild(imgTag);
  boxLink.appendChild(detailsDiv);
  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(h4);
  detailsDiv.appendChild(h2);

  return boxDiv;
}

//  TO SHOW THE RENDERED CODE IN CONSOLE
// console.log(dynamicClothingSection());

// console.log(boxDiv)

let containerClothing = document.getElementById("containerClothing");
let containerAccessories = document.getElementById("containerAccessories");

// BACKEND CALLING
// BACKEND CALLING
let httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange = function() {
  if (this.readyState === 4) {
    if (this.status == 200) {
      contentTitle = JSON.parse(this.responseText);
      if (document.cookie.indexOf(",counter=") >= 0) {
        var counter = document.cookie.split(",")[1].split("=")[1];
        document.getElementById("badge").innerHTML = counter;
      }
      for (let i = 0; i < contentTitle.length; i++) {
        let product = contentTitle[i];
        let category = product.isAccessory ? 'accessories' : 'clothing';

        // Check if the product is already displayed
        if (document.getElementById(category + product.id)) {
          continue; // Product already displayed, skip
        }

        // Render product on the page
        let container = category === 'clothing' ? containerClothing : containerAccessories;
        container.appendChild(dynamicClothingSection(product));

        // Send the product to the server to save only once
        fetch('/save-product', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ product: product, category: category })
        })
        .then(response => {
          if (!response.ok) {
            console.error('Failed to save product:', response.statusText);
          }
        })
        .catch(error => console.error('Error:', error));
      }
    } else {
      console.log("call failed!");
    }
  }
};

httpRequest.open(
  "GET",
  "https://5d76bf96515d1a0014085cf9.mockapi.io/product",
  true
);
httpRequest.send();
