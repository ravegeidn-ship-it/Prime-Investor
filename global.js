/* ============================================= */
/* GLOBAL — fungsi umum semua halaman             */
/* ============================================= */

/* ============ MENU OVERLAY ============ */
function openMenu() {
  document.getElementById('menuOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  document.getElementById('menuOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function toggleSubmenu(el) {
  const submenu = el.nextElementSibling;
  const arrow = el.querySelector('.arrow');
  if (submenu) submenu.classList.toggle('open');
  if (arrow) arrow.classList.toggle('open');
}

/* ============ AKUN (ke halaman auth / profile) ============ */
function openAccount() {
  closeMenu();
  const user = localStorage.getItem('aih_current_user');
  if (user) {
    window.location.href = 'profile.html';
  } else {
    window.location.href = 'auth.html';
  }
}

/* ============ PARSING & FORMAT ============ */
function getVal(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
  return parseAngka(el.value);
}

function getValByElement(el) {
  if (!el) return 0;
  return parseAngka(el.value);
}

function parseAngka(str) {
  let raw = String(str).trim();
  if (!raw) return 0;

  raw = raw.replace(/[^0-9.,-]/g, '');
  if (!raw) return 0;

  const isNegative = raw.startsWith('-');
  raw = raw.replace(/-/g, '');
  raw = raw.replace(/,/g, '.');

  if (!raw.includes('.')) {
    const v = parseFloat(raw);
    return isNegative ? -v : v;
  }

  const parts = raw.split('.');
  const lastPart = parts[parts.length - 1];
  let intPart, decPart;

  if (parts.length > 2) {
    intPart = parts.slice(0, -1).join('');
    decPart = lastPart;
  } else {
    if (lastPart.length === 3 && parseInt(lastPart, 10) > 0) {
      intPart = parts[0] + parts[1];
      decPart = '';
    } else if (lastPart.length === 0) {
      intPart = parts[0];
      decPart = '';
    } else {
      intPart = parts[0];
      decPart = lastPart;
    }
  }

  intPart = intPart.replace(/\./g, '');
  if (intPart === '') intPart = '0';

  let result = parseInt(intPart, 10) || 0;
  if (decPart && decPart.length > 0) {
    result = parseFloat(intPart + '.' + decPart);
  }
  return isNegative ? -result : result;
}

function formatRupiah(angka) {
  if (!isFinite(angka) || isNaN(angka) || angka <= 0) return 'Rp 0';
  return 'Rp ' + Math.round(angka).toLocaleString('id-ID');
}
function fmtRp(n) {
  if (!isFinite(n) || isNaN(n) || n === 0) return 'Rp 0';
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}
function formatPersen(angka) {
  if (!isFinite(angka) || isNaN(angka)) return '0%';
  return angka.toFixed(2) + '%';
}
function fmtPct(n) {
  if (!isFinite(n) || isNaN(n)) return '0%';
  return (n >= 0 ? '+' : '') + n.toFixed(2) + '%';
}

