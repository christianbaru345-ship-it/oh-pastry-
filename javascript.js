let mode = 'login';
let kategoriAktif = 'semua';
let keywordCari = '';
let cart = JSON.parse(localStorage.getItem('ohpastry_cart') || '[]');
let selectedPay = "";
let currentPayNumber = "";
let promoAktif = null;
let diskonPromo = 0;
const WA_NUMBER = "6283148505968";

const produk = [
  {id:1, nama:'Croissant', harga:18000, kategori:'pastry', foto:'img/croissant.jpeg', stok:12, badge:'Best Seller', badgeClass:'', desc:'Buttery & flaky, favorit semua orang'},
  {id:2, nama:'Blueberry Muffin', harga:20000, kategori:'pastry', foto:'img/bluebberymuffin.jpeg', stok:10, badge:'Baru', badgeClass:'blue', desc:'Blueberry segar + crumble lembut'},
  {id:3, nama:'Eclair', harga:22000, kategori:'pastry', foto:'img/eclair.jpeg', stok:8, badge:'', badgeClass:'', desc:'Eclair coklat lumer di dalam'},
  {id:4, nama:'Cinnamon Roll', harga:24000, kategori:'pastry', foto:'img/cinnamonroll.jpeg', stok:9, badge:'', badgeClass:'', desc:'Kayu manis + glaze manis'},
  {id:5, nama:'Fruit Tart', harga:26000, kategori:'pastry', foto:'img/fruittart.jpeg', stok:7, badge:'Fresh', badgeClass:'green', desc:'Buah segar + custard dingin'},
  {id:6, nama:'Mille Feuille', harga:28000, kategori:'pastry', foto:'img/millefeuille.jpeg', stok:6, badge:'', badgeClass:'', desc:'Layer renyah + cream vanilla'},
  {id:7, nama:'Cream Puff', harga:15000, kategori:'pastry', foto:'img/creampuff.jpeg', stok:15, badge:'', badgeClass:'', desc:'Cream vanilla lembut di dalam'},
  {id:8, nama:'Cheese Danish', harga:23000, kategori:'pastry', foto:'img/cheesedanish.jpeg', stok:10, badge:'', badgeClass:'', desc:'Keju lumer + pastry renyah'},
  {id:9, nama:'Water Ice', harga:5000, kategori:'dingin', foto:'img/icetawar.jpeg', stok:30, badge:'', badgeClass:'', desc:'Air dingin segar'},
  {id:10, nama:'Dark Chocollate', harga:18000, kategori:'dingin', foto:'img/darkchoclate.jpeg', stok:15, badge:'Best Seller', badgeClass:'', desc:'Coklat pekat, ga terlalu manis'},
  {id:11, nama:'Almond Joy Iced Latte', harga:15000, kategori:'dingin', foto:'img/almondjoyiced.jpeg', stok:15, badge:'', badgeClass:'', desc:'Kopi susu + almond gurih'},
  {id:12, nama:'Matcha Latte', harga:22000, kategori:'dingin', foto:'img/machalatte.jpeg', stok:12, badge:'Best Seller', badgeClass:'', desc:'Matcha premium, ga terlalu manis'},
  {id:13, nama:'Coffee Latte', harga:22000, kategori:'dingin', foto:'img/coffelate.jpeg', stok:12, badge:'', badgeClass:'', desc:'Kopi susu creamy'},
  {id:18, nama:'Iced Palm Sugar Coffee Milk', harga:22000, kategori:'dingin', foto:'img/kopisusu.jpeg', stok:12, badge:'', badgeClass:'', desc:'Kopi susu gula aren'},
  {id:19, nama:'Iced Matcha Strawberry Latte', harga:25000, kategori:'dingin', foto:'img/matchastrawberry.jpeg', stok:10, badge:'Baru', badgeClass:'blue', desc:'Matcha + strawberry segar'},
  {id:20, nama:'Iced Chocolate', harga:20000, kategori:'dingin', foto:'img/icedchocolate.jpeg', stok:15, badge:'', badgeClass:'', desc:'Coklat dingin creamy'},
  {id:14, nama:'Hot Tea', harga:5000, kategori:'hangat', foto:'img/tehhangat.jpeg', stok:25, badge:'', badgeClass:'', desc:'Teh hangat'},
  {id:15, nama:'Warm Sweet Tea', harga:7000, kategori:'hangat', foto:'img/tehmanishangat.jpeg', stok:25, badge:'', badgeClass:'', desc:'Teh manis hangat'},
  {id:16, nama:'Coffee', harga:15000, kategori:'hangat', foto:'img/coffe.jpeg', stok:20, badge:'', badgeClass:'', desc:'Kopi hitam hangat'},
  {id:17, nama:'Fresh Milk', harga:16000, kategori:'hangat', foto:'img/freshmilk.jpeg', stok:15, badge:'', badgeClass:'', desc:'Susu segar hangat'},
];

