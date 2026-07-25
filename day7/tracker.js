const API_URL = "https://api4.binance.com/api/v3/ticker/24hr";
const REFRESH_INTERVAL = 1000;
const FAVORITES_KEY = "favorites";

const searchInput = document.querySelector("#search");
const tabButtons = document.querySelectorAll(".tab");
const tickerBody = document.querySelector("#tickerBody");

let tickers = [];
let currentTab = "all";
let searchQuery = "";
let favorites = loadFavorites();

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function toggleFavorite(symbol) {
  if (favorites.includes(symbol)) {
    favorites = favorites.filter((item) => item !== symbol);
  } else {
    favorites.push(symbol);
  }
  saveFavorites();
  render();
}

// "76961.41000000" -> "76961.41"
function stripTrailingZeros(str) {
  if (!str.includes(".")) return str;
  return str.replace(/0+$/, "").replace(/\.$/, "");
}

// "76961.41" -> "76,961.41"
function formatPrice(str) {
  const trimmed = stripTrailingZeros(str);
  const [intPart, decPart] = trimmed.split(".");
  const withComma = Number(intPart).toLocaleString("en-US");
  return decPart ? `${withComma}.${decPart}` : withComma;
}

function formatPercent(str) {
  const num = parseFloat(str);
  const sign = num >= 0 ? "+" : "";
  return `${sign}${num.toFixed(2)}%`;
}

async function fetchTickers() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    tickers = data.filter((item) => item.symbol.endsWith("USDT"));
    render();
  } catch (error) {
    console.error("가격 정보를 불러오지 못했습니다.", error);
  }
}

function getVisibleTickers() {
  const query = searchQuery.trim().toUpperCase();

  return tickers
    .filter((item) => (currentTab === "favorites" ? favorites.includes(item.symbol) : true))
    .filter((item) => item.symbol.includes(query));
}

function render() {
  const visible = getVisibleTickers();

  if (visible.length === 0) {
    tickerBody.innerHTML = `<tr><td class="empty" colspan="6">표시할 항목이 없습니다.</td></tr>`;
    return;
  }

  tickerBody.innerHTML = visible
    .map((item) => {
      const isFavorite = favorites.includes(item.symbol);
      const changeValue = parseFloat(item.priceChangePercent);
      const changeClass = changeValue >= 0 ? "up" : "down";

      return `
        <tr>
          <td class="star ${isFavorite ? "filled" : ""}" data-symbol="${item.symbol}">${isFavorite ? "★" : "☆"}</td>
          <td class="symbol">${item.symbol}</td>
          <td>${formatPrice(item.lastPrice)}</td>
          <td class="${changeClass}">${formatPercent(item.priceChangePercent)}</td>
          <td>${formatPrice(item.highPrice)}</td>
          <td>${formatPrice(item.lowPrice)}</td>
        </tr>
      `;
    })
    .join("");
}

tickerBody.addEventListener("click", (event) => {
  const star = event.target.closest(".star");
  if (!star) return;
  toggleFavorite(star.dataset.symbol);
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentTab = button.dataset.tab;
    render();
  });
});

searchInput.addEventListener("input", (event) => {
  searchQuery = event.target.value;
  render();
});

fetchTickers();
setInterval(fetchTickers, REFRESH_INTERVAL);
