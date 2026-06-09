// Pastikan semua elemen sudah ada di DOM sebelum menjalankan script
document.addEventListener('DOMContentLoaded', () => {
    // Variabel elemen
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    const loginMenu = document.getElementById('loginMenu');
    const logoutMenu = document.getElementById('logoutMenu');
    const adminMenuItem = document.getElementById('adminMenu');

    const loginFormContainer = document.getElementById('loginFormContainer');
    const loginBtn = document.getElementById('loginBtn');
    const cancelLoginBtn = document.getElementById('cancelLogin');
    const loginMessage = document.getElementById('loginMessage');

    const btnLogout = document.getElementById('btnLogout');
    const btnTambahBerita = document.getElementById('btnTambahBerita');
    const btnKelolaBerita = document.getElementById('btnKelolaBerita');
    const btnTambahGaleri = document.getElementById('btnTambahGaleri');
    const btnKelolaGaleri = document.getElementById('btnKelolaGaleri');

    const galeriContainer = document.getElementById('galeriContainer');
    const galeriTambah = document.getElementById('galeriTambah');
    const uploadFoto = document.getElementById('uploadFoto');
    const btnUploadFoto = document.getElementById('btnUploadFoto');
    const uploadStatus = document.getElementById('uploadStatus');

    const beritaContainer = document.getElementById('beritaContainer');
    const adminContent = document.getElementById('adminContent');

    // Fungsi menampilkan dan menutup form login
    function showLoginForm() {
        loginFormContainer.style.display = 'flex';
    }
    function closeLoginForm() {
        loginFormContainer.style.display = 'none';
        loginMessage.innerText = '';
    }

    // Cek login dan tampilkan menu sesuai status login
    function checkLogin() {
        const username = localStorage.getItem('adminUser');
        if (username === 'admin') {
            // Tampil menu admin
            loginMenu.style.display = 'none';
            logoutMenu.style.display = 'block';
            adminMenuItem.style.display = 'block';

            // Tampilkan dashboard dan menu admin
            document.getElementById('header').style.display = 'block';
            document.getElementById('adminDashboard').style.display = 'block';

            // Load data admin
            loadAdminData();
        } else {
            // Tidak login
            loginMenu.style.display = 'block';
            logoutMenu.style.display = 'none';

            // Sembunyikan dashboard
            document.getElementById('adminDashboard').style.display = 'none';
        }
    }

    // Event login
    document.getElementById('loginBtn').addEventListener('click', () => {
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;
        if (usernameInput === 'admin' && passwordInput === '1234') {
            localStorage.setItem('adminUser', 'admin');
            checkLogin();
        } else {
            loginMessage.innerText = 'Username atau password salah!';
        }
    });

    // Event batal login
    document.getElementById('cancelLogin').addEventListener('click', () => {
        closeLoginForm();
    });

    // Event logout
    document.getElementById('btnLogout').addEventListener('click', () => {
        localStorage.removeItem('adminUser');
        checkLogin();
    });

    // Menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
    }

    // Event tombol tambah berita
    if (btnTambahBerita) {
        btnTambahBerita.addEventListener('click', () => {
            adminContent.innerHTML = `
                <h3>Tambah Berita</h3>
                <input type="text" id="beritaJudul" placeholder="Judul" style="width:100%; margin-bottom:10px;"/>
                <textarea id="beritaIsi" placeholder="Isi berita" style="width:100%; height:100px;"></textarea><br/>
                <button onclick="simpanBerita()">Simpan</button>
                <button onclick="loadAdminData()">Batal</button>
            `;
        });
    }

    // Fungsi simpan berita
    window.simpanBerita = () => {
        const judul = document.getElementById('beritaJudul').value;
        const isi = document.getElementById('beritaIsi').value;
        let berita = JSON.parse(localStorage.getItem('berita')) || [];
        berita.push({ title: judul, content: isi });
        localStorage.setItem('berita', JSON.stringify(berita));
        loadAdminData();
        loadBerita();
    };

    // Event kelola berita
    if (btnKelolaBerita) {
        btnKelolaBerita.addEventListener('click', () => {
            loadBerita();
            adminContent.innerHTML = `
                <h3>Kelola Berita</h3>
                <div id="beritaList"></div>
            `;
            // Load berita ke dalam beritaList
            loadBeritaIntoAdmin();
        });
    }

    // Fungsi load berita
    function loadBerita() {
        let berita = JSON.parse(localStorage.getItem('berita')) || [];
        beritaContainer.innerHTML = '';
        berita.forEach((b, index) => {
            let div = document.createElement('div');
            div.className='berita-item';
            div.innerHTML=`
                <h3>${b.title}</h3>
                <p>${b.content}</p>
                <button onclick="editBerita(${index})">Edit</button>
                <button onclick="deleteBerita(${index})">Hapus</button>
            `;
            beritaContainer.appendChild(div);
        });
    }

    // Load berita ke admin
    function loadBeritaIntoAdmin() {
        const berita = JSON.parse(localStorage.getItem('berita')) || [];
        const beritaListDiv = document.getElementById('beritaList');
        if (beritaListDiv) {
            beritaListDiv.innerHTML = '';
            berita.forEach((b, index) => {
                let div = document.createElement('div');
                div.innerHTML = `
                    <h4>${b.title}</h4>
                    <p>${b.content}</p>
                    <button onclick="editBerita(${index})">Edit</button>
                    <button onclick="deleteBerita(${index})">Hapus</button>
                `;
                beritaListDiv.appendChild(div);
            });
        }
    }

    // Edit berita
    window.editBerita = (index) => {
        let berita = JSON.parse(localStorage.getItem('berita'));
        let b = berita[index];
        adminContent.innerHTML = `
            <h3>Edit Berita</h3>
            <input type="text" id="beritaJudul" value="${b.title}" style="width:100%; margin-bottom:10px;"/>
            <textarea id="beritaIsi" style="width:100%; height:100px;">${b.content}</textarea><br/>
            <button onclick="updateBerita(${index})">Update</button>
            <button onclick="loadBerita()">Batal</button>
        `;
    };

    // Update berita
    window.updateBerita = (index) => {
        let berita = JSON.parse(localStorage.getItem('berita'));
        berita[index] = {
            title: document.getElementById('beritaJudul').value,
            content: document.getElementById('beritaIsi').value
        };
        localStorage.setItem('berita', JSON.stringify(berita));
        loadBerita();
        loadBeritaIntoAdmin();
    };

    // Hapus berita
    window.deleteBerita = (index) => {
        let berita = JSON.parse(localStorage.getItem('berita')) || [];
        berita.splice(index,1);
        localStorage.setItem('berita', JSON.stringify(berita));
        loadBerita();
        loadBeritaIntoAdmin();
    };

    // Event tombol tambah galeri
    if (btnTambahGaleri) {
        btnTambahGaleri.addEventListener('click', () => {
            galeriTambah.style.display='block';
        });
    }

    // Upload foto ke galeri
    if (btnUploadFoto) {
        btnUploadFoto.addEventListener('click', () => {
            const file = uploadFoto.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    let galeri = JSON.parse(localStorage.getItem('galeri')) || [];
                    galeri.push(e.target.result);
                    localStorage.setItem('galeri', JSON.stringify(galeri));
                    loadGaleri();
                    uploadStatus.innerText='Foto berhasil diupload!';
                }
                reader.readAsDataURL(file);
            } else {
                uploadStatus.innerText='Pilih file terlebih dahulu!';
            }
        });
    }

    // Load galeri
    function loadGaleri() {
        let galeri = JSON.parse(localStorage.getItem('galeri')) || [];
        galeriContainer.innerHTML = '';
        galeri.forEach((g, index) => {
            let div = document.createElement('div');
            div.className='galeri-item';
            div.innerHTML=`
                <img src="${g}" style="width:200px;"/>
                <br/>
                <button onclick="editGaleri(${index})">Edit</button>
                <button onclick="deleteGaleri(${index})">Hapus</button>
            `;
            galeriContainer.appendChild(div);
        });
    }

    // Edit galeri
    window.editGaleri = (index) => {
        let galeri = JSON.parse(localStorage.getItem('galeri')) || [];
        // tampilkan gambar dan opsi edit
        adminContent.innerHTML=`
            <h3>Edit Foto</h3>
            <img src="${galeri[index]}" style="width:200px;"/>
            <br/>
            <input type="file" id="editUpload" accept="image/*"/>
            <button onclick="updateGaleri(${index})">Update</button>
            <button onclick="loadGaleri()">Batal</button>
        `;
        window.editGaleriIndex = index; // simpan index
    };

    window.updateGaleri = (index) => {
        const fileInput = document.getElementById('editUpload');
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                let galeri = JSON.parse(localStorage.getItem('galeri')) || [];
                galeri[index] = e.target.result;
                localStorage.setItem('galeri', JSON.stringify(galeri));
                loadGaleri();
            }
            reader.readAsDataURL(file);
        } else {
            alert('Pilih file terlebih dahulu!');
        }
    };

    // Hapus galeri
    window.deleteGaleri = (index) => {
        let galeri = JSON.parse(localStorage.getItem('galeri')) || [];
        galeri.splice(index,1);
        localStorage.setItem('galeri', JSON.stringify(galeri));
        loadGaleri();
    };

    // Kelola galeri
    if (btnKelolaGaleri) {
        btnKelolaGaleri.addEventListener('click', () => {
            loadGaleri();
            adminContent.innerHTML= `
                <h3>Kelola Galeri</h3>
                <div id="galeriAdmin"></div>
                <button id="btnTambahFoto">Tambah Foto</button>
            `;
            document.getElementById('galeriAdmin').innerHTML= galeriContainer.innerHTML;
            document.getElementById('btnTambahFoto').onclick= () => {
                galeriTambah.style.display='block';
            };
        });
    }

    // Load halaman awal
    checkLogin();
    loadBerita();
    loadGaleri();
});