function showPage(nama){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  let target = document.getElementById('page-' + nama);
  if(target) target.classList.add('active');
  window.scrollTo(0,0);
  if(nama==='keranjang') tampilKeranjang();
  if(nama==='pesanan') tampilPesanan();
  if(nama==='profil') tampilProfil();
}

function cardHTML(p){
  return `
  <div class="card">
    <div class="img-wrap">
      <img src="${p.foto}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400'">
      ${p.badge ? `<span class="badge ${p.badgeClass}">${p.badge}</span>` : ''}
    </div>
    <h3>${p.nama}</h3>
    <div class="desc">${p.desc}</div>
    <span class="stock">● Ready • Sisa ${p.stok}</span>
    <div class="bottom">
      <div class="price">Rp ${p.harga.toLocaleString('id-ID')}</div>
      <button onclick="tambahKeranjang(${p.id})">+</button>
    </div>
  </div>`;
}

function tampilProduk(){
  let list = produk.filter(p => (kategoriAktif==='semua' || p.kategori===kategoriAktif) && p.nama.toLowerCase().includes(keywordCari.toLowerCase()));
  let listEl = document.getElementById('katalogList') || document.getElementById('menuList');
  if(!listEl) return;
  if(list.length===0){
    listEl.innerHTML='<p class="center">Gak ketemu nih 😢 coba kata lain yaa</p>';
  } else {
    listEl.innerHTML = list.map(p => cardHTML(p)).join('');
  }
  const best = produk.filter(p => [1,12,10].includes(p.id));
  let bestEl = document.getElementById('bestSeller');
  if(bestEl){
    bestEl.innerHTML = best.map(p => `
    <div class="card">
      <div class="img-wrap">
        <img src="${p.foto}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400'">
        <span class="badge">Best Seller</span>
      </div>
      <h3>${p.nama}</h3>
      <p class="bintang">⭐⭐⭐⭐⭐ <span>(4.9)</span></p>
      <span class="stock">● Stok: ${p.stok}</span>
      <div class="bottom">
        <div class="price">Rp ${p.harga.toLocaleString('id-ID')}</div>
        <button onclick="tambahKeranjang(${p.id})">+</button>
      </div>
    </div>`).join('');
  }
}

function filterKategori(k){ kategoriAktif=k; tampilProduk(); }
function cariProduk(keyword){ keywordCari = keyword; tampilProduk(); }
function resetSearch(){ keywordCari = ''; let inp=document.getElementById('searchInput'); if(inp) inp.value=''; tampilProduk(); }
function tambahKeranjang(id){
  let p = produk.find(x=>x.id===id);
  if(!p) return;
  cart.push(p);
  localStorage.setItem('ohpastry_cart', JSON.stringify(cart));
  updateCartCount();
  alert(p.nama+' masuk keranjang!');
}
function updateCartCount(){ let el=document.getElementById('cartCount'); if(el) el.innerText = cart.length; }

