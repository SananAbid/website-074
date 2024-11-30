document.addEventListener("DOMContentLoaded", () => {
  const inventoryContainer = document.getElementById("inventory-container");
  const notificationBar = document.getElementById("notification-bar");
  const searchInput = document.getElementById("search-input");
  const itemForm = document.getElementById("item-form");

  let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

  const saveInventory = () => localStorage.setItem("inventory", JSON.stringify(inventory));

  const renderInventory = (filter = "") => {
      inventoryContainer.innerHTML = "";
      let lowStockNotified = false;

      inventory
          .filter((item) => item.name.toLowerCase().includes(filter.toLowerCase()))
          .forEach((item, index) => {
              const div = document.createElement("div");
              div.className = "inventory-item";

              let statusClass = "status-high";
              if (item.quantity <= 5) {
                  statusClass = "status-low";
                  if (!lowStockNotified) {
                      notificationBar.textContent = `⚠️ Low Stock: ${item.name}!`;
                      notificationBar.style.display = "block";
                      lowStockNotified = true;
                  }
              } else if (item.quantity <= 10) {
                  statusClass = "status-medium";
              }

              div.innerHTML = `
                  <p>${item.name}</p>
                  <p>${item.quantity} units left</p>
                  <p>${item.description}</p>
                  <div class="status ${statusClass}"></div>
                  <div class="actions">
                      <button onclick="editItem(${index})">Edit</button>
                      <button onclick="deleteItem(${index})">Delete</button>
                  </div>
              `;

              inventoryContainer.appendChild(div);
          });

      if (!lowStockNotified) notificationBar.style.display = "none";
  };

  const addItem = (name, quantity, description) => {
      inventory.push({ name, quantity, description });
      saveInventory();
      renderInventory();
  };

  const updateItem = (index, name, quantity, description) => {
      inventory[index] = { name, quantity, description };
      saveInventory();
      renderInventory();
  };

  const deleteItem = (index) => {
      inventory.splice(index, 1);
      saveInventory();
      renderInventory();
  };

  itemForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("item-name").value.trim();
      const quantity = parseInt(document.getElementById("item-quantity").value.trim());
      const description = document.getElementById("item-description").value.trim();

      addItem(name, quantity, description);
      itemForm.reset();
  });

  window.editItem = (index) => {
      const item = inventory[index];
      document.getElementById("item-name").value = item.name;
      document.getElementById("item-quantity").value = item.quantity;
      document.getElementById("item-description").value = item.description;

      itemForm.onsubmit = (e) => {
          e.preventDefault();
          updateItem(
              index,
              document.getElementById("item-name").value.trim(),
              parseInt(document.getElementById("item-quantity").value.trim()),
              document.getElementById("item-description").value.trim()
          );
          itemForm.reset();
          itemForm.onsubmit = addNewItemHandler;
      };
  };

  window.deleteItem = deleteItem;

  document.getElementById("search-button").addEventListener("click", () => {
      renderInventory(searchInput.value);
  });

  renderInventory();
});
