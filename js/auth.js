/* ============================================= */
/* AUTH: SIGN IN / SIGN UP / PROFILE / LOGOUT     */
/* ============================================= */

const AUTH_KEY = 'aih_current_user';
const USERS_KEY = 'aih_users';

/* --- Helper localStorage --- */
function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getCurrentUser() {
  try { return JSON.parse(sessionStorage.getItem(AUTH_KEY)); }
  catch { return null; }
}
function setCurrentUser(user) {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
}
function clearCurrentUser() {
  sessionStorage.removeItem(AUTH_KEY);
}

/* --- Switch antara kartu Sign In / Sign Up --- */
function switchAuthCard(card) {
  document.querySelectorAll('.auth-card').forEach(c => c.classList.remove('active'));
  if (card === 'signin') {
    document.getElementById('cardSignin').classList.add('active');
  } else {
    document.getElementById('cardSignup').classList.add('active');
  }
  document.querySelectorAll('.auth-msg').forEach(m => m.classList.remove('show'));
}

/* --- Toggle Show/Hide password --- */
function toggleShow(inputId, btn) {
  const el = document.getElementById(inputId);
  if (!el) return;
  if (el.type === 'password') {
    el.type = 'text';
    btn.textContent = 'Hide';
  } else {
    el.type = 'password';
    btn.textContent = 'Show';
  }
}

/* --- Tampilkan pesan --- */
function showAuthMsg(elId, text, type) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = text;
  el.className = 'auth-msg show ' + type;
}

/* --- Handle Sign Up --- */
function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const phone = document.getElementById('signupPhone').value.trim();
  const password = document.getElementById('signupPassword').value;
  const password2 = document.getElementById('signupPassword2').value;

  if (password.length < 6) {
    showAuthMsg('signupMsg', 'Password minimal 6 karakter.', 'error');
    return;
  }

  if (password !== password2) {
    showAuthMsg('signupMsg', 'Konfirmasi password tidak cocok.', 'error');
    return;
  }

  const users = getUsers();
  if (users.some(u => u.email === email)) {
    showAuthMsg('signupMsg', 'Email sudah terdaftar. Silakan Masuk.', 'error');
    return;
  }

  users.push({ name, email, phone, password });
  saveUsers(users);
  showAuthMsg('signupMsg', 'Registrasi berhasil! Silakan Masuk.', 'success');

  setTimeout(() => {
    switchAuthCard('signin');
    document.getElementById('signinEmail').value = email;
  }, 1200);
}

/* --- Handle Sign In --- */
function handleSignin(e) {
  e.preventDefault();
  const email = document.getElementById('signinEmail').value.trim().toLowerCase();
  const password = document.getElementById('signinPassword').value;

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    showAuthMsg('signinMsg', 'Email atau password salah.', 'error');
    return;
  }

  setCurrentUser(user);
  showAuthMsg('signinMsg', 'Login berhasil!', 'success');

  setTimeout(() => {
    window.location.href = 'home.html';
  }, 800);
}

/* --- Logout --- */
function handleLogout() {
  if (!confirm('Yakin ingin logout?')) return;
  clearCurrentUser();
  window.location.href = 'home.html';
}

/* ============================================= */
/* ISI MENU OVERLAY: USERNAME + LOGOUT             */
/* ============================================= */
function renderUserMenu() {
  const slot = document.getElementById('menuUserSlot');
  if (!slot) return;

  const user = getCurrentUser();

  if (!user) {
    slot.innerHTML = `
      <a href="auth.html" class="menu-auth-btn">MASUK / DAFTAR</a>
    `;
    return;
  }

  const initial = user.name.charAt(0).toUpperCase();
  slot.innerHTML = `
    <div class="menu-user-card">
      <div class="menu-user-info">
        <div class="menu-user-avatar">${initial}</div>
        <div class="menu-user-detail">
          <div class="menu-user-name">${user.name}</div>
          <div class="menu-user-email">${user.email}</div>
        </div>
      </div>
      <button class="menu-user-logout" onclick="handleLogout()">Logout</button>
    </div>
  `;
}
/* ============================================= */
/* LUPA PASSWORD                                   */
/* ============================================= */