// === KERANJANG ===
function tampilKeranjang(){
  let listEl = document.getElementById('keranjangList') || document.getElementById('cartList');
  let totalEl = document.getElementById('totalBox') || document.getElementById('cartTotal');
  if(!listEl) return;
  if(cart.length===0){
    listEl.innerHTML='<p class="center">keranjang masih kosong 😢</p>';
    if(totalEl) totalEl.innerHTML='';
    return;
  }
  let total = cart.reduce((s,p)=>s+p.harga,0);
  let diskon = Math.round(total * diskonPromo);
  let totalAkhir = total - diskon;
  listEl.innerHTML = cart.map((p,i)=>`
    <div class="card cart-item">
      <span>${p.nama} - Rp ${p.harga.toLocaleString()}</span>
      <button onclick="hapusItem(${i})" class="btn-hapus">Hapus</button>
    </div>`).join('');
  if(totalEl){
    totalEl.innerHTML = `
      <div class="total-inner">
        <div class="total-row"><span>Subtotal:</span><b>Rp ${total.toLocaleString('id-ID')}</b></div>
        ${diskon>0 ? `<div class="total-row total-diskon"><span>Diskon ${promoAktif}:</span><b>- Rp ${diskon.toLocaleString('id-ID')}</b></div>` : ''}
        <div class="total-row total-akhir"><span>Total:</span><b>Rp ${totalAkhir.toLocaleString('id-ID')}</b></div>
        ${promoAktif==='GRATISONGKIR' ? `<div class="total-gratis">🛵 Ongkir GRATIS!</div>` : ''}
      </div>`;
  }
}
function hapusItem(i){ cart.splice(i,1); localStorage.setItem('ohpastry_cart', JSON.stringify(cart)); updateCartCount(); tampilKeranjang(); }
function hapusPesanan(i){
  if(!confirm('Yakin mau hapus pesanan ini?')) return;
  let pesanan=JSON.parse(localStorage.getItem('ohpastry_pesanan')||'[]');
  pesanan.splice(i,1);
  localStorage.setItem('ohpastry_pesanan', JSON.stringify(pesanan));
  tampilPesanan();
  tampilProfil();
  alert('Pesanan berhasil dihapus!');
}

function selectPay(nama, el){
  selectedPay = nama;
  document.querySelectorAll('.pay-option').forEach(o => o.classList.remove('active'));
  if(el) el.classList.add('active');
  document.querySelectorAll('.pay-detail').forEach(d=>d.classList.remove('show'));
  let d = document.getElementById('detail-'+nama);
  if(d) d.classList.add('show');

  let nomor = "";
  if(nama === 'DANA') nomor = "DANA - 0831-4850-5968 a/n Sasa Lucu";
  if(nama === 'OVO') nomor = "OVO - 0838-4106-2042 a/n Mia Lucu";
  if(nama === 'GoPay') nomor = "GoPay - 0895-2021-1438 a/n Hafidtz Rokmen";
  if(nama === 'ShopeePay') nomor = "ShopeePay - 0812-1685-1489 a/n PiqiHh";
  if(nama === 'BRI') nomor = "BRI - 1234-01-XXXXXX-XX-X a/n GengRuwet";
  if(nama === 'COD') nomor = "Bayar cash pas makanan datang, siapin uang pas ya!";

  currentPayNumber = nomor;
  let infoBox = document.getElementById('pay-info');
  if(infoBox){
    infoBox.classList.add('show-pay-info');
    document.getElementById('pay-info-title').innerText = "Transfer " + nama + " ke:";
    document.getElementById('pay-info-text').innerText = nomor;
  }
}
function copyPay(){
  if(!currentPayNumber) return alert('Pilih pembayaran dulu ya!');
  navigator.clipboard.writeText(currentPayNumber).then(()=>alert("Nomor berhasil disalin! " + currentPayNumber));
}
function copyText(txt){ navigator.clipboard.writeText(txt).then(()=>alert('Nomor berhasil disalin! ✅ '+txt)); }

