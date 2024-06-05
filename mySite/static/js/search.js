document.addEventListener('DOMContentLoaded', function () {
    console.log('search.js loaded');

    const searchResultsContainer = document.getElementById('containerClothing'); // Updated ID to match the one used in home.html

    // Check if the search-results container is found
    if (!searchResultsContainer) {
        console.error('search-results element not found');
        return;
    }

    // Get the search query from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    console.log('Search query:', query);

    if (query) {
        fetch('https://5d76bf96515d1a0014085cf9.mockapi.io/product')
            .then(response => response.json())
            .then(products => {
                console.log('Fetched products:', products);
                const filteredResults = products.filter(product => 
                    product.name.toLowerCase().includes(query)
                );
                console.log('Filtered results:', filteredResults);
                displaySearchResults(filteredResults);
            })
            .catch(error => console.error('Error fetching search results:', error));
    }

    function displaySearchResults(results) {
        searchResultsContainer.innerHTML = '';  // Clear previous results
        if (results.length > 0) {
            results.forEach(result => {
                const resultItem = dynamicClothingSection(result); // Use the same function as in home.html
                searchResultsContainer.appendChild(resultItem);
            });
        } else {
            searchResultsContainer.innerHTML = '<p> No results found </p>';
        }
    }

    // dynamicClothingSection function copied from content.js
    function dynamicClothingSection(ob) {
        let boxDiv = document.createElement("div");
        boxDiv.id = "box";

        let boxLink = document.createElement("a");
        boxLink.href = "/contentDetails?" + ob.id;

        let imgTag = document.createElement("img");
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
        let h2Text = document.createTextNode("$ " + (ob.price / 100));
        h2.appendChild(h2Text);

        boxDiv.appendChild(boxLink);
        boxLink.appendChild(imgTag);
        boxLink.appendChild(detailsDiv);
        detailsDiv.appendChild(h3);
        detailsDiv.appendChild(h4);
        detailsDiv.appendChild(h2);

        return boxDiv;
    }
});
