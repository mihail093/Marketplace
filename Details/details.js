// Scrivo 2 costanti, una per l'endpoint, una per il token
const url = "https://striveschool-api.herokuapp.com/api/product/";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNhMWJmOTBiM2IyNTAwMTUxYjU0MmIiLCJpYXQiOjE3MTU1MzI4NjcsImV4cCI6MTcxNjc0MjQ2N30.R4Nn4SbvTp-ZKjR-QttuzyItjQcPExoKVsd738pEOVg";

// Scrivo 2 costanti per estrarre i parametri dell'ID del prodotto
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// PUNTATORI
const titleDetails = document.getElementById("titleDetails");
const paragraphDetails = document.getElementById("paragraphDetails");
const imgDetails = document.getElementById("imgDetails");

// Riporto la funzione generale da utilizzare per tutti i metodi di richiesta HTTP
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
async function getProduct() {
    try {
      showSpinner();
      const item = await fetchData(url + productId, {
          headers: {
              "Authorization": `Bearer ${token}`
            }
      });
      hideSpinner();
      return addCardProduct(item);
    } catch (error) {
        console.error("Error fetching products:", error);
        Msg("Error fetching products");
      }
}

// Funzione per aggiungere il prodotto e visualizzarlo
function addCardProduct(item) {
    // Inserisco il nome, la descrizione e l'immagine nei loro rispettivi contenitori
    titleDetails.innerText = item.name;
    paragraphDetails.innerText = item.description;
    // il tag <img> manca in 'details.html' quindi prima lo creo 
    const productImg = CreateTagWithText("img", item.imageUrl);
    // Inserisco anche l'alt
    productImg.alt = `Image ${item.name}`;
    // Inserisco <img> all'interno di 'imgDetails'
    imgDetails.appendChild(productImg);
}

// Al caricamento della pagina
document.addEventListener("DOMContentLoaded", getProduct);

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



