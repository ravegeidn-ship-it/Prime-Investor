/* ============================================= */
/* KALKULATOR AVERAGE UP / DOWN + PnL             */
/* ============================================= */

const MAX_BARIS = 10;
let barisCount = 2;

function buatBarisHTML(index) {
  return `
    <tr data-index="${index}">
      <td class="td-center">${index}</td>
      <td><input type="text" class="form-input" style="padding:6px 8px;font-size:13px"
                 data-field="lot" data-index="${index}" placeholder="0"
                 inputmode="numeric" oninput="updateAverage()"></td>
      <td><input type="text" class="form-input" style="padding:6px 8px;font-size:13px"
                 data-field="harga" data-index="${index}" placeholder="0"
                 inputmode="numeric" oninput="updateAverage()"></td>
      <td class="td-right" data-cell="value">Rp 0</td>
      <td class="td-center" data-cell="totalLot">-</td>
      <td class="td-right" data-cell="totalValue">Rp 0</td>
      <td class="td-right" data-cell="avgPrice">Rp 0</td>
      <td class="td-center" data-cell="status"><span class="status-badge status-flat">-</span></td>
    </tr>
  `;
}

function renderBarisAwal() {
  const tbody = document.getElementById('tbodyAvg');
  tbody.innerHTML = '';
  for (let i = 1; i <= barisCount; i++) tbody.innerHTML += buatBarisHTML(i);
}

function tambahBaris() {
  if (barisCount >= MAX_BARIS) return;
  barisCount++;
  const tbody = document.getElementById('tbodyAvg');
  const tempDiv = document.createElement('tbody');
  tempDiv.innerHTML = buatBarisHTML(barisCount).trim();
  const newRow = tempDiv.firstChild;
  tbody.appendChild(newRow);
  updateAverage();
}

function resetAverage() {
  barisCount = 2;
  renderBarisAwal();
  document.getElementById('lotAwal').value = '';
  document.getElementById('hargaAwal').value = '';
  document.getElementById('hargaPasar').value = '';
  document.getElementById('feeBeli').value = '';
  document.getElementById('feeJual').value = '';
  updateAverage();
}

function updateAverage() {
  const feeBeliPersen = getVal('feeBeli') / 100;
  const feeJualPersen = getVal('feeJual') / 100;

  const lotAwal = getVal('lotAwal');
  const hargaAwal = getVal('hargaAwal');
  const valueAwal = lotAwal * 100 * hargaAwal;
  document.getElementById('valueAwal').textContent = fmtRp(valueAwal);

  let totalLot = lotAwal;
  let totalValue = valueAwal;
  let avgPrice = totalLot > 0 ? totalValue / (totalLot * 100) : 0;

  for (let i = 1; i <= barisCount; i++) {
    const tr = document.querySelector(`tr[data-index="${i}"]`);
    if (!tr) continue;
    const lotEl = tr.querySelector(`input[data-field="lot"]`);
    const hargaEl = tr.querySelector(`input[data-field="harga"]`);
    const lot = lotEl ? getValByElement(lotEl) : 0;
    const harga = hargaEl ? getValByElement(hargaEl) : 0;

    const value = lot * 100 * harga;
    const prevAvg = avgPrice;

    totalLot += lot;
    totalValue += value;
    avgPrice = totalLot > 0 ? totalValue / (totalLot * 100) : 0;

    const valueCell = tr.querySelector('[data-cell="value"]');
    const totalLotCell = tr.querySelector('[data-cell="totalLot"]');
    const totalValueCell = tr.querySelector('[data-cell="totalValue"]');
    const avgPriceCell = tr.querySelector('[data-cell="avgPrice"]');
    const statusCell = tr.querySelector('[data-cell="status"]');

    if (valueCell) valueCell.textContent = fmtRp(value);
    if (totalLotCell) totalLotCell.textContent = totalLot;
    if (totalValueCell) totalValueCell.textContent = fmtRp(totalValue);
    if (avgPriceCell) avgPriceCell.textContent = fmtRp(avgPrice);

    if (statusCell) {
      if (lot === 0 && harga === 0) statusCell.innerHTML = '<span class="status-badge status-flat">-</span>';
      else if (avgPrice > prevAvg) statusCell.innerHTML = '<span class="status-badge status-up">AVG UP</span>';
      else if (avgPrice < prevAvg) statusCell.innerHTML = '<span class="status-badge status-down">AVG DOWN</span>';
      else statusCell.innerHTML = '<span class="status-badge status-flat">FLAT</span>';
    }
  }

  document.getElementById('totalLotAkhir').value = totalLot.toLocaleString('id-ID');
  document.getElementById('totalValueAkhir').value = fmtRp(totalValue);
  document.getElementById('avgPriceAkhir').value = avgPrice.toFixed(2);

  const hargaPasar = getVal('hargaPasar');

  // PnL Awal
  const modalAwal = valueAwal * (1 + feeBeliPersen);
  const pnlAwalRp = (hargaPasar * lotAwal * 100) - modalAwal;
  const pnlAwalPersen = modalAwal > 0 ? (pnlAwalRp / modalAwal) * 100 : 0;
  document.getElementById('pnlPersenAwal').value = fmtPct(pnlAwalPersen);
  document.getElementById('pnlRpAwal').value = fmtRp(pnlAwalRp);
  document.getElementById('pnlStatusAwal').value = pnlAwalRp > 0 ? 'UNTUNG' : (pnlAwalRp < 0 ? 'RUGI' : '-');

  // PnL Akhir
  const modalAkhir = totalValue * (1 + feeBeliPersen);
  const pnlAkhirRp = (hargaPasar * totalLot * 100) - modalAkhir;
  const pnlAkhirPersen = modalAkhir > 0 ? (pnlAkhirRp / modalAkhir) * 100 : 0;
  document.getElementById('pnlPersenAkhir').value = fmtPct(pnlAkhirPersen);
  document.getElementById('pnlRpAkhir').value = fmtRp(pnlAkhirRp);
  document.getElementById('pnlStatusAkhir').value = pnlAkhirRp > 0 ? 'UNTUNG' : (pnlAkhirRp < 0 ? 'RUGI' : '-');

  // Penjualan
  const nilaiJualBruto = hargaPasar * totalLot * 100;
  const feeJualRp = nilaiJualBruto * feeJualPersen;
  const nilaiJualNetto = nilaiJualBruto - feeJualRp;

  document.getElementById('nilaiJualBruto').value = fmtRp(nilaiJualBruto);
  document.getElementById('feeJualRp').value = fmtRp(feeJualRp);
  document.getElementById('nilaiJualNetto').value = fmtRp(nilaiJualNetto);

  const netProfit = nilaiJualNetto - modalAkhir;
  const netProfitPersen = modalAkhir > 0 ? (netProfit / modalAkhir) * 100 : 0;

  document.getElementById('netProfit').textContent = fmtRp(netProfit);
  document.getElementById('netProfitPersen').textContent = fmtPct(netProfitPersen);

  const boxNP = document.getElementById('boxNetProfit');
  const boxNPP = document.getElementById('boxNetProfitPersen');
  [boxNP, boxNPP].forEach(box => {
    box.classList.remove('profit-positive', 'profit-negative', 'profit-neutral');
    if (netProfit > 0) box.classList.add('profit-positive');
    else if (netProfit < 0) box.classList.add('profit-negative');
    else box.classList.add('profit-neutral');
  });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', function() {
  renderBarisAwal();
  updateAverage();
});

