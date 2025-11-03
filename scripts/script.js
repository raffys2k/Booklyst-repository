let books = [];

// Utility: render a book as a clickable cover card
function renderBookCard(book) {
  return `
    <div class="book-card" onclick="loadBook('${book.file}')">
      <img src="${book.cover}" alt="${book.title} cover">
    </div>
  `;
}

// Load the library and build UI sections
async function loadLibrary() {
  const res = await fetch("../books.json");
  books = await res.json();

  // Continue Reading
  const lastRead = JSON.parse(localStorage.getItem("lastRead"));
  if (lastRead) {
    document.getElementById("continueContent").innerHTML = renderBookCard(lastRead);
    showSuggestions(lastRead.genre, lastRead.file);
  } else {
    document.getElementById("continueContent").innerHTML = "<p>No book opened yet.</p>";
  }

  // Genre buttons
  const genres = [...new Set(books.map(b => b.genre))];
  document.getElementById("genreButtons").innerHTML =
    genres.map(g => `<button onclick="filterByGenre('${g}')">${g}</button>`).join("");
}

// Show suggested works based on genre
function showSuggestions(genre, excludeFile) {
  const suggestions = books.filter(b => b.genre === genre && b.file !== excludeFile);
  if (suggestions.length > 0) {
    document.getElementById("suggestedList").innerHTML =
      suggestions.map(renderBookCard).join("");
  } else {
    document.getElementById("suggestedList").innerHTML = "<p>No suggestions available.</p>";
  }
}

// Filter library by genre
function filterByGenre(genre) {
  const list = books.filter(b => b.genre === genre);
  if (list.length > 0) {
    document.getElementById("genreList").innerHTML =
      list.map(renderBookCard).join("");
  } else {
    document.getElementById("genreList").innerHTML = "<p>No books in this genre.</p>";
  }
}

// Load and display a book
async function loadBook(filename) {
  const res = await fetch(`books/${filename}`);
  const text = await res.text();
  const book = books.find(b => b.file === filename);

  document.getElementById("bookTitle").textContent = book.title;
  document.getElementById("content").innerHTML = marked.parse(text);

  // Save last read book
  localStorage.setItem("lastRead", JSON.stringify(book));

  // Update suggestions
  showSuggestions(book.genre, book.file);

  // Switch views
  document.getElementById("library").style.display = "none";
  document.getElementById("reader").style.display = "block";
}

// Back to library
function backToLibrary() {
  document.getElementById("reader").style.display = "none";
  document.getElementById("library").style.display = "block";
}

loadLibrary();
