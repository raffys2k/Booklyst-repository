function renderBookCard(book) {
  return `
    <div class="book-card" onclick="loadBook('${book.file}')">
      <img src="${book.cover}" alt="${book.title} cover">
      <p>${book.title}</p>
    </div>
  `;
}

async function loadLibrary() {
  const res = await fetch("books.json");
  books = await res.json();

  const lastRead = JSON.parse(localStorage.getItem("lastRead"));
  if (lastRead) {
    document.getElementById("continueContent").innerHTML = renderBookCard(lastRead);
    showSuggestions(lastRead.genre, lastRead.file);
  }

  const genres = [...new Set(books.map(b => b.genre))];
  document.getElementById("genreButtons").innerHTML =
    genres.map(g => `<button onclick="filterByGenre('${g}')">${g}</button>`).join("");
}

function showSuggestions(genre, excludeFile) {
  const suggestions = books.filter(b => b.genre === genre && b.file !== excludeFile);
  document.getElementById("suggestedList").innerHTML =
    suggestions.map(renderBookCard).join("");
}

function filterByGenre(genre) {
  const list = books.filter(b => b.genre === genre);
  document.getElementById("genreList").innerHTML =
    list.map(renderBookCard).join("");
}
