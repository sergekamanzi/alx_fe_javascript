// Initial Quotes Data
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Life" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Inspiration" }
];

// Get DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// Show Random Quote Function
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerText = "No quotes available. Please add one!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" <br><small>- Category: ${quote.category}</small>`;
}

// Create Add Quote Form Dynamically (as required)
function createAddQuoteForm() {
  const formSection = document.createElement("div");
  formSection.classList.add("form-section");

  // Input for quote text
  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  // Input for category
  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  // Add button
  const addBtn = document.createElement("button");
  addBtn.innerText = "Add Quote";
  addBtn.addEventListener("click", addQuote);

  // Append children to form section
  formSection.appendChild(inputText);
  formSection.appendChild(inputCategory);
  formSection.appendChild(addBtn);

  // Add form to body
  document.body.appendChild(formSection);
}

// Add Quote Function
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category!");
    return;
  }

  // Add to quotes array
  quotes.push({ text, category });

  // Clear inputs
  textInput.value = "";
  categoryInput.value = "";

  // Update DOM immediately (show new quote)
  quoteDisplay.innerHTML = `"${text}" <br><small>- Category: ${category}</small>`;

  alert("New quote added successfully!");
}

// ✅ Event Listener on "Show New Quote" button
newQuoteBtn.addEventListener("click", showRandomQuote);

// ✅ Create the form dynamically on page load
createAddQuoteForm();
