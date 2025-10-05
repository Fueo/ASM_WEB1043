// ===================== Address Manager =====================
const ADDRESS_KEY = "checkout_addresses"; // Tên key lưu trữ trong localStorage

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
    //Query selector đến container chứa các address item
    const container = document.querySelector(".checkout-address");
    const oldItems = container.querySelectorAll(".address-item");
    oldItems.forEach(item => item.remove()); // Xóa hết trước khi render lại

    const addresses = getAddresses(); // Lấy danh sách address từ localStorage

    // Tạo và chèn các address item vào container
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

        // Chèn trước nút "Add New Address"
        // Nếu không xài insertBefore thì sẽ không chèn được vì nút này không có class hay id để querySelector
        container.insertBefore(item, container.querySelector(".add-new-btn"));
    });

    // Gắn sự kiện cho các button edit, delete, radio trong mỗi card Address bằng hàm bên dưới
    attachEvents();
}

// Gắn sự kiện cho các button edit, delete, radio trong mỗi card Address
function attachEvents() {
    const editButtons = document.querySelectorAll(".edit-btn");
    const deleteButtons = document.querySelectorAll(".delete-btn");
    const radios = document.querySelectorAll(".address-item input[type=radio]");

    // Duyệt tất cả các nút Edit và gắn sự kiện click
    editButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.dataset.index; // Lấy index từ data-index
            const addr = getAddresses()[index]; // Lấy address tương ứng. Viết đủ và đúng phải là
            // const addrArr = getAddresses()
            // const addr = addrArr[index] =
            // gộp lại thành addr = getAddresses()[index]

            // Điền dữ liệu có sẵn vào form nhập address
            document.querySelector("#name").value = addr.name;
            document.querySelector("#phone").value = addr.phone;
            document.querySelector("#address").value = addr.address;

            // Hiển thị form và chuyển sang chế độ Edit
            const addressInput = document.querySelector(".address-input");
            addressInput.querySelector("h3").textContent = "Edit Address"; // đổi tiêu đề form
            addressInput.style.display = "flex";
            addressInput.dataset.editIndex = index;
            // lưu index để biết đang sửa (!!! Rất quan trọng để dùng ở dòng 149 hàm If)
        });
    });

    // Duyệt tất cả các nút Delete và gắn sự kiện click
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            let addresses = getAddresses();
            addresses.splice(index, 1); // xóa address trong mảng
            saveAddresses(addresses); // lưu lại mảng đã xóa vào localStorage
            renderAddresses(); // render lại giao diện
        });
    });

    // Thêm logic xử lý sự kiện vào các nút radio
    radios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            const index = e.target.dataset.index;// Lấy index từ data-index (đã đc add vào trong lúc render giao diện)
            // dataset là một thuộc tính tùy chỉnh do người dùng tự add vào
            // Với cú pháp data-* và truy cập tới nó bằng cách dùng dataset.*
            // VD <button data-index ="123" data-name="hello"> => dataset.index = 123, dataset.name = hello 
            let addresses = getAddresses(); // Lấy danh sách address
            addresses.forEach((a, i) => a.selected = (i == index));
            // Duyệt mảng và tìm ra address có i bằng index rồi set selected = true, các address khác set false
            // Đây là cách viết ngắn gọn nếu viết đúng và đủ phải là 
            // address.forEach(a, i) => {if (i === index) {a.selected = true} else {a.selected = false}}
            saveAddresses(addresses); // Lưu lại vào localStorage
        });
    });
}

// Thêm logic cho form nhập address
function addLogicFunctionToAddressInput() {
    const addNewAddressButton = document.querySelector(".add-new-btn");
    const addressInput = document.querySelector(".address-input");
    const closeAddressInputButton = document.querySelector(".close-address-input");
    const saveBtn = document.querySelector(".save-address-btn");

    // Nếu query được các phần tử trên thì mới gắn sự kiện
    if (addNewAddressButton && addressInput && closeAddressInputButton) {
        addressInput.style.display = "none"; // Khởi tạo ban đầu là ẩn form

        // Thêm sự kiện cho nút "Add New Address"
        addNewAddressButton.addEventListener("click", function (event) {
            event.preventDefault();
            addressInput.querySelector("h3").textContent = "Add New Address";
            addressInput.style.display = "flex";
            addressInput.dataset.editIndex = ""; // clear edit state
            document.querySelector("#name").value = "";
            document.querySelector("#phone").value = "";
            document.querySelector("#address").value = "";
        });

        // Xử lý sự kiện nút đóng form
        closeAddressInputButton.addEventListener("click", function () {
            addressInput.style.display = "none";
        });

        // Xử lý sự kiện lưu address (cả thêm mới và sửa)
        saveBtn.addEventListener("click", function () {
            const name = document.querySelector("#name").value.trim();
            const phone = document.querySelector("#phone").value.trim();
            const address = document.querySelector("#address").value.trim();

            //Validate dữ liệu
            if (!name || !phone || !address) {
                alert("Please fill in all fields");
                return;
            }

            let addresses = getAddresses() // Lấy danh sách address hiện tại;
            const editIndex = addressInput.dataset.editIndex; // Lấy index đang sửa (nếu có) bằng cách đọc từ data attribute
            // Kiểm tra nếu đang ở chế độ edit hay thêm mới bằng cách kiểm tra editIndex (đã được gán khi bấm nút edit)
            if (editIndex !== "" && editIndex !== undefined) {
                // Nếu cập nhật thì sẽ gán đè lên phần tử cũ có index = editIndex
                addresses[editIndex] = { name, phone, address, selected: addresses[editIndex].selected };
            } else {
                // Nếu thêm mới thì push vào cuối mảng, address đầu tiên thêm vào sẽ được chọn làm mặc định
                addresses.push({ name, phone, address, selected: addresses.length === 0 });
            }

            saveAddresses(addresses); // Lưu lại vào localStorage
            renderAddresses(); // Render lại giao diện
            addressInput.style.display = "none"; // Ẩn form nhập address đi
        });
    }
}

// Gọi hàm renderAddresses và addressInputFunction khi trang được tải
document.addEventListener("DOMContentLoaded", () => {
    renderAddresses();
    addLogicFunctionToAddressInput();
});