document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "favoriteQuotes_v2";
  const quoteText = document.getElementById("quote");
  const authorText = document.getElementById("author");
  const newQuoteBtn = document.getElementById("getQuoteBtn");
  const favoriteBtn = document.getElementById("favorite-btn");
  const heartIcon = document.getElementById("heart-icon");
  const favoritesModal = document.getElementById("favorites-modal");
  const favoritesList = document.getElementById("favorites-list");
  const showFavorites = document.getElementById("show-favorites");
  const closeModal = document.getElementById("close-modal");
  const copyBtn = document.getElementById("copy-btn");

  let currentQuote = null;
  let favorites = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const fallbackQuotes = [
    {
      content: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      content: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs",
    },
    {
      content:
        "Your time is limited, so don't waste it living someone else's life.",
      author: "Steve Jobs",
    },
  ];

  async function getRandomQuote() {
    try {
      const response = await fetch("https://api.quotable.io", {
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      const quoteData = Array.isArray(data) ? data[0] : data;

      currentQuote = {
        content: quoteData.content,
        author: quoteData.author || "Unknown",
      };
      displayQuote(currentQuote);
    } catch (err) {
      console.error("API Error:", err);

      const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
      currentQuote = fallbackQuotes[randomIndex];
      displayQuote(currentQuote);
    }
  }

  function displayQuote(quote) {
    quoteText.textContent = quote.content;
    authorText.textContent = `– ${quote.author}`;
    const isFav = favorites.some((f) => f.content === quote.content);
    heartIcon.textContent = isFav ? "♥" : "♡";
  }

  function toggleFavorite() {
    if (!currentQuote) return;
    const index = favorites.findIndex(
      (f) => f.content === currentQuote.content
    );
    if (index === -1) {
      favorites.push(currentQuote);
      heartIcon.textContent = "♥";
    } else {
      favorites.splice(index, 1);
      heartIcon.textContent = "♡";
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    renderFavorites();
  }

  function renderFavorites() {
    favoritesList.innerHTML = favorites.length
      ? ""
      : "<p>No favorites yet.</p>";
    favorites.forEach((fav, i) => {
      const div = document.createElement("div");
      div.classList.add("favorite-item");
      div.innerHTML = `
        <div class="fav-text">"${fav.content}"<div class="fav-meta">– ${fav.author}</div></div>
        <button class="delete-btn" data-index="${i}">🗑</button>
      `;
      favoritesList.appendChild(div);
    });
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const i = e.target.dataset.index;
        favorites.splice(i, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        renderFavorites();
      });
    });
  }

  function copyQuote() {
    if (!currentQuote) return;
    navigator.clipboard.writeText(
      `"${currentQuote.content}" – ${currentQuote.author}`
    );
    alert("Quote copied!");
  }

  newQuoteBtn.addEventListener("click", getRandomQuote);
  favoriteBtn.addEventListener("click", toggleFavorite);
  showFavorites.addEventListener("click", () =>
    favoritesModal.setAttribute("aria-hidden", "false")
  );
  closeModal.addEventListener("click", () =>
    favoritesModal.setAttribute("aria-hidden", "true")
  );
  copyBtn.addEventListener("click", copyQuote);

  renderFavorites();
  getRandomQuote();
});
