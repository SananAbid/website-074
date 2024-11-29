document.addEventListener("DOMContentLoaded", () => {
  const alertBox = document.getElementById("alert");
  const cards = document.querySelectorAll(".card");
  const resetStockBtn = document.getElementById("reset-stock-btn");

  // Thresholds for stock levels
  const stockThresholds = {
    low: 5,
    medium: 15,
  };

  // Helper function: Update stock display
  const updateStockDisplay = (card, stock) => {
    const stockBar = card.querySelector(".stock-bar");
    const description = card.querySelector("p");

    // Update description and color dynamically based on stock
    if (stock < stockThresholds.low) {
      description.textContent = `Low stock: ${stock} units`;
      stockBar.className = "stock-bar red";
    } else if (stock < stockThresholds.medium) {
      description.textContent = `${stock} units left`;
      stockBar.className = "stock-bar yellow";
    } else {
      description.textContent = `Good Quantity: ${stock} units`;
      stockBar.className = "stock-bar green";
    }

    // Adjust stock bar width (visual effect)
    stockBar.style.width = `${(stock / 30) * 100}%`;

    // Show alert if stock is critically low
    if (stock < stockThresholds.low) {
      alertBox.textContent = `⚠️ Low Stock: ${description.textContent}`;
      alertBox.style.display = "block";
    } else {
      alertBox.style.display = "none";
    }
  };

  // Add functionality to update stock when a button is clicked
  cards.forEach((card) => {
    const button = card.querySelector(".update-stock-btn");

    button.addEventListener("click", () => {
      // Prompt user for a new stock value
      const newStock = parseInt(
        prompt("Enter the new stock quantity for this product:", "10"),
        10
      );

      // Validate input and update stock
      if (!isNaN(newStock) && newStock >= 0) {
        updateStockDisplay(card, newStock);
      } else {
        alert("Please enter a valid number.");
      }
    });
  });

  // Add functionality to reset all stock levels
  resetStockBtn.addEventListener("click", () => {
    const defaultStocks = [3, 10, 25]; // Default stock values for iPhone, MacBook, AirPods

    cards.forEach((card, index) => {
      updateStockDisplay(card, defaultStocks[index]);
    });

    alertBox.style.display = "none";
  });

  // Add search functionality
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    cards.forEach((card) => {
      const product = card.querySelector("p").textContent.toLowerCase();
      card.style.display = product.includes(query) || query === "" ? "block" : "none";
    });
  });

  // Initialize with default values
  const defaultStocks = [3, 10, 25];
  cards.forEach((card, index) => {
    updateStockDisplay(card, defaultStocks[index]);
  });
});
