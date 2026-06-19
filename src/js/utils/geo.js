/**
 * geo.js — Pembungkus Geolocation API (Praktikum 1 & 2)
 */
export function getCurrentCoords(opts = {}) {
  const { timeout = 5000, enableHighAccuracy = true } = opts;

  return new Promise((resolve) => {
    // Cek jika Geolocation API tidak didukung browser
    if (!("geolocation" in navigator)) {
      console.warn("[geo] Geolocation API tidak didukung pada browser ini");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      // Sukses: Kembalikan koordinat lintang & bujur
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        resolve({ lat: latitude, lon: longitude, accuracy });
      },
      // Gagal (Izin ditolak pengguna atau timeout): kembalikan null agar flow aman
      (err) => {
        console.warn("[geo] Gagal mengambil lokasi perangkat:", err.message);
        resolve(null);
      },
      { enableHighAccuracy, timeout, maximumAge: 0 },
    );
  });
}
