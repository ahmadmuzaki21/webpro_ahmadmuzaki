// frontend/src/js/api.js

export const BASE_URL =
  "https://backend-web-profil-production.up.railway.app/api";

export const api = {
  // Fungsi Login
  async login({ username, password }) {
    // Pastikan pakai kurung kurawal di sini
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok)
      throw new Error("Login gagal, periksa username/password.");
    return await response.json();
  },

  // Fungsi Ambil Data Artikel
  async getArticles() {
    const response = await fetch(`${BASE_URL}/articles`);
    if (!response.ok) throw new Error("Gagal mengambil data artikel.");
    return await response.json();
  },

  // Fungsi Tambah Artikel
  async createArticle(data) {
    const response = await fetch(`${BASE_URL}/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
  async updateArticle(id, data) {
    const response = await fetch(`${BASE_URL}/articles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Gagal mengupdate artikel.");
    return await response.json();
  },

  // Fungsi Hapus Artikel
  async deleteArticle(id) {
    const response = await fetch(`${BASE_URL}/articles/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  },
};
