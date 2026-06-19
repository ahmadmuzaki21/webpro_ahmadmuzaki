/**
 * map.js — Pembungkus Leaflet.js Peta Digital (Praktikum 4 & 5)
 */
export const DEFAULT_CENTER = [-7.7256, 109.0095]; // UNUGHA Cilacap
export const DEFAULT_ZOOM = 13;

export function createMap(
  el,
  { center = DEFAULT_CENTER, zoom = DEFAULT_ZOOM } = {},
) {
  const Leaflet = window.L || {};
  if (!Leaflet.map) {
    console.error("Leaflet.js library tidak termuat di HTML!");
    return null;
  }

  // Inisialisasi Peta
  const map = Leaflet.map(el).setView(center, zoom);

  // Tempel Tile OpenStreetMap
  Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 19,
  }).addTo(map);

  return map;
}

// Marker custom emoji agar terhindar dari error url aset gambar bawaan Leaflet pasca kompilasi
export function photoIcon() {
  const Leaflet = window.L || {};
  if (!Leaflet.divIcon) return null;

  return Leaflet.divIcon({
    className: "map-pin",
    html: '<span class="map-pin__emoji">📸</span>',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -34],
  });
}
