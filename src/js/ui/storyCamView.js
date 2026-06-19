export const storyCamHTML = `
  <div class="story-back-wrap">
    <button id="back-btn" class="story-back-btn">← Kembali</button>
  </div>

  <div id="cam-container">
    <div id="cam-view">
      <h2>Ambil Story</h2>
      <video id="video-preview" autoplay playsinline></video>
      <button id="capture-btn">Ambil Foto</button>
    </div>
    <div id="preview-view" style="display:none;">
      <h2>Hasil Foto</h2>
      <img id="image-result" />
      <input type="text" id="story-title" placeholder="Judul..." required />
      <textarea id="story-caption" placeholder="Caption..." required></textarea>
      <div id="geo-status" style="font-size: 0.8em; margin: 5px; color: #888;">Mencari lokasi...</div>
      <button id="save-btn">Simpan Story</button>
      <button id="retake-btn">Ulangi</button>
    </div>
    <canvas id="canvas-result" style="display:none;"></canvas>
  </div>
`;

function dataURLtoBlob(dataURL) {
  const [header, data] = dataURL.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(data);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
}

export const renderStoryCamView = (appView) => {
  appView.innerHTML = storyCamHTML;

  const video = document.getElementById("video-preview");
  const canvas = document.getElementById("canvas-result");
  const imageResult = document.getElementById("image-result");
  const geoStatus = document.getElementById("geo-status");
  let currentStream = null;
  let observer = null;
  let userCoords = { lat: 0, lon: 0 };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      currentStream = stream;
      video.srcObject = stream;
    } catch (err) {
      alert("Akses kamera ditolak!");
    }
  };

  const stopCamera = () => {
    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop());
      currentStream = null;
    }
    if (observer) {
      try {
        observer.disconnect();
      } catch (e) {}
      observer = null;
    }
  };

  startCamera();

  // Pastikan kamera mati bila elemen camera dihapus (mis. navigasi SPA)
  try {
    observer = new MutationObserver(() => {
      if (!document.getElementById("cam-container")) {
        stopCamera();
      }
    });
    observer.observe(appView, { childList: true, subtree: true });
  } catch (e) {
    // ignore if MutationObserver tidak tersedia
  }

  // Juga pastikan sebelumunload mematikan kamera (safety)
  window.addEventListener("beforeunload", stopCamera);

  // 0. Tombol Kembali
  document.getElementById("back-btn").onclick = () => {
    stopCamera();
    window.router("profil");
  };

  // 1. Ambil Foto
  document.getElementById("capture-btn").onclick = async () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    imageResult.src = canvas.toDataURL("image/jpeg");

    stopCamera();
    document.getElementById("cam-view").style.display = "none";
    document.getElementById("preview-view").style.display = "block";

    // Update Geolokasi saat masuk ke mode preview
    try {
      geoStatus.innerText = "Mengunci lokasi (tunggu sampai 10 detik)...";
      const coords = await window.getCurrentCoords();
      userCoords = coords;

      geoStatus.innerText = "Mencari nama tempat...";
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lon}&zoom=14&addressdetails=1`,
        { signal: AbortSignal.timeout(3000) },
      );
      const data = await response.json();

      // Menggunakan urutan prioritas yang SAMA PERSIS dengan renderStories di main.js
      const addr = data.address || {};
      const placeName =
        addr.village ||
        addr.suburb ||
        addr.hamlet ||
        addr.town ||
        addr.city_district ||
        addr.city ||
        addr.county ||
        "Lokasi spesifik";

      geoStatus.innerText = `📍 ${placeName} (${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)})`;
    } catch (e) {
      console.error("Error geolocation:", e.message);
      geoStatus.innerText = `⚠️ ${e.message}`;
      geoStatus.style.color = "#ff6b6b";
    }
  };

  // 2. Ulangi
  document.getElementById("retake-btn").onclick = () => {
    startCamera();
    document.getElementById("cam-view").style.display = "block";
    document.getElementById("preview-view").style.display = "none";
  };

  // 3. Simpan
  document.getElementById("save-btn").onclick = async () => {
    const title = document.getElementById("story-title").value;
    const caption = document.getElementById("story-caption").value;

    if (!title || !caption) return alert("Isi judul & caption!");

    const dataUrl = canvas.toDataURL("image/jpeg");
    const blob = dataURLtoBlob(dataUrl);

    const formData = new FormData();
    formData.append("image", blob, "story.jpg");
    formData.append("title", title);
    formData.append("caption", caption);
    formData.append("lat", userCoords.lat);
    formData.append("lon", userCoords.lon);

    try {
      const response = await fetch(
        "https://backend-web-profil-production.up.railway.app/api/stories",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
          errorData?.message || response.statusText || "Unknown error";
        return alert("Gagal simpan: " + message);
      }

      alert("Story berhasil disimpan dengan koordinat!");
      window.router("profil");
    } catch (err) {
      alert("Gagal simpan: " + err.message);
    }
  };
};