/* Simpan kode reset sementara */
let resetCodeSimulasi = '';
let resetEmailSimulasi = '';

/* STEP 1 — Kirim kode reset */
function handleStep1(e) {
  e.preventDefault();
  const email = document.getElementById('forgotEmail').value.trim().toLowerCase();

  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    showAuthMsg('forgotMsg1', 'Email tidak terdaftar. Cek kembali.', 'error');
    return;
  }

  // Generate kode 6 digit (SIMULASI — di produksi, kode ini dikirim via email)
  resetCodeSimulasi = Math.floor(100000 + Math.random() * 900000).toString();
  resetEmailSimulasi = email;

  // Tampilkan kode di hint (untuk demo — di produksi, JANGAN tampilkan kode)
  document.getElementById('forgotHint').textContent =
    '💡 DEMO: Kode reset Anda adalah ' + resetCodeSimulasi;

  showAuthMsg('forgotMsg1', 'Kode reset berhasil dikirim ke ' + email, 'success');

  // Pindah ke step 2 setelah 1.5 detik
  setTimeout(() => {
    document.getElementById('cardStep1').classList.remove('active');
    document.getElementById('cardStep2').classList.add('active');
    document.querySelectorAll('.auth-msg').forEach(m => m.classList.remove('show'));
  }, 1500);
}

/* STEP 2 — Verifikasi kode + simpan password baru */
function handleStep2(e) {
  e.preventDefault();
  const code = document.getElementById('forgotCode').value.trim();
  const password = document.getElementById('forgotPassword').value;
  const password2 = document.getElementById('forgotPassword2').value;

  if (code !== resetCodeSimulasi) {
    showAuthMsg('forgotMsg2', 'Kode reset salah. Coba lagi.', 'error');
    return;
  }

  if (password.length < 6) {
    showAuthMsg('forgotMsg2', 'Password minimal 6 karakter.', 'error');
    return;
  }

  if (password !== password2) {
    showAuthMsg('forgotMsg2', 'Konfirmasi password tidak cocok.', 'error');
    return;
  }

  // Update password user di localStorage
  const users = getUsers();
  const idx = users.findIndex(u => u.email === resetEmailSimulasi);

  if (idx === -1) {
    showAuthMsg('forgotMsg2', 'Terjadi kesalahan. Coba lagi.', 'error');
    return;
  }

  users[idx].password = password;
  saveUsers(users);

  showAuthMsg('forgotMsg2', 'Password berhasil direset!', 'success');

  // Pindah ke step 3 setelah 1 detik
  setTimeout(() => {
    document.getElementById('cardStep2').classList.remove('active');
    document.getElementById('cardStep3').classList.add('active');
  }, 1000);
}
/* ============================================= */
/* INIT                                            */
/* ============================================= */
document.addEventListener('DOMContentLoaded', function() {
  renderUserMenu();

  const profileNameEl = document.getElementById('profileName');
  if (profileNameEl) {
    const user = getCurrentUser();
    if (!user) {
      window.location.href = 'auth.html';
      return;
    }
    document.getElementById('profileAvatar').textContent = user.name.charAt(0).toUpperCase();
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
  }
});

/* ============================================= */
/* MODAL SYARAT & KETENTUAN / KEBIJAKAN PRIVASI    */
/* ============================================= */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* Klik "Saya Setuju" → centang checkbox + tutup modal */
function agreeAndClose(id) {
  const checkbox = document.getElementById('signupAgree');
  if (checkbox) checkbox.checked = true;
  closeModal(id);
}

/* Klik area gelap → tutup modal */
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

/* Tekan Escape → tutup modal */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
});