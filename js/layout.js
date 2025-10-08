async function loadPart(selector, file) {
  try {
    const response = await fetch(file);
    const data = await response.text();
    document.querySelector(selector).innerHTML = data;
    return await new Promise(resolve => requestAnimationFrame(resolve));
  } catch (err) {
    return console.error(`Error loading ${file}:`, err);
  }
}

// 先載入 header 和 footer
Promise.all([
  loadPart("header", "/web_control/header.html"),
  loadPart("footer", "/web_control/footer.html")
]).then(() => {
  // 漢堡特效
  const toggle = document.getElementById("menu-toggle");
  const close = document.getElementById("menu-close");
  const navUl = document.querySelector("nav ul");

  if (toggle && navUl) {
    toggle.addEventListener("click", () => {
      navUl.classList.toggle("show");
    });
  }

  if (close && navUl) {
    close.addEventListener("click", () => {
      navUl.classList.remove("show");
    });
  }

  document.addEventListener("click", (e) => {
    if (navUl.classList.contains("show") &&
        !navUl.contains(e.target) &&
        !toggle.contains(e.target)) {
      navUl.classList.remove("show");
    }
  });
});

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 0) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
});