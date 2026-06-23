import { api, BASE_URL } from "./api.js";
import { toast } from "./ui/toast.js";
import "../css/style.css";
import { loader } from "./ui/loader.js";
import { profilHTML } from "./ui/profilView.js"; // File yang baru kita buat
import { renderStoryCamView } from "./ui/storyCamView.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// --- ROUTER UTAMA ---
window.router = async (page) => {
  const appView = document.getElementById("app-view");
  const subNav = document.getElementById("sub-nav");
  const footer = document.querySelector("footer");
  subNav.innerHTML = "";
  subNav.classList.remove("active");

  if (footer) {
    footer.style.display = page === "cms" ? "none" : "block";
  }
  if (page === "cms") {
    // Mengecek apakah ada 'token' atau flag 'isLoggedIn' di localStorage
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      showLogin(); // Jika belum login, tampilkan modal
      return; // Hentikan agar tidak lanjut ke renderCMSView
    }
  }
  switch (page) {
    case "profil":
      appView.innerHTML = profilHTML;
      renderArticles();
      renderStories();

      subNav.innerHTML = `
        <button onclick="activateLink(this, 'tentangsaya')">Tentang</button>
        <button onclick="activateLink(this, 'hobisaya')">Hobi</button>
        <button onclick="activateLink(this, 'goals')">Goals</button>
        <button onclick="activateLink(this, 'favouritethings')">Favorit</button>
        <button onclick="activateLink(this, 'artikel-cms')">Artikel</button>
        <button onclick="activateLink(this, 'story-cam')">Story Cam</button>
        <button onclick="activateLink(this, 'kontaksaya')">Kontak</button>
        <button onclick="activateLink(this, 'map-location')">Map-Location</button>
      `;
      subNav.classList.add("active");

      setTimeout(() => {
        if (window.initMap) window.initMap();
      }, 100);
      break;

    case "cms":
      subNav.innerHTML = `<button onclick="router('profil')">Kembali ke Profil</button>`;
      renderCMSView(appView);
      break;

    case "storycam":
      subNav.innerHTML = `<button onclick="router('profil')">Kembali ke Profil</button>`;
      renderStoryCamView(appView);
      break;
  }
};

window.showLogin = () => {
  document.getElementById("login-modal").style.display = "flex";
};

window.closeLogin = () => {
  document.getElementById("login-modal").style.display = "none";
};

window.activateLink = (btn, sectionId) => {
  document
    .querySelectorAll(".sub-nav button")
    .forEach((b) => b.classList.remove("active-link"));
  btn.classList.add("active-link");
  document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
};

