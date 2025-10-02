function loadPart(selector, file) {
    fetch(file)
      .then(response => response.text())
      .then(data => {
        document.querySelector(selector).innerHTML = data;
      })
      .catch(err => console.error(`Error loading ${file}:`, err));
  }
  
  // 載入 header 和 footer
  loadPart("header", "/web_control/header.html");
  loadPart("footer", "/web_control/footer.html");
  