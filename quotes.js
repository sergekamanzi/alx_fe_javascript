// quotes.js

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const syncBtn = document.getElementById("syncBtn");
const notification = document.getElementById("notification");

// Local storage key
const LOCAL_STORAGE_KEY = "quotes";

// Simulated server API
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API

// Helper: Get quotes from local storage
function getLocalQuotes() {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
}

// Helper: Save quotes to local storage
function saveLocalQuotes(quotes) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
}

// Display a random quote
function displayRandomQuote() {
  const quotes = getLocalQuotes();
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Add one!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.textContent = quotes[randomIndex].text;
}

// Add new quote (local only for now)
function addQuote() {
  const newQuote = prompt("Enter your new quote:");
  if (!newQuote) return;

  const quotes = getLocalQuotes();
  const newEntry = { id: Date.now(), text: newQuote };

  quotes.push(newEntry);
  saveLocalQuotes(quotes);

  displayRandomQuote();
  showNotification("Quote added locally!");
}

// Fetch quotes from server (simulate sync)
async function fetchServerQuotes() {
  try {
    const res = await fetch(SERVER_URL);
    const data = await res.json();

    // Simulate that "quotes" come from server (map API data to quotes)
    const serverQuotes = data.slice(0, 5).map(item => ({
      id: item.id,
      text: item.title
    }));

    return serverQuotes;
  } catch (error) {
    console.error("Error fetching server quotes:", error);
    return [];
  }
}

// Sync with server (server wins on conflict)
async function syncQuotes() {
  const localQuotes = getLocalQuotes();
  const serverQuotes = await fetchServerQuotes();

  // Conflict resolution: server overwrites local
  const mergedQuotes = [...serverQuotes, ...localQuotes.filter(
    lq => !serverQuotes.find(sq => sq.id === lq.id)
  )];

  saveLocalQuotes(mergedQuotes);
  displayRandomQuote();
  showNotification("Data synced with server (server version kept).");
}

// Notification
function showNotification(message) {
  notification.textContent = message;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

// Periodic sync every 20s
setInterval(syncQuotes, 20000);

// Event Listeners
addQuoteBtn.addEventListener("click", addQuote);
syncBtn.addEventListener("click", syncQuotes);

// Initial load
displayRandomQuote();
