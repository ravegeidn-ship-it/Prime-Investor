/* ============================================= */
/* KALKULATOR RIGHT ISSUE                         */
/* ============================================= */

function updateRightIssue() {
  const lot = getVal('riLot');
  const lembarPerLot = getVal('riLembarPerLot') || 100;
  const avgLama = getVal('riAvgLama');
  const hargaExercise = getVal('riHargaExercise');
  const rasioLama = getVal('riRasioLama');
  const rasioBaru = getVal('riRasioBaru');
  const hargaPasar = getVal('riHargaPasar');
  const persenTebus = getVal('riPersenTebus') / 100;

  // ===== 1. DATA DASAR =====
  const lembarLama = lot * lembarPerLot;
  const modalAwal = lembarLama * avgLama;

  const faktorRasio = (rasioLama > 0) ? (rasioBaru / rasioLama) : 0;
  const hakDidapat = lembarLama * faktorRasio;

  // ===== 2. JIKA HAK DITEBUS 100% =====
  const biayaTebus = hakDidapat * hargaExercise;
  const totalModal = modalAwal + biayaTebus;
  const totalLembar = lembarLama + hakDidapat;
  const totalLot = (lembarPerLot > 0) ? (totalLembar / lembarPerLot) : 0;
  const avgBaru = (totalLembar > 0) ? (totalModal / totalLembar) : 0;

  document.getElementById('riLembarLama').value = lembarLama.toLocaleString('id-ID');
  document.getElementById('riModalAwal').value = fmtRp(modalAwal);
  document.getElementById('riFaktorRasio').value = faktorRasio.toFixed(5);
  document.getElementById('riHakDidapat').value = Math.round(hakDidapat).toLocaleString('id-ID');
  document.getElementById('riBiayaTebus').value = fmtRp(biayaTebus);
  document.getElementById('riTotalModal').value = fmtRp(totalModal);
  document.getElementById('riTotalLembar').value = Math.round(totalLembar).toLocaleString('id-ID');
  document.getElementById('riTotalLot').value = totalLot.toFixed(2);
  document.getElementById('riAvgBaru').textContent = fmtRp(avgBaru);

  // ===== 3. JIKA HAK TIDAK DITEBUS (DILUSI) =====
  const porsiLama = (totalLembar > 0) ? (lembarLama / totalLembar) * 100 : 0;
  document.getElementById('riLotLamaDilusi').value = lot.toLocaleString('id-ID');
  document.getElementById('riTotalSahamBaru').value = Math.round(totalLembar).toLocaleString('id-ID');
  document.getElementById('riPorsiLama').value = porsiLama.toFixed(2) + '%';
  document.getElementById('riModalTetap').textContent = fmtRp(modalAwal);

  // ===== 4. SIMULASI TEBUS SEBAGIAN =====
  const lembarTebus = hakDidapat * persenTebus;
  const lotTebus = (lembarPerLot > 0) ? (lembarTebus / lembarPerLot) : 0;
  const biayaTebusSebagian = lembarTebus * hargaExercise;
  const totalModalSebagian = modalAwal + biayaTebusSebagian;
  const totalLembarSebagian = lembarLama + lembarTebus;
  const totalLotSebagian = (lembarPerLot > 0) ? (totalLembarSebagian / lembarPerLot) : 0;
  const avgBaruSebagian = (totalLembarSebagian > 0) ? (totalModalSebagian / totalLembarSebagian) : 0;

  document.getElementById('riLembarTebus').value = Math.round(lembarTebus).toLocaleString('id-ID');
  document.getElementById('riLotTebus').value = lotTebus.toFixed(2);
  document.getElementById('riBiayaTebusSebagian').value = fmtRp(biayaTebusSebagian);
  document.getElementById('riTotalModalSebagian').value = fmtRp(totalModalSebagian);
  document.getElementById('riTotalLembarSebagian').value = Math.round(totalLembarSebagian).toLocaleString('id-ID');
  document.getElementById('riTotalLotSebagian').value = totalLotSebagian.toFixed(2);
  document.getElementById('riAvgBaruSebagian').textContent = fmtRp(avgBaruSebagian);

  // ===== 5. POSISI SAAT INI (AVG LAMA vs HARGA PASAR) =====
  const selisih = hargaPasar - avgLama;
  const pnlSaatIniRp = selisih * lembarLama;
  const pnlSaatIniPersen = (avgLama > 0) ? ((selisih / avgLama) * 100) : 0;

  document.getElementById('riAvgAnda').value = fmtRp(avgLama);
  document.getElementById('riHargaPasarNow').value = fmtRp(hargaPasar);
  document.getElementById('riSelisihLembar').value = fmtRp(selisih);
  document.getElementById('riLotSaatIni').value = lot.toLocaleString('id-ID');
  document.getElementById('riPnlSaatIniRp').value = fmtRp(pnlSaatIniRp);
  document.getElementById('riPnlSaatIniPersen').value = fmtPct(pnlSaatIniPersen);

  // ===== 6. TERP =====
  let terp = 0;
  if (totalLembar > 0) {
    terp = ((hargaPasar * lembarLama) + (hargaExercise * hakDidapat)) / totalLembar;
  }
  document.getElementById('riTerp').textContent = fmtRp(terp);

  // ===== 7. RINGKASAN UNTUNG/RUGI @ TERP =====
  const nilaiTidakIkut = lembarLama * terp;
  const pnlTidakIkut = nilaiTidakIkut - modalAwal;
  const pnlTidakIkutPersen = (modalAwal > 0) ? ((pnlTidakIkut / modalAwal) * 100) : 0;

  const nilaiIkut = totalLembar * terp;
  const pnlIkut = nilaiIkut - totalModal;
  const pnlIkutPersen = (totalModal > 0) ? ((pnlIkut / totalModal) * 100) : 0;

  document.getElementById('riSumAvgTidak').textContent = fmtRp(avgLama);
  document.getElementById('riSumAvgIkut').textContent = fmtRp(avgBaru);
  document.getElementById('riSumLotTidak').textContent = lot.toLocaleString('id-ID');
  document.getElementById('riSumLotIkut').textContent = totalLot.toFixed(2);
  document.getElementById('riSumLembarTidak').textContent = Math.round(lembarLama).toLocaleString('id-ID');
  document.getElementById('riSumLembarIkut').textContent = Math.round(totalLembar).toLocaleString('id-ID');
  document.getElementById('riSumModalTidak').textContent = fmtRp(modalAwal);
  document.getElementById('riSumModalIkut').textContent = fmtRp(totalModal);
  document.getElementById('riSumNilaiTidak').textContent = fmtRp(nilaiTidakIkut);
  document.getElementById('riSumNilaiIkut').textContent = fmtRp(nilaiIkut);
  document.getElementById('riSumPnlTidak').innerHTML = '<strong>' + fmtRp(pnlTidakIkut) + '</strong>';
  document.getElementById('riSumPnlIkut').innerHTML = '<strong>' + fmtRp(pnlIkut) + '</strong>';
  document.getElementById('riSumPnlPersenTidak').innerHTML = '<strong>' + fmtPct(pnlTidakIkutPersen) + '</strong>';
  document.getElementById('riSumPnlPersenIkut').innerHTML = '<strong>' + fmtPct(pnlIkutPersen) + '</strong>';

  // ===== 8. PROFIT JIKA IKUT — PAKAI HARGA PASAR =====
  const selisihPasar = hargaPasar - avgBaru;
  const profitIkutRp = selisihPasar * totalLembar;
  const profitIkutPersen = (avgBaru > 0) ? ((selisihPasar / avgBaru) * 100) : 0;

  document.getElementById('riAvgIkutPasar').value = fmtRp(avgBaru);
  document.getElementById('riHargaPasarPasar').value = fmtRp(hargaPasar);
  document.getElementById('riSelisihPasar').value = fmtRp(selisihPasar);
  document.getElementById('riTotalLotIkutPasar').value = totalLot.toFixed(2);
  document.getElementById('riTotalLembarIkutPasar').value = Math.round(totalLembar).toLocaleString('id-ID');
  document.getElementById('riProfitIkutRp').value = fmtRp(profitIkutRp);
  document.getElementById('riProfitIkutPersen').textContent = fmtPct(profitIkutPersen);

  const box = document.getElementById('boxRiProfitIkut');
  box.classList.remove('profit-positive', 'profit-negative', 'profit-neutral');
  if (profitIkutRp > 0) box.classList.add('profit-positive');
  else if (profitIkutRp < 0) box.classList.add('profit-negative');
  else box.classList.add('profit-neutral');
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', function() {
  updateRightIssue();
});

