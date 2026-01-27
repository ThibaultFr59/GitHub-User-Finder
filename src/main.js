import "./style.css";

// Select HTML elements
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("text-field");
const mainContainer = document.getElementById("profile-container");

// Add Event Listener

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  getUserProfile(searchInput.value);
});

async function getUserProfile(username) {
  console.log(username);
  const url = `https://api.github.com/users/${username}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
}
