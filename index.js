import { dateHandler } from "./modules/display.js";

const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const searchInput1 = document.getElementById("search-input1");
const cardContainer = document.getElementById("card-container");
const pagination = document.getElementById("pagination");
const prevPageButton = document.getElementById("prev-page");
const nextPageButton = document.getElementById("next-page");
const pageNumber = document.getElementById("page-number");

dateHandler();
let currentPage = 1;
const itemsPerPage = 3; //limiting number of cards to display
pagination.style.display = "none"; //to hide previous and next buttons
// event listeners for the Buttons
searchButton.addEventListener("click", () => {
  currentPage = 1;
  fetchResults(currentPage);
});

prevPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchResults(currentPage);
  }
});

nextPageButton.addEventListener("click", () => {
  currentPage++;
  fetchResults(currentPage);
});

async function fetchResults(page) {
  //query parameter for different search queries
  const apiKey = "kub1bSjX1d0CdMZxAUWiU7BAfRFw7rACVYZsEXXO";
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${searchInput.value}&end_date=${searchInput1.value}`;
  console.log(searchInput.value);
  console.log(searchInput1.value);
  await fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayResults(data, page);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
//function to display the results fetched
function displayResults(data, currentPage) {
  cardContainer.innerHTML = "";
  pagination.style.display = "block";
  try {
    if (data && data.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const itemstoDisplay = data.slice(startIndex, endIndex); //list of items to display
      console.log(itemstoDisplay);
      for (const i in itemstoDisplay) {
        const card = document.createElement("div");
        card.classList.add("card");

        const title = document.createElement("h2");
        title.textContent = itemstoDisplay[i].title;

        //   const description = document.createElement("p");
        //   description.textContent = data[i].explanation;

        if (itemstoDisplay[i].media_type === "video") {
          const video = document.createElement("iframe");
          video.src = itemstoDisplay[i].url;
          card.appendChild(video);
        } else if (itemstoDisplay[i].media_type === "image") {
          const image = document.createElement("img");
          image.src = itemstoDisplay[i].hdurl;
          card.appendChild(image);
        }

        card.appendChild(title);
        //   card.appendChild(description);
        cardContainer.appendChild(card);
      }
      const totalResults = data.length;
      console.log(totalResults);
      const totalPages = Math.ceil(totalResults / itemsPerPage); //to determine total number of pages
      pageNumber.textContent = currentPage;

      prevPageButton.disabled = currentPage === 1; //disabling previous button when current page is 1
      nextPageButton.disabled = currentPage === totalPages; //disabling next button when current page and total page are equal
    } else {
      pagination.style.display = "none";
      cardContainer.innerHTML = "No results found.";
    }
  } catch (error) {
    console.log("Error", error);
  }
}
