// ===================== Address Manager =====================
const ADDRESS_KEY = "checkout_addresses";

// Lấy danh sách address từ localStorage
function getAddresses() {
    const data = localStorage.getItem(ADDRESS_KEY);
    return data ? JSON.parse(data) : [];
}

// Lưu danh sách address vào localStorage
function saveAddresses(addresses) {
    localStorage.setItem(ADDRESS_KEY, JSON.stringify(addresses));
}

// Render lại giao diện address list
function renderAddresses() {
    const container = document.querySelector(".checkout-address");
    const oldItems = container.querySelectorAll(".address-item");
    oldItems.forEach(item => item.remove()); // Xóa hết trước khi render lại

    const addresses = getAddresses();

    addresses.forEach((addr, index) => {
        const item = document.createElement("div");
        item.classList.add("address-item");
        item.innerHTML = `
            <input type="radio" name="address" ${addr.selected ? "checked" : ""} data-index="${index}">
            <div class="address-detail flex-col gap-16">
                <div class="address-name">${addr.name}</div>
                <div class="address-line">${addr.address}</div>
                <div class="address-phone">Phone: ${addr.phone}</div>
            </div>
            <div class="button-groups">
                <img src="img/edit.png" alt="edit-icon" data-index="${index}" class="edit-btn">
                <img src="img/delete.png" alt="delete-icon" data-index="${index}" class="delete-btn">
            </div>
        `;
        container.insertBefore(item, container.querySelector(".add-new-btn"));
    });

    // Gắn sự kiện
    attachEvents();
}

// Gắn sự kiện cho các button edit, delete, radio
function attachEvents() {
    const editButtons = document.querySelectorAll(".edit-btn");
    const deleteButtons = document.querySelectorAll(".delete-btn");
    const radios = document.querySelectorAll(".address-item input[type=radio]");

    // Edit
    editButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            const addr = getAddresses()[index];
            document.querySelector("#name").value = addr.name;
            document.querySelector("#phone").value = addr.phone;
            document.querySelector("#address").value = addr.address;

            const addressInput = document.querySelector(".address-input");
            addressInput.querySelector("h3").textContent = "Edit Address";
            addressInput.style.display = "flex";
            addressInput.dataset.editIndex = index; // lưu index để biết đang sửa
        });
    });

    // Delete
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            let addresses = getAddresses();
            addresses.splice(index, 1); // xóa address
            saveAddresses(addresses);
            renderAddresses();
        });
    });

    // Select radio
    radios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            const index = e.target.dataset.index;
            let addresses = getAddresses();
            addresses.forEach((a, i) => a.selected = (i == index));
            saveAddresses(addresses);
        });
    });
}

// ===================== Input Form Logic =====================
function addressInputFunction() {
    const addNewAddressButton = document.querySelector(".add-new-btn");
    const addressInput = document.querySelector(".address-input");
    const closeAddressInputButton = document.querySelector(".close-address-input");
    const saveBtn = document.querySelector(".save-address-btn");

    if (addNewAddressButton && addressInput && closeAddressInputButton) {
        addressInput.style.display = "none"; // Initially hide

        // Add New Address
        addNewAddressButton.addEventListener("click", function (event) {
            event.preventDefault();
            addressInput.querySelector("h3").textContent = "Add New Address";
            addressInput.style.display = "flex";
            addressInput.dataset.editIndex = ""; // clear edit state
            document.querySelector("#name").value = "";
            document.querySelector("#phone").value = "";
            document.querySelector("#address").value = "";
        });

        // Close form
        closeAddressInputButton.addEventListener("click", function () {
            addressInput.style.display = "none";
        });

        // Save Address
        saveBtn.addEventListener("click", function () {
            const name = document.querySelector("#name").value.trim();
            const phone = document.querySelector("#phone").value.trim();
            const address = document.querySelector("#address").value.trim();

            if (!name || !phone || !address) {
                alert("Please fill in all fields");
                return;
            }

            let addresses = getAddresses();
            const editIndex = addressInput.dataset.editIndex;

            if (editIndex !== "" && editIndex !== undefined) {
                // Update existing
                addresses[editIndex] = { name, phone, address, selected: addresses[editIndex].selected };
            } else {
                // Add new
                addresses.push({ name, phone, address, selected: addresses.length === 0 });
            }

            saveAddresses(addresses);
            renderAddresses();
            addressInput.style.display = "none";
        });
    }
}