function checkout(){
  if(cart.length===0){ alert('keranjang kosong!'); return; }
  if(!selectedPay) return alert('Pilih metode pembayaran dulu ya!');
  let user = JSON.parse(localStorage.getItem('ohpastry_login')||'null');
  let nama = user ? user.nama : 'Pelanggan';
  let total = cart.reduce((s,p)=>s+p.harga,0);
  let diskon = Math.round(total * diskonPromo);
  let totalAkhir = total - diskon;

  let pesanan=JSON.parse(localStorage.getItem('ohpastry_pesanan')||'[]');
  pesanan.push({tanggal:new Date().toLocaleString('id-ID'), items:cart.map(p=>p.nama).join(', '), total:totalAkhir, user:nama, pembayaran: selectedPay + (promoAktif ? ' + Promo ' + promoAktif : '')});
  localStorage.setItem('ohpastry_pesanan', JSON.stringify(pesanan));

  let pesan='Halo Oh, Pastry! Saya mau pesan:\n- '+cart.map(p=>p.nama + ' (Rp ' + p.harga.toLocaleString() + ')').join('\n- ') + '\n\nSubtotal: Rp ' + total.toLocaleString() + (diskon>0 ? '\nDiskon '+promoAktif+': -Rp '+diskon.toLocaleString() : '') + '\nTotal: Rp ' + totalAkhir.toLocaleString() + '\nNama: ' + nama + '\nPembayaran: ' + selectedPay + (promoAktif ? '\nPromo: ' + promoAktif : '');
  if(selectedPay!=='COD') pesan += '\nBukti transfer: (saya kirim fotonya di chat ini ya!)';

  cart=[]; localStorage.setItem('ohpastry_cart', JSON.stringify(cart)); updateCartCount(); tampilKeranjang();
  window.open('https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(pesan));
}
function bukaWA(){
  let pesan = 'Halo Oh, Pastry! Saya mau tanya-tanya dulu dong 🥐💜';
  window.open('https://wa.me/'+WA_NUMBER+'?text=' + encodeURIComponent(pesan));
}
function tampilPesanan(){
  let el = document.getElementById('pesananList');
  if(!el) return;
  let pesanan=JSON.parse(localStorage.getItem('ohpastry_pesanan')||'[]');
  if(pesanan.length===0){ el.innerHTML='<p class="center">belum ada pesanan</p>'; return; }
  el.innerHTML=pesanan.map((p,i)=>`
    <div class="card pesanan-card"><b>${p.tanggal}</b><br>${p.items}<br>Total: Rp ${p.total.toLocaleString()}<br>Pembayaran: ${p.pembayaran || '-'}<br>Status: <span class="status-ok">✅ Diterima</span><br><br><button onclick="hapusPesanan(${i})" class="btn-hapus">Hapus Pesanan</button></div>`).join('');
}

function tampilProfil(){
  let user = JSON.parse(localStorage.getItem('ohpastry_login')||'null');
  let namaEl = document.getElementById('nama-profil');
  let emailEl = document.getElementById('email-profil');
  let btnEl = document.getElementById('btn-profil-aksi');
  if(!namaEl) return;

  if(!user){
    namaEl.innerText = 'Belum Login';
    if(emailEl) emailEl.innerText = 'Yuk login dulu biar bisa checkout yaa!';
    if(btnEl){
      btnEl.innerText = 'Login / Daftar 💜';
      btnEl.onclick = function(){ bukaLogin(); };
      btnEl.classList.remove('btn-logout');
      btnEl.classList.add('btn-login');
    }
    return;
  }

  namaEl.innerText = user.nama;
  if(emailEl) emailEl.innerText = user.email;
  if(btnEl){
    btnEl.innerText = 'Keluar';
    btnEl.onclick = function(){ logout(); };
    btnEl.classList.remove('btn-login');
    btnEl.classList.add('btn-logout');
  }
  let fotoLama = localStorage.getItem('fotoProfil');
  if(fotoLama){
    let img = document.getElementById('foto-profil');
    if(img) img.src = fotoLama;
  }
}

function logout(){
  if(confirm('Yakin mau keluar?')){
    localStorage.removeItem('ohpastry_login');
    location.reload();
  }
}
function bukaLogin(){ document.getElementById('loginModal').classList.add('show-login'); }
function tutupLogin(){ document.getElementById('loginModal').classList.remove('show-login'); }
function lihatPass(){ let i=document.getElementById('authPass'); i.type=i.type==='password'?'text':'password'; }
function gantiMode(e){
  e.preventDefault();
  if(mode==='login'){ mode='daftar'; document.getElementById('authTitle').innerText='Daftar Akun Baru'; document.getElementById('authNama').classList.remove('hidden'); document.getElementById('konfirmasiBox').classList.remove('hidden'); }
  else { mode='login'; document.getElementById('authTitle').innerText='Login Akun'; document.getElementById('authNama').classList.add('hidden'); document.getElementById('konfirmasiBox').classList.add('hidden'); }
}
function prosesAuth(){
  let nama=document.getElementById('authNama').value;
  let email=document.getElementById('authEmail').value;
  let pass=document.getElementById('authPass').value;
  let pass2=document.getElementById('authPass2').value;
  let users=JSON.parse(localStorage.getItem('ohpastry_users')||'[]');
  if(!email||!pass){ document.getElementById('authMsg').innerText='Email & Password wajib diisi!'; return; }
  if(mode==='daftar'){
    if(!nama){ document.getElementById('authMsg').innerText='Nama wajib diisi!'; return; }
    if(pass!==pass2){ document.getElementById('authMsg').innerText='Password tidak sama!'; return; }
    if(pass.length<6){ document.getElementById('authMsg').innerText='Password minimal 6 karakter!'; return; }
    if(users.find(u=>u.email===email)){ document.getElementById('authMsg').innerText='Email sudah terdaftar!'; return; }
    users.push({nama,email,pass}); localStorage.setItem('ohpastry_users', JSON.stringify(users));
    localStorage.setItem('ohpastry_login', JSON.stringify({nama,email}));
    alert('Berhasil Daftar! Halo '+nama); location.reload();
  } else {
    let user=users.find(u=>u.email===email && u.pass===pass);
    if(!user){ document.getElementById('authMsg').innerText='Email / Password salah!'; return; }
    localStorage.setItem('ohpastry_login', JSON.stringify(user));
    alert('Berhasil Login! Halo '+user.nama); location.reload();
  }
}
function lupaPass(e){
  e.preventDefault();
  let email=document.getElementById('authEmail').value;
  if(!email){ alert('isi email dulu!'); return; }
  let users=JSON.parse(localStorage.getItem('ohpastry_users')||'[]');
  let user=users.find(u=>u.email===email);
  if(!user) alert('Email tidak ditemukan!'); else alert('Password kamu: '+user.pass);
}

function editUsername(){
  let user = JSON.parse(localStorage.getItem('ohpastry_login') || 'null');
  if(!user){
    alert("Login dulu yaa biar bisa ganti username!");
    bukaLogin();
    return;
  }
  let namaBaru = prompt("Ubah username jadi apa?", user.nama);
  if(namaBaru && namaBaru.trim() !== ""){
    namaBaru = namaBaru.trim();
    document.getElementById('nama-profil').textContent = namaBaru;
    user.nama = namaBaru;
    localStorage.setItem('ohpastry_login', JSON.stringify(user));
    let users = JSON.parse(localStorage.getItem('ohpastry_users') || '[]');
    let u = users.find(x => x.email === user.email);
    if(u) u.nama = namaBaru;
    localStorage.setItem('ohpastry_users', JSON.stringify(users));
    alert("Yeay! Username berhasil diubah jadi " + namaBaru + " 🎉");
  }
}

function pakaiPromo(kode){
  document.getElementById('kode-promo').value = kode;
  cekPromo();
}
function cekPromo(){
  let kode = document.getElementById('kode-promo').value.toUpperCase().trim();
  let info = document.getElementById('promo-info');
  if(kode === 'HEMAT10'){
    promoAktif = kode; diskonPromo = 0.10;
    info.innerText = "Yeay! Diskon 10% berhasil dipakai! 🎉"; info.classList.remove('promo-error'); info.classList.add('promo-ok');
  } else if(kode === 'GRATISONGKIR'){
    promoAktif = kode; diskonPromo = 0;
    info.innerText = "Yeay! Ongkir kamu GRATIS! 🛵💨"; info.classList.remove('promo-error'); info.classList.add('promo-ok');
  } else if(kode === 'HEMAT20'){
    promoAktif = kode; diskonPromo = 0.20;
    info.innerText = "Yeay! Diskon 20% berhasil dipakai! 🔥"; info.classList.remove('promo-error'); info.classList.add('promo-ok');
  } else {
    promoAktif = null; diskonPromo = 0;
    info.innerText = "Yah, kode promo-nya salah, coba lagi ya!"; info.classList.remove('promo-ok'); info.classList.add('promo-error');
  }
  tampilKeranjang();
}

function gantiFoto(event){
  let file = event.target.files[0];
  if(!file) return;
  let reader = new FileReader();
  reader.onload = function(e){
    document.getElementById('foto-profil').src = e.target.result;
    localStorage.setItem('fotoProfil', e.target.result);
  };
  reader.readAsDataURL(file);
}

document.addEventListener('DOMContentLoaded', ()=>{
  let fotoLama = localStorage.getItem('fotoProfil');
  if(fotoLama){
    let img = document.getElementById('foto-profil');
    if(img) img.src = fotoLama;
  }
});

tampilProduk();
updateCartCount();