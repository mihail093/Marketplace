// Scrivo 2 costanti, una per l'endpoint, una per il token
const url = "https://striveschool-api.herokuapp.com/api/product/";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNhMWJmOTBiM2IyNTAwMTUxYjU0MmIiLCJpYXQiOjE3MTU1MzI4NjcsImV4cCI6MTcxNjc0MjQ2N30.R4Nn4SbvTp-ZKjR-QttuzyItjQcPExoKVsd738pEOVg";

// PUNTATORI
const form = document.getElementById("product-form");
const mainContainer = document.getElementById("product-cards");

// Scrivo una funzione generale da utilizzare per tutti i metodi di richiesta HTTP
async function fetchData(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Errore:", error);
    Msg("An error occurred.");
  }
}

// GET
async function getProducts() {
  try {
    showSpinner();
    const products = await fetchData(url, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    hideSpinner();
    products.forEach(product => addCardProduct(product));
  } catch (error) {
    console.error("Error fetching products:", error);
    Msg("Error fetching products");
  }
}

// POST
async function createProduct(product) {
  try {
    showSpinner();
    const newProduct = await fetchData(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    });
    hideSpinner();
    addCardProduct(newProduct);
    Msg("Product added successfully!");
  } catch (error) {
    console.error("Error creating product:", error);
    Msg("Error adding product.");
  }
}

// Funzione per aggiungere i prodotti alla card e visualizzarli
function addCardProduct(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  const cardImg = document.createElement("div");
  cardImg.className = "product-card-img";
  
  // Funzioni per creare uno specifico tag ed inserirci i dati del prodotto 
  const productName = CreateTagWithText("h2", product.name);
  const productDescription = CreateTagWithText("p", product.description);
  const productBrand = CreateTagWithText("h3", `Brand: ${product.brand}`);
  const productImg = CreateTagWithText("img", product.imageUrl);
  const productPrice = CreateTagWithText("h5", `Price EUR: ${product.price}`);

  // Funzioni per creare il bottone per modificare e per eliminare i prodotti
  const editButton = createButton("EDIT", () => editProduct(product._id, card));
  const deleteButton = createButton("DELETE", () => deleteProduct(product._id, card));

  // Inserisco gli elementi nei loro rispettivi contenitori
  cardImg.appendChild(productImg);
  card.appendChild(cardImg);
  card.appendChild(productName);
  card.appendChild(productBrand);
  card.appendChild(productDescription);
  card.appendChild(productPrice);
  card.appendChild(editButton);
  card.appendChild(deleteButton);
  mainContainer.appendChild(card);
}

// Scrivo la funzione che crea il bottone (testo del bottone e funzione .onclick)
function createButton(text, onClick) {
  const button = document.createElement("div");
  button.classList.add("button");
  button.textContent = text;
  button.onclick = onClick;
  return button;
}

// Al caricamento della pagina
document.addEventListener("DOMContentLoaded", function () {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formProductName = document.getElementById("name").value;
    const formProductDescription = document.getElementById("description").value;
    const formProductBrand = document.getElementById("brand").value;
    const formProductImg = document.getElementById("imgUrl").value;
    const formProductPrice = document.getElementById("price").value;
    
    // Scrivo una funzione per gestire i campi che devono essere compilati obbligatoriamente
    if (!formProductName.trim() || !formProductBrand.trim() || !formProductPrice.trim()) {
      alert("Name, brand and price fields are required");
      return;
    }

    // Creo l'oggetto con tutte le info sul prodotto
    const productObj = {
      name: formProductName,
      description: formProductDescription,
      brand: formProductBrand,
      imageUrl: formProductImg,
      price: formProductPrice,
    };
    createProduct(productObj);
    form.reset();
  });
  getProducts();
});

// Scrivo la funzione 'editProduct'
function editProduct(productId, card) {
  const newName = prompt("New name:", card.querySelector("h2").innerText);
  const newDescription = prompt("New description:", card.querySelector("p").innerText);
  const newBrand = prompt("New brand:", card.querySelector("h3").innerText.split(": ")[1]);
  const newImgUrl = prompt("New image URL:", card.querySelector("img").src);
  const newPrice = prompt("New Price EUR:", card.querySelector("h5").innerText.split(": ")[1]);
  if (newName && newDescription && newBrand && newImgUrl && newPrice) {
    updateProduct(productId, { 
      name: newName, 
      description: newDescription, 
      brand: newBrand, 
      imageUrl: newImgUrl, 
      price: newPrice
      }, card);
  }
}

// PUT - scrivo la funzione 'updateProduct'
async function updateProduct(productId, data, card) {
  try {
    showSpinner();
    const updatedProduct = await fetchData(url + productId, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    hideSpinner();
    console.log("Updated product:", updatedProduct);
    card.querySelector("h2").innerText = updatedProduct.name;
    card.querySelector("p").innerText = updatedProduct.description;
    card.querySelector("h3").innerText = `Brand: ${updatedProduct.brand}`;
    card.querySelector("img").src = updatedProduct.imageUrl;
    card.querySelector("h5").innerText = `Price EUR: ${updatedProduct.price}`;
  } catch (error) {
    console.error("Error updating product:", error);
    Msg("Error updating product.");
  }
}

// DELETE
function deleteProduct(productId, card) {
  if (confirm("Are you sure you want to delete this product?")) {
    fetchData(url + productId, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(() => {
      console.log("Product deleted");
      card.remove();
    })
    .catch((error) => {
      console.error("Error deleting product:", error);
      Msg("Error deleting product.");
    });
  }
}

// Scrivo le funzioni per mostrare e nascondere lo spinner
function showSpinner() {
  document.getElementById("spinner").style.display = "block";
}

function hideSpinner() {
  document.getElementById("spinner").style.display = "none";
}

// Scrivo la funzione che mi consente di visualizzare il messaggio
function Msg(message) {
  const messageBox = document.getElementById("message-box");
  messageBox.textContent = message;
  messageBox.style.display = "block";
  setTimeout(() => {
    messageBox.style.display = "none";
  }, 3000);
}

// Scrivo la funzione per creare uno specifico tag ed inserire del testo
function CreateTagWithText(tagType, text) {
  const tag = document.createElement(tagType);
  if (tagType === "img") {
    tag.src = text;
  } else {
    tag.textContent = text;
  }
  return tag;
}