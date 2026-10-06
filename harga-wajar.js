/* ============================================= */
/* KALKULATOR HARGA WAJAR                         */
/* ============================================= */

function hitungMoS(hargaWajar, hargaSaatIni) {
  if (!hargaSaatIni || hargaSaatIni <= 0 || !hargaWajar || hargaWajar <= 0) return 0;
  return ((hargaWajar - hargaSaatIni) / hargaSaatIni) * 100;
}

function setMosColor(boxId, mos) {
  const box = document.getElementById(boxId);
  if (!box) return;
  box.classList.remove('mos-positive', 'mos-negative', 'mos-neutral');
  if (mos >= 0) box.classList.add('mos-positive');
  else box.classList.add('mos-negative');
}

function updateWajar() {
  const harga = getVal('hargaSaham');
  const intrinsikList = [];

  // Metode 1 — Benjamin Graham V1
  { const eps = getVal('eps1'), bvps = getVal('bvps1');
    let hi = 0;
    if (eps > 0 && bvps > 0) hi = Math.sqrt(22.5 * eps * bvps);
    document.getElementById('hi1').textContent = formatRupiah(hi);
    const mos = hitungMoS(hi, harga);
    document.getElementById('mos1').textContent = formatPersen(mos);
    setMosColor('mosBox1', mos);
    if (hi > 0) intrinsikList.push(hi); }

  // Metode 2 — Benjamin Graham Modifikasi Investor
  { const eps = getVal('eps2'), bvps = getVal('bvps2');
    let hi = 0;
    if (eps > 0 && bvps > 0) hi = Math.sqrt(30 * eps * bvps);
    document.getElementById('hi2').textContent = formatRupiah(hi);
    const mos = hitungMoS(hi, harga);
    document.getElementById('mos2').textContent = formatPersen(mos);
    setMosColor('mosBox2', mos);
    if (hi > 0) intrinsikList.push(hi); }

  // Metode 3 — PER Sektor
  { const eps = getVal('eps3'), perSector = getVal('perSector');
    let hi = 0;
    if (eps > 0 && perSector > 0) hi = eps * perSector;
    document.getElementById('hi3').textContent = formatRupiah(hi);
    const mos = hitungMoS(hi, harga);
    document.getElementById('mos3').textContent = formatPersen(mos);
    setMosColor('mosBox3', mos);
    if (hi > 0) intrinsikList.push(hi); }

  // Metode 4 — PBV Sektor
  { const bvps = getVal('bvps4'), pbvSector = getVal('pbvSector');
    let hi = 0;
    if (bvps > 0 && pbvSector > 0) hi = bvps * pbvSector;
    document.getElementById('hi4').textContent = formatRupiah(hi);
    const mos = hitungMoS(hi, harga);
    document.getElementById('mos4').textContent = formatPersen(mos);
    setMosColor('mosBox4', mos);
    if (hi > 0) intrinsikList.push(hi); }

  // Metode 5 — P/S Sektor
  { const pendapatan = getVal('pendapatan');
    const sahamBeredarPS = getVal('sahamBeredarPS');
    const psSector = getVal('psSector');

    let sps = 0;
    if (sahamBeredarPS > 0 && pendapatan > 0) {
      sps = pendapatan / sahamBeredarPS;
    }
    document.getElementById('sps').value = sps.toFixed(2);

    let hi = 0;
    if (sps > 0 && psSector > 0) {
      hi = sps * psSector;
    }
    document.getElementById('hi5').textContent = formatRupiah(hi);
    const mos = hitungMoS(hi, harga);
    document.getElementById('mos5').textContent = formatPersen(mos);
    setMosColor('mosBox5', mos);
    if (hi > 0) intrinsikList.push(hi); }

// Metode 6 — Berdasarkan Laba Bersih (PER Sektor × EPS)
{
  const laba = getVal('labaBersih');
  const saham = getVal('sahamBeredar');
  const perSector = getVal('perSector2');

  let hi = 0;
  if (saham > 0 && laba > 0 && perSector > 0) {
    const eps = laba / saham;
    hi = eps * perSector;
  }

  document.getElementById('hi6').textContent = formatRupiah(hi);
  const mos = hitungMoS(hi, harga);
  document.getElementById('mos6').textContent = formatPersen(mos);
  setMosColor('mosBox6', mos);
  if (hi > 0) intrinsikList.push(hi);
}
  // Metode 7 — Peter Lynch
  { const eps = getVal('epsPL'), growth = getVal('growthPL');
    const perWajar = growth;
    document.getElementById('perPL').value = perWajar.toFixed(2);
    let hi = 0;
    if (eps > 0 && perWajar > 0) hi = eps * perWajar;
    document.getElementById('hi7').textContent = formatRupiah(hi);
    const mos = hitungMoS(hi, harga);
    document.getElementById('mos7').textContent = formatPersen(mos);
    setMosColor('mosBox7', mos);
    if (hi > 0) intrinsikList.push(hi); }

  // Metode 8 — EV/EBITDA
  { const ebitda = getVal('ebitda'), evSector = getVal('evEbitdaSector');
    const netDebt = getVal('netDebt'), saham = getVal('sahamBeredarEV');
    let hi = 0;
    if (saham > 0 && ebitda > 0 && evSector > 0) {
      const enterpriseValue = ebitda * evSector;
      const equityValue = enterpriseValue - netDebt;
      if (equityValue > 0) hi = equityValue / saham;
    }
    document.getElementById('hi8').textContent = formatRupiah(hi);
    const mos = hitungMoS(hi, harga);
    document.getElementById('mos8').textContent = formatPersen(mos);
    setMosColor('mosBox8', mos);
    if (hi > 0) intrinsikList.push(hi); }

  // Metode 9 — DCF
  { const fcf = getVal('fcf'), growth = getVal('growthDCF') / 100;
    const discount = getVal('discountRate') / 100, termGrowth = getVal('terminalGrowth') / 100;
    const netDebt = getVal('netDebtDCF'), saham = getVal('sahamBeredarDCF');
    let hi = 0;

    if (fcf > 0 && discount > 0 && saham > 0) {
      const years = 5;
      let pvFCF = 0, fcfProjected = fcf;

      // PV FCF selama 5 tahun
      for (let i = 1; i <= years; i++) {
        fcfProjected = fcfProjected * (1 + growth);
        pvFCF += fcfProjected / Math.pow(1 + discount, i);
      }

      // Terminal Value
      let terminalValue = 0;
      if (discount > termGrowth) {
        // Gordon Growth (normal)
        terminalValue = (fcfProjected * (1 + termGrowth)) / (discount - termGrowth);
      } else {
        // Fallback: perpetuity sederhana
        terminalValue = fcfProjected / discount;
      }

      const pvTerminal = terminalValue / Math.pow(1 + discount, years);
      const enterpriseValue = pvFCF + pvTerminal;
      const equityValue = enterpriseValue - netDebt;

      if (equityValue > 0) hi = equityValue / saham;
    }

    document.getElementById('hi9').textContent = formatRupiah(hi);
    const mos = hitungMoS(hi, harga);
    document.getElementById('mos9').textContent = formatPersen(mos);
    setMosColor('mosBox9', mos);
    if (hi > 0) intrinsikList.push(hi); }

  // ===== KESIMPULAN =====
  const rangeEl = document.getElementById('kesimpulanRange');
  const mosEl = document.getElementById('kesimpulanMos');
  const statusEl = document.getElementById('kesimpulanStatus');

  if (intrinsikList.length === 0 || harga <= 0) {
    rangeEl.textContent = 'Rp 0 — Rp 0';
    mosEl.textContent = 'Margin of Safety: 0%';
    statusEl.innerHTML = '<span class="conclusion-status status-empty">Menunggu Data</span>';
    return;
  }
  const min = Math.min(...intrinsikList);
  const max = Math.max(...intrinsikList);
  const mid = (min + max) / 2;
  rangeEl.textContent = formatRupiah(min) + ' — ' + formatRupiah(max);

  let mosText = '';
  if (harga < min) {
    const mos = ((min - harga) / harga) * 100;
    mosText = 'Margin of Safety: +' + mos.toFixed(2) + '% (vs batas bawah)';
  } else if (harga > max) {
    const mos = ((max - harga) / harga) * 100;
    mosText = 'Margin of Safety: ' + mos.toFixed(2) + '% (vs batas atas)';
  } else {
    const mos = ((mid - harga) / harga) * 100;
    mosText = 'Margin of Safety: ' + (mos >= 0 ? '+' : '') + mos.toFixed(2) + '% (vs titik tengah)';
  }
  mosEl.textContent = mosText;

  let statusHtml = '';
  if (harga < min) statusHtml = '<span class="conclusion-status status-undervalued">✅ Undervalued</span>';
  else if (harga > max) statusHtml = '<span class="conclusion-status status-overvalued">⚠️ Overvalued</span>';
  else statusHtml = '<span class="conclusion-status status-fair">➖ Fair Valued</span>';
  statusEl.innerHTML = statusHtml;
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', function() {
  updateWajar();
});

