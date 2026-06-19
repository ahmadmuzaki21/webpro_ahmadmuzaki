export const toast = {
  show(message, type = "success") {
    const toastEl = document.createElement("div");
    toastEl.style.position = "fixed";
    toastEl.style.bottom = "20px";
    toastEl.style.right = "20px";
    toastEl.style.padding = "12px 25px";
    toastEl.style.borderRadius = "8px";
    toastEl.style.color = "white";
    toastEl.style.fontWeight = "bold";
    toastEl.style.zIndex = "9999";
    toastEl.style.transition = "all 0.5s ease";
    toastEl.style.backgroundColor = type === "success" ? "#10B981" : "#EF4444";

    toastEl.innerText = message;
    document.body.appendChild(toastEl);

    setTimeout(() => {
      toastEl.style.opacity = "0";
      setTimeout(() => toastEl.remove(), 500);
    }, 3000);
  },
};
