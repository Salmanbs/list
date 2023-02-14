

const filterForm = document.getElementById("filter-form");
const productList = document.getElementById("product-list");
const productTemplate = document.getElementById("product-template");

const filterRating = document.getElementById("filter-rating");
const filterCategory = document.getElementById("filter-category");

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

function renderProducts(products) {
  productList.innerHTML = "";
  products.map(({title,price,image,category,rating:{rate}}) => {
    const productContent = productTemplate.content.cloneNode(true);
    productContent.querySelector(".product-title").textContent = title;
    productContent.querySelector(".product-price").textContent = `$${price}`;
    productContent.querySelector(".product-image").src = image;
    productContent.querySelector(".product-category").textContent = category;
    productContent.querySelector(".product-rating").textContent = `Rating: ${rate}`;
    productList.appendChild(productContent);
  });
}



function populateCategory(products) {
  const categories = new Set();

  products.map(product => categories.add(product.category))
  // products.forEach(product => categories.add(product.category));

  Array.from(categories).forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    filterCategory.appendChild(option);
  });
}


fetch("https://fakestoreapi.com/products")
  .then(res => res.json())
  .then(products => {

    renderProducts(products);
    populateCategory(products);


    function filterProducts(e) {
      e.preventDefault();
      const minRating = parseInt(filterRating.value);

      let filteredProducts = products.filter(product => {
        if (filterRating.value && (product.rating.rate < minRating || product.rating.rate >= minRating + 1)) {
          return false;
        }
        if (filterCategory.value && product.category !== filterCategory.value) {
          return false;
        }
        return true;
      });

      // Search for product by title after filtering
      if (searchInput.value) {
        const searchTerm = searchInput.value.toLowerCase();
        filteredProducts = filteredProducts.filter(product => product.title.toLowerCase().includes(searchTerm));
      }

      renderProducts(filteredProducts);
    }

    function searchProducts(e) {
      e.preventDefault();
      const searchTerm = searchInput.value.toLowerCase();

      let searchedProducts = products;
      if (filterRating.value) {
        const minRating = parseInt(filterRating.value);
        searchedProducts = searchedProducts.filter(product => {
          if (product.rating.rate < minRating || product.rating.rate >= minRating + 1) {
            return false;
          }
          return true;
        });
      }
      if (filterCategory.value) {
        searchedProducts = searchedProducts.filter(product => product.category === filterCategory.value);
      }
      searchedProducts = searchedProducts.filter(product => product.title.toLowerCase().includes(searchTerm));

      renderProducts(searchedProducts);
    }

    filterForm.addEventListener("submit", filterProducts);
    searchForm.addEventListener("submit", searchProducts);

  });