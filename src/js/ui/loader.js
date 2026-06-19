export const loader = {
  show(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
      el.innerHTML =
        '<div class="loading-spinner">Memuat data dari database...</div>';
    }
  },
  hide(elementId, htmlContent) {
    const el = document.getElementById(elementId);
    if (el) {
      el.innerHTML = htmlContent;
    }
  },
};
