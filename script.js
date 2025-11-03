let books = [];
let currentBook = null;

async function loadLibrary() {
  const res = await fetch("books.json");
  books = await res.json();

  // Continue Reading
  const lastRead = JSON.parse(localStorage.getItem("lastRead"));
  if (lastRead) {
    document.getElementById("continueContent").innerHTML =
      `<a href="#" onclick="loadBook('${lastRead.file}')">${lastRead.title}</a>`;
    showSuggestions(lastRead.genre, lastRead.file);
  }

  // Genres
  const genres = [...new Set(books.map(b => b.genre))];
  document.getElementById("genreButtons").innerHTML =
    genres.map(g => `<button onclick="filterByGenre('${g}')">${g}</button>`).join("");
}

function showSuggestions(genre, excludeFile) {
  const suggestions = books.filter(b => b.genre === genre && b.file !== excludeFile);
  document.getElementById("suggestedList").innerHTML =
    suggestions.map(b => `<li><a href="#" onclick="loadBook('${b.file}')">${b.title}</a></li>`).join("");
}

function filterByGenre(genre) {
  const list = books.filter(b => b.genre === genre);
  document.getElementById("genreList").innerHTML =
    list.map(b => `<li><a href="#" onclick="loadBook('${b.file}')">${b.title}</a></li>`).join("");
}

async function loadBook(filename) {
  const res = await fetch(`books/${filename}`);
  const text = await res.text();
  const book = books.find(b => b.file === filename);

  document.getElementById("bookTitle").textContent = book.title;
  document.getElementById("content").innerHTML = marked.parse(text);

  // Save progress
  localStorage.setItem("lastRead", JSON.stringify(book));
  showSuggestions(book.genre, book.file);
}

loadLibrary();