async function renderCMSView(appView) {
  const footer = document.querySelector("footer");
  if (footer) footer.style.display = "none";

  appView.innerHTML = `
    <div class="cms-layout">
      <aside class="sidebar">
        <h2>CMS Admin</h2>
        <ul class="sidebar-menu">
          <li><a href="#" class="active">Tambah Artikel</a></li>
          <li><a href="#" onclick="router('profil')">Kembali ke Website</a></li>
        </ul>
        <div class="logout-item" style="margin-top: auto;">
          <button onclick="handleLogout()" id="logoutBtn">Logout</button>
        </div>
      </aside>
      
      <main class="main-content">
        <h1 style="margin-bottom: 20px;">Tambah Artikel</h1>
        <div class="Input-Art">
          <form id="artikelForm">
            <input type="text" id="title" placeholder="Judul Artikel" required />
            <textarea id="content" placeholder="Tulis konten..." required></textarea>
            <button type="submit" id="simpanbtn">Simpan</button>
          </form>
        </div>
        <div id="articlelist" style="margin-top: 30px;"></div>
      </main>
    </div>
  `;

  // Event listener form
  const artikelForm = document.getElementById("artikelForm");
  artikelForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const editId = form.getAttribute("data-edit-id");
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    try {
      if (editId) {
        // PROSES UPDATE (Pastikan di api.js sudah ada updateArticle)
        await api.updateArticle(editId, { title, content });
        toast.show("Artikel berhasil diupdate!", "success");

        // Reset form
        form.removeAttribute("data-edit-id");
        document.getElementById("simpanbtn").innerText = "Simpan";
      } else {
        // PROSES TAMBAH BARU
        await api.createArticle({ title, content });
        toast.show("Artikel baru berhasil disimpan!", "success");
      }

      form.reset();
      renderArticles();
    } catch (err) {
      toast.show("Gagal memproses artikel", "error");
    }
  });

  // PERBAIKAN: Gunakan setTimeout agar DOM dipastikan sudah ter-render
  setTimeout(() => {
    renderArticles();
  }, 50);
}
// Tambahkan fungsi ini di main.js
// --- FUNGSI RENDER STORIES (Update Terbaru) ---
async function renderStories() {
  const storyList = document.getElementById("gallery-story");
  if (!storyList) return;

  try {
    const response = await fetch(
      "https://backend-web-profil-production.up.railway.app/api/stories",
    );
    const stories = await response.json();

    if (stories.length === 0) {
      storyList.innerHTML = "<p>Belum ada cerita.</p>";
      return;
    }

    // Menggunakan Promise.all untuk mengambil nama lokasi dari koordinat
    storyList.innerHTML = await Promise.all(
      stories.map(async (s) => {
        let locationName = "Lokasi terdeteksi";

        // Reverse Geocoding agar koordinat tampil sebagai nama daerah
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${s.lat || coords.lat}&lon=${s.lon || coords.lon}&zoom=14&addressdetails=1`,
          );
          const geoData = await geoRes.json();

          // Logika pencarian nama yang lebih lengkap
          const addr = geoData.address;
          locationName =
            addr.village ||
            addr.suburb ||
            addr.hamlet ||
            addr.town ||
            addr.city_district ||
            addr.city ||
            addr.county ||
            "Lokasi spesifik";
        } catch (e) {
          locationName = "Lokasi terdeteksi";
        }

        return `
        <div class="story-card">
          <img src="https://backend-web-profil-production.up.railway.app${s.image_url}" alt="${s.title}">
          <h3>${s.title}</h3>
          <p>${s.caption}</p>
          <div class="story-location">📍 ${locationName}</div>
        </div>
      `;
      }),
    ).then((results) => results.join(""));
  } catch (err) {
    console.error("Gagal memuat stories:", err);
    storyList.innerHTML = "<p>Gagal memuat cerita dari server.</p>";
  }
}
window.handleLogin = async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    // Memanggil API dengan objek
    const response = await api.login({ username, password });

    if (response) {
      localStorage.setItem("isLoggedIn", "true");
      window.closeLogin();
      window.router("cms"); // Pindah ke halaman CMS setelah sukses
    }
  } catch (err) {
    toast.show(err.message, "error"); // Menampilkan pesan error dari API
  }
};

window.handleLogout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("token");

  // Kembali ke halaman profil tanpa refresh penuh
  router("profil");
};
window.getCurrentCoords = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation tidak didukung browser ini"));
      return;
    }

    // Timeout 10 detik jika tidak bisa dapat lokasi
    const timeoutId = setTimeout(() => {
      reject(new Error("Timeout: Gagal mendapatkan lokasi dalam 10 detik"));
    }, 10000);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timeoutId);
        resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => {
        clearTimeout(timeoutId);
        let errorMsg = "Gagal mendapatkan lokasi";
        if (err.code === err.PERMISSION_DENIED) {
          errorMsg = "Akses lokasi ditolak. Aktifkan di settings browser.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorMsg = "Informasi lokasi tidak tersedia.";
        }
        reject(new Error(errorMsg));
      },
      {
        enableHighAccuracy: false, // Gunakan fast mode
        timeout: 8000, // Timeout 8 detik untuk API
        maximumAge: 0, // Jangan gunakan cache lokasi lama
      },
    );
  });
};
// --- FUNGSI RENDER ARTIKEL (Universal) ---
async function renderArticles() {
  const articleList = document.getElementById("articlelist");
  const containerArtikel = document.getElementById("container-artikel");

  if (!articleList && !containerArtikel) return;

  loader.show(articleList ? "articlelist" : "container-artikel");

  try {
    const articles = await api.getArticles();
    let html = articles
      .map(
        (art) => `
           <div class="${articleList ? "cms-article-card" : "article-item"}">
            <h3>${art.title}</h3>
            <p>${art.content}</p>
            ${
              articleList
                ? `
              <button onclick="editArticle(${art.id}, '${art.title.replace(/'/g, "\\'")}', '${art.content.replace(/'/g, "\\'")}')">Edit</button>
              <button onclick="deleteArticle(${art.id})">Hapus</button>
            `
                : ""
            }
        </div>
        `,
      )
      .join("");

    loader.hide(articleList ? "articlelist" : "container-artikel", html);
  } catch (err) {
    toast.show("Gagal memuat artikel", "error");
  }
}

// --- GLOBAL UTILS ---
window.deleteArticle = async (id) => {
  if (confirm("Yakin ingin menghapus?")) {
    await api.deleteArticle(id);
    renderArticles();
  }
};
window.editArticle = (id, title, content) => {
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const simpanBtn = document.getElementById("simpanbtn");
  const form = document.getElementById("artikelForm");

  // Isi data ke form
  titleInput.value = title;
  contentInput.value = content;

  // Ubah tombol jadi mode update
  simpanBtn.innerText = "Update Artikel";

  // Simpan ID di form (sebagai penanda mode update)
  form.setAttribute("data-edit-id", id);

  // Scroll ke atas agar user melihat form
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Perbaikan ikon marker (wajib untuk Webpack)
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

window.initMap = async () => {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  // 1. Inisialisasi peta dengan koordinat default (sebelum dapat lokasi asli)
  const map = L.map("map").setView([-7.545, 109.183], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // 2. Gunakan Geolocation API untuk mendapatkan lokasi asli
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Pindahkan fokus peta ke lokasi asli
        map.setView([latitude, longitude], 15);

        // Tambahkan marker di lokasi asli
        L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup("Anda berada di sini!")
          .openPopup();
      },
      (error) => {
        console.error("Gagal mendapatkan lokasi:", error.message);
        // Tetap gunakan marker default jika gagal
        L.marker([-7.6185, 109.2555])
          .addTo(map)
          .bindPopup("Lokasi default (Izin lokasi ditolak)")
          .openPopup();
      },
    );
  } else {
    alert("Browser Anda tidak mendukung Geolocation.");
  }
};

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    if (process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW terdaftar dengan scope:", registration.scope);
        })
        .catch((error) => {
          console.log("SW gagal terdaftar:", error);
        });
    } else {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      console.log("Service worker di-unregister di development mode.");
    }
  });
}

// --- PWA LOGIC ---
let deferredPrompt;
const installBtn = document.createElement("button");
installBtn.id = "btn-install";
installBtn.innerText = "📥 Pasang Aplikasi";
installBtn.style.cssText = "display: none; background-color: #007bff; color: white; font-weight: bold; border: none; border-radius: 5px; padding: 8px 15px; cursor: pointer; margin-left: 10px;";

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav-primary");
  if (nav) nav.appendChild(installBtn);
  
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const navMenu = document.getElementById("nav-menu");
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", () => {
      navMenu.classList.toggle("show");
    });
  }
  
  router("profil");
});

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'inline-block';
});

installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      installBtn.style.display = 'none';
    }
    deferredPrompt = null;
  }
});
