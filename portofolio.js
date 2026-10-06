/* ============================================= */
/* PORTOFOLIO BUMI                                */
/* ============================================= */

let ptCurrentPrice = 0;

async function updatePortofolio() {
  const avgPrice = getVal('ptAvgPrice');

  const pnlEl = document.getElementById('ptPnl');
  const modalPriceEl = document.getElementById('ptModalPrice');
  const heroBadge = document.getElementById('ptHeroBadge');

  // Tampilkan harga modal
  modalPriceEl.textContent = 'Rp ' + avgPrice.toFixed(2).replace('.', ',');

  // Jika harga real-time belum ada, jangan hitung dulu
  if (ptCurrentPrice <= 0) {
    pnlEl.textContent = 'Memuat...';
    return;
  }

  // Hitung PnL
  if (avgPrice > 0) {
    const pnlPersen = ((ptCurrentPrice - avgPrice) / avgPrice) * 100;
    pnlEl.textContent = fmtPct(pnlPersen);

    // Update hero badge
    heroBadge.textContent = fmtPct(pnlPersen);
    heroBadge.classList.remove('up', 'down', 'flat');
    if (pnlPersen > 0) heroBadge.classList.add('up');
    else if (pnlPersen < 0) heroBadge.classList.add('down');
    else heroBadge.classList.add('flat');

    // Update warna info row
    pnlEl.classList.remove('up', 'down');
    if (pnlPersen > 0) pnlEl.classList.add('up');
    else if (pnlPersen < 0) pnlEl.classList.add('down');
  } else {
    pnlEl.textContent = '0%';
  }
}

async function fetchHargaBUMI() {
  const ticker = 'BUMI.JK';
  const priceEl = document.getElementById('ptCurrentPrice');
  const heroPriceEl = document.getElementById('ptCurrentPriceHero');
  const heroSubEl = document.getElementById('ptHeroSub');

  try {
    // Yahoo Finance via proxy allorigins (untuk hindari CORS)
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`;
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${yahooUrl}`;

    const response = await fetch(proxyUrl);
    const data = await response.json();

    const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;

    if (price && price > 0) {
      ptCurrentPrice = price;
      const formatted = 'Rp ' + Math.round(price).toLocaleString('id-ID');
      priceEl.textContent = formatted;
      heroPriceEl.textContent = formatted;
      heroSubEl.textContent = 'Harga real-time • Diperbarui otomatis';
      updatePortofolio();
    } else {
      throw new Error('Harga kosong dari Yahoo Finance');
    }
  } catch (error) {
    console.error('Gagal ambil harga BUMI:', error);
    priceEl.textContent = 'Gagal memuat';
    heroPriceEl.textContent = 'Gagal memuat';
    heroSubEl.textContent = 'Cek koneksi internet Anda';
  }
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', function() {
  updatePortofolio();
  fetchHargaBUMI();

  // Update harga BUMI setiap 15 detik
  setInterval(fetchHargaBUMI, 15000);
});