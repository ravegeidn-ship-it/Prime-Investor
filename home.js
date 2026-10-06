/* ============================================= */
/* HOME — Form Respon Cepat                       */
/* ============================================= */

function kirimResponCepat(e) {
  e.preventDefault();

  const nama = document.getElementById('rcNama').value.trim();
  const email = document.getElementById('rcEmail').value.trim();
  const telepon = document.getElementById('rcTelepon').value.trim();
  const pesan = document.getElementById('rcPesan').value.trim();

  if (!nama || !email || !telepon || !pesan) return;

  // Kirim via WhatsApp
  const waNumber = '6281234567890';
  const waText = `*Respon Cepat AIH*%0A%0A` +
                 `Nama: ${encodeURIComponent(nama)}%0A` +
                 `Email: ${encodeURIComponent(email)}%0A` +
                 `Telepon: ${encodeURIComponent(telepon)}%0A%0A` +
                 `Pesan:%0A${encodeURIComponent(pesan)}`;
  window.open(`https://wa.me/${waNumber}?text=${waText}`, '_blank');

  // Notifikasi sukses
  const successEl = document.getElementById('rcSuccess');
  successEl.classList.add('show');

  // Reset form
  document.getElementById('formResponCepat').reset();

  // Sembunyikan notif setelah 4 detik
  setTimeout(() => successEl.classList.remove('show'), 4000);
}

