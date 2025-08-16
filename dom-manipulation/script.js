// =================== QUOTE STORAGE LOGIC ===================
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Life" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Inspiration" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// =================== DOM ELEMENTS ===================
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// =================== POPULATE CATEGORIES ===================
function populateCategories() {
  // Clear old categories
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter from localStorage
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory && [...categoryFilter.options].some(o => o.value === savedCategory)) {
    categoryFilter.value = savedCategory;
    filterQuotes();
  }
}

// =================== FILTER QUOTES ===================
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerText = "No quotes available for this category.";
    return;
  }

  // Show first matching quote
  const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.innerHTML = `"${quote.text}" <br><small>- Category: ${quote.category}</small>`;
}

// =================== SHOW RANDOM QUOTE ===================
function showRandomQuote() {
  let availableQuotes = quotes;

  const selectedCategory = categoryFilter.value;
  if (selectedCategory !== "all") {
    availableQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (availableQuotes.length === 0) {
    quoteDisplay.innerText = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * availableQuotes.length);
  const quote = availableQuotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" <br><small>- Category: ${quote.category}</small>`;

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// =================== CREATE ADD QUOTE FORM ===================
function createAddQuoteForm() {
  const formSection = document.createElement("div");
  formSection.classList.add("form-section");

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.innerText = "Add Quote";
  addBtn.addEventListener("click", addQuote);

  formSection.appendChild(inputText);
  formSection.appendChild(inputCategory);
  formSection.appendChild(addBtn);

  document.body.appendChild(formSection);
}

// =================== ADD QUOTE ===================
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category!");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  textInput.value = "";
  categoryInput.value = "";

  populateCategories();
  filterQuotes();

  alert("New quote added successfully!");
}

// =================== EXPORT TO JSON ===================
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

// =================== IMPORT FROM JSON ===================
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);

      if (!Array.isArray(importedQuotes)) {
        alert("Invalid JSON format! Must be an array of quotes.");
        return;
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Error parsing JSON file!");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// =================== EVENT LISTENERS ===================
newQuoteBtn.addEventListener("click", showRandomQuote);

// =================== INIT APP ===================
createAddQuoteForm();
populateCategories();

// Restore last viewed quote if available
const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const parsed = JSON.parse(lastQuote);
  quoteDisplay.innerHTML = `"${parsed.text}" <br><small>- Category: ${parsed.category}</small>`;
}
