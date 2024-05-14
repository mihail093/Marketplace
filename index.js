// Scrivo 2 costanti, una per l'endpoint, una per il token
const url = "https://striveschool-api.herokuapp.com/api/product/";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNhMWJmOTBiM2IyNTAwMTUxYjU0MmIiLCJpYXQiOjE3MTU1MzI4NjcsImV4cCI6MTcxNjc0MjQ2N30.R4Nn4SbvTp-ZKjR-QttuzyItjQcPExoKVsd738pEOVg";

// PUNTATORI
const mainDiv = document.getElementById("mainDiv");

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

// Funzione per aggiungere i prodotti alla card e visualizzarli
function addCardProduct(product) {
    // Creo 3 div e assegno delle classi di Bootstrap
    const colDiv = document.createElement("div");
    colDiv.className = "col my-3";
    const card = document.createElement("div");
    card.className = "card";
    card.style = "width: 18rem";
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    
    // Funzioni per creare uno specifico tag ed inserirci i dati del prodotto 
    const productName = CreateTagWithText("h3", product.name);
    const productBrand = CreateTagWithText("h4", `Brand: ${product.brand}`);
    const productImg = CreateTagWithText("img", product.imageUrl);
    const productPrice = CreateTagWithText("h5", `Price: ${product.price} EUR`);
    const productDetails = CreateTagWithText("a", "Details");

    // Assegno delle classi Bootstrap alle costanti appena scritte
    productName.className = "card-title";
    productBrand.className = "card-title";
    productImg.className = "card-img-top";
    productPrice.className = "card-title";
    productDetails.className = "btn btn-info";

    /*
    Aggiungo gli attributi 'alt' e 'href' rispettivamente ai tag 'img' e 'a'
    Al 'href' aggiungo i parametri dell'ID del prodotto che estrarrò nella pagina 
    relativa ai dettagli del prodotto per poter caricare i dati dall'API
    */
    productImg.alt = `Image ${product.name}`;
    productDetails.href = `Details/details.html?id=${product._id}`;

    // Inserisco gli elementi nei loro rispettivi contenitori
    colDiv.appendChild(card);
    card.appendChild(productImg);
    card.appendChild(cardBody);
    cardBody.appendChild(productName);
    cardBody.appendChild(productBrand);
    cardBody.appendChild(productPrice);
    cardBody.appendChild(productDetails);
    mainDiv.appendChild(colDiv);
}

// Al caricamento della pagina
document.addEventListener("DOMContentLoaded", getProducts);

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

// Funzione per creare uno specifico tag ed inserire del testo
function CreateTagWithText(tagType, text) {
    const tag = document.createElement(tagType);
    if (tagType === "img") {
      tag.src = text;
    } else {
      tag.textContent = text;
    }
    return tag;
}

