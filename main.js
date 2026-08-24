document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  /* ---------------- LOGIN PAGE ---------------- */
  if (path.includes("index.html")) {
    const form = document.querySelector("form");

    if (form) {
      // Error message element
      const errorMsg = document.createElement("p");
      errorMsg.style.color = "red";
      errorMsg.style.fontWeight = "bold";
      errorMsg.style.marginTop = "10px";
      errorMsg.style.display = "none";
      form.appendChild(errorMsg);

      // Show/Hide password toggle
      const passwordInput = form.querySelector("input[type='password']");
      if (passwordInput) {
        const passwordToggleBtn = document.createElement("button");
        passwordToggleBtn.type = "button";
        passwordToggleBtn.textContent = "👁 Show Password";
        passwordToggleBtn.style.marginTop = "10px";
        passwordToggleBtn.style.display = "block";
        passwordToggleBtn.style.cursor = "pointer";
        form.appendChild(passwordToggleBtn);

        passwordToggleBtn.addEventListener("click", () => {
          if (passwordInput.type === "password") {
            passwordInput.type = "text";
            passwordToggleBtn.textContent = "🙈 Hide Password";
          } else {
            passwordInput.type = "password";
            passwordToggleBtn.textContent = "👁 Show Password";
          }
        });
      }

      // Login validation
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const username = form.querySelector("input[type='text']").value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
          errorMsg.textContent = "⚠️ Please fill in both fields!";
          errorMsg.style.display = "block";
        } else if (username === "admin" && password === "1234") {
          window.location.href = "car-homepage.html";
        } else {
          errorMsg.textContent = "❌ Invalid credentials. Try again!";
          errorMsg.style.display = "block";
        }
      });
    }
  }

  /* ---------------- HOMEPAGE ---------------- */
  if (path.includes("car-homepage.html")) {
    const heading = document.querySelector(".heading h2");
    if (heading) {
      heading.addEventListener("mouseover", () => {
        heading.textContent = "Choose Your Dream Car 🚘";
      });
      heading.addEventListener("mouseout", () => {
        heading.textContent = "Wellcome To Car Selection";
      });
    }
  }

  /* ---------------- CATEGORY PAGES ---------------- */
  if (path.includes("suv.html") || path.includes("sedan.html") || path.includes("sports.html") ||
      path.includes("pickup.html") || path.includes("offroad.html")) {

    const cards = document.querySelectorAll(".card");
    const container = document.querySelector(".container");

    // Modal + Favorites
    if (cards.length > 0) {
      const modal = document.createElement("div");
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.background = "rgba(0,0,0,0.7)";
      modal.style.display = "none";
      modal.style.justifyContent = "center";
      modal.style.alignItems = "center";
      modal.style.zIndex = "1000";
      document.body.appendChild(modal);

      const modalContent = document.createElement("div");
      modalContent.style.background = "#fff";
      modalContent.style.color = "#000";
      modalContent.style.padding = "20px";
      modalContent.style.borderRadius = "10px";
      modalContent.style.width = "300px";
      modal.appendChild(modalContent);

      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
      });

      cards.forEach(card => {
        card.addEventListener("click", () => {
          const title = card.querySelector("h2").textContent;
          const specs = [...card.querySelectorAll(".specs li")]
            .map(li => li.textContent)
            .join("\n");

          modalContent.innerHTML = `<h2>${title}</h2><pre>${specs}</pre>`;
          modal.style.display = "flex";
        });

        // Favorites button
        const favBtn = document.createElement("button");
        favBtn.textContent = "❤️ Save";
        favBtn.style.marginTop = "10px";
        favBtn.style.display = "block";
        favBtn.style.cursor = "pointer";
        card.appendChild(favBtn);

        favBtn.addEventListener("click", () => {
          const carName = card.querySelector("h2").textContent;
          let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
          
          if (!favorites.includes(carName)) {
            favorites.push(carName);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            showNotification(`${carName} added to favorites!`);
          } else {
            showNotification(`${carName} is already in favorites!`);
          }
        });
      });
    }

    // Search bar
    if (container) {
      const searchBar = document.createElement("input");
      searchBar.type = "text";
      searchBar.placeholder = "Search cars...";
      searchBar.style.margin = "20px";
      searchBar.style.padding = "10px";
      searchBar.style.width = "250px";
      document.body.insertBefore(searchBar, container);

      searchBar.addEventListener("keyup", () => {
        const query = searchBar.value.toLowerCase();
        const cards = container.querySelectorAll(".card");

        cards.forEach(card => {
          const title = card.querySelector("h2").textContent.toLowerCase();
          card.style.display = title.includes(query) ? "block" : "none";
        });
      });
    }

    // ⭐ Go to Favorites button
    const favPageBtn = document.createElement("button");
    favPageBtn.textContent = "⭐ View Favorites";
    favPageBtn.style.position = "fixed";
    favPageBtn.style.bottom = "20px";
    favPageBtn.style.left = "20px";
    favPageBtn.style.padding = "10px 20px";
    favPageBtn.style.borderRadius = "8px";
    favPageBtn.style.cursor = "pointer";
    favPageBtn.style.background = "gold";
    favPageBtn.style.fontWeight = "bold";
    document.body.appendChild(favPageBtn);

    favPageBtn.addEventListener("click", () => {
      window.location.href = "favorites.html";
    });
  }

  /* ---------------- FAVORITES PAGE ---------------- */
  if (path.includes("favorites.html")) {
    const favoritesList = document.getElementById("favoritesList");
    const clearBtn = document.getElementById("clearFavorites");

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favorites.forEach(carName => {
      const carItem = document.createElement("div");
      carItem.className = "car-item";
      carItem.textContent = carName;

      // Remove button
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "❌ Remove";
      removeBtn.style.marginLeft = "10px";
      removeBtn.style.cursor = "pointer";
      carItem.appendChild(removeBtn);

      removeBtn.addEventListener("click", () => {
        favorites = favorites.filter(fav => fav !== carName);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        carItem.remove();
        showNotification(`${carName} removed from favorites!`);
      });

      favoritesList.appendChild(carItem);
    });

    clearBtn.addEventListener("click", () => {
      localStorage.removeItem("favorites");
      favoritesList.innerHTML = "";
      showNotification("Favorites cleared!");
    });
  }

  /* ---------------- GLOBAL FEATURES ---------------- */
  // Back-to-top
  const backToTop = document.createElement("button");
  backToTop.textContent = "⬆ Back to Top";
  backToTop.style.position = "fixed";
  backToTop.style.bottom = "20px";
  backToTop.style.right = "20px";
  backToTop.style.padding = "10px";
  backToTop.style.borderRadius = "8px";
  backToTop.style.cursor = "pointer";
  document.body.appendChild(backToTop);
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Dark mode toggle
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "🌙 Dark Mode";
  toggleBtn.style.position = "fixed";
  toggleBtn.style.top = "20px";
  toggleBtn.style.right = "20px";
  toggleBtn.style.padding = "10px";
  toggleBtn.style.borderRadius = "8px";
  toggleBtn.style.cursor = "pointer";
  document.body.appendChild(toggleBtn);

  let dark = false;
  toggleBtn.addEventListener("click", () => {
    dark = !dark;
    if (dark) {
      document.body.style.background = "#111";
      document.body.style.color = "#eee";
      toggleBtn.textContent = "☀️ Light Mode";
    } else {
      document.body.style.background = "";
      document.body.style.color = "";
      toggleBtn.textContent = "🌙 Dark Mode";
    }
  });
});