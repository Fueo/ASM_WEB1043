import { initializeOrder } from "./data/fetchData.js";
const initApp = () => {
    // Khởi tạo ứng dụng nếu cần
    addEventToTabs();
    renderInvoiceHistory();
    addEventToViewDetailButtons();
    // Chỉ chạy các hàm này nếu chúng ta đang ở trang profile
    if (document.getElementById("address-book")) {
        renderProfileAddresses();
        addLogicToProfileAddressForm();
    }
}
const addEventToTabs = () => {
    const navItems = document.querySelectorAll('.profile-nav-item');
    const tabs = document.querySelectorAll('.profile-tab');

    function switchTab(targetTabId) {
        // Ẩn tất cả các tab content
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });

        // Xóa trạng thái active khỏi tất cả nav items
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        // Hiển thị tab content được chọn
        const targetTab = document.getElementById(targetTabId);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Đặt trạng thái active cho nav item được chọn
        const activeNavItem = document.querySelector(`.profile-nav-item[data-tab="${targetTabId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetTabId = e.currentTarget.getAttribute('data-tab');

            if (targetTabId === 'logout') {
                // Xử lý logic đăng xuất
                console.log("Đăng xuất...");
                // Thay alert bằng custom modal UI nếu đây là app chính thức
                alert("Bạn đã đăng xuất.");
                return;
            }

            switchTab(targetTabId);
        });
    });
}

const addEventToViewDetailButtons = () => {
    // 2. Thêm trình nghe sự kiện click vào container
    const orderListContainer = document.querySelector('.order-history-list');

    if (orderListContainer) {
        orderListContainer.addEventListener('click', function (event) {

            // Kiểm tra xem có phải đã click vào nút '.view-detail-btn' không
            const viewButton = event.target.closest('.view-detail-btn');

            if (!viewButton) {
                return; // Nếu không phải thì không làm gì cả
            }

            // Lấy ra .order-item là cha của cái nút vừa bấm
            const orderItem = viewButton.closest('.order-item');

            if (orderItem) {
                // Thêm hoặc xóa class 'expanded'
                orderItem.classList.toggle('expanded');

                // Đổi chữ trên nút
                if (orderItem.classList.contains('expanded')) {
                    viewButton.textContent = 'Hide Details';
                } else {
                    viewButton.textContent = 'View Details';
                }
            }
        });
    }
}

const renderInvoiceHistory = async () => {
    let data = await initializeOrder();
    let orders = data.orders
    console.log(orders);

    displayOrderHistory(orders);
}

/**
 * Định dạng số thành tiền tệ USD.
 * (Tôi thấy bạn đang dùng USD trong code)
 * @param {number} amount - Số tiền
 * @returns {string} - Chuỗi tiền tệ (ví dụ: "$495.00")
 */
function formatUSD(amount) {
    // Dùng 'en-US' và 'USD' theo code của bạn
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Tạo khối HTML chi tiết cho một đơn hàng (items và summary).
 * @param {object} order - Đối tượng đơn hàng
 * @returns {string} - Chuỗi HTML của phần chi tiết
 */
function createOrderDetailsHtml(order) {
    // 1. Tạo HTML cho từng item
    const itemsHtml = order.items.map(item => `
        <div class="order-detail-item">
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">Quantity: ${item.quantity}</div>
            </div>
            <div class="item-price">
                ${formatUSD(item.price * item.quantity)}
            </div>
        </div>
    `).join(''); // Dùng join('') để gộp mảng thành 1 chuỗi

    // 2. Lấy thông tin tóm tắt
    const summary = order.summary;

    // 3. Trả về khối HTML hoàn chỉnh
    return `
        <div class="order-details">
            <h4>Items</h4>
            <div class="order-detail-list">
                ${itemsHtml}
            </div>
            
            <h4>Billing Summary</h4>
            <div class="order-details-summary">
                <p>
                    <span>Subtotal:</span> 
                    <span>${formatUSD(summary.subtotal)}</span>
                </p>
                <p>
                    <span>Tax:</span> 
                    <span>${formatUSD(summary.tax)}</span>
                </p>
                <p>
                    <span>Shipping:</span> 
                    <span>${formatUSD(summary.shipping)}</span>
                </p>
                <p class="discount">
                    <span>Discount:</span> 
                    <span>-${formatUSD(summary.discount)}</span>
                </p>
                <p class="total">
                    <span>Total:</span> 
                    <span>${formatUSD(summary.total)}</span>
                </p>
            </div>
        </div>
    `;
}


/**
 * =================================================================
 * HIỂN THỊ LỊCH SỬ ĐƠN HÀNG CỦA NGƯỜI DÙNG
 * =================================================================
 */
function displayOrderHistory(allOrders) {
    // ---- Bước 1 & 2: Lấy ID người dùng từ localStorage ----

    // Dùng 'user' key theo code của bạn
    const loggedInUserString = localStorage.getItem('user');

    if (!loggedInUserString) {
        // Sửa lại log cho khớp với 'user'
        console.error("Không tìm thấy người dùng đang đăng nhập (localStorage 'user' rỗng).");
        return;
    }

    let currentUserId;
    try {
        const loggedInUser = JSON.parse(loggedInUserString);
        currentUserId = loggedInUser.id; // Lấy ra ID
    } catch (e) {
        console.error("Lỗi khi đọc dữ liệu người dùng từ localStorage:", e);
        return;
    }

    if (!currentUserId) {
        console.error("Đối tượng người dùng trong localStorage không có 'id'.");
        return;
    }

    // Lấy phần tử DOM để chứa danh sách đơn hàng
    const orderListContainer = document.querySelector('.order-history-list');
    if (!orderListContainer) {
        console.error("Không tìm thấy phần tử container '.order-history-list'.");
        return;
    }

    // Xóa nội dung mẫu (sample) trước khi thêm đơn hàng thật
    orderListContainer.innerHTML = '';

    // ---- Bước 3: Lọc đơn hàng theo currentUserId ----
    const userOrders = allOrders.filter(order => order.customer.idAccount === currentUserId);

    // ---- Bước 4: Hiển thị nếu không có đơn hàng ----
    if (userOrders.length === 0) {
        // Dùng thông báo của bạn
        orderListContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Your order history is empty!.</p>';
        return;
    }

    // ---- Bước 5: Lặp và hiển thị đơn hàng ----
    userOrders.forEach(order => {
        // Tạo một thẻ div bọc ngoài cho mỗi đơn hàng
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';

        // --- Định dạng dữ liệu (Giữ nguyên code của bạn) ---
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('en-GB');

        // Dùng hàm phụ trợ 'formatUSD' (Giả sử bạn đã có hàm này)
        const formattedTotal = formatUSD(order.summary.total);

        const statusText = order.status;
        const statusClass = `status-${statusText.toLowerCase().replace(' ', '-')}`;

        // --- *** ĐÂY LÀ PHẦN THAY ĐỔI CHÍNH *** ---

        // 1. Tạo HTML cho phần tóm tắt (bọc trong .order-summary-view)
        const orderSummaryHtml = `
            <div class="order-summary-view">
                <div class="order-info-group">
                    <div class="left-group">
                        <p class="order-id">Order ID: <b>${order.id}</b></p>
                        <p>Order Date: ${formattedDate}</p>
                        <p>Total: <b>${formattedTotal}</b></p>
                        <p class="${statusClass}">Status: ${statusText}</p>
                    </div>

                    <div class="right-group">
                        <p>Customer: <b>${order.customer.name}</b></p>
                        <p>Phone: <b>${order.customer.phone}</b></p>
                        <p>Address: <b>${order.customer.address}</b></p>
                    </div>


                </div>
                <div class="actions">
                    <button class="view-detail-btn view-button" data-order-id="${order.id}">
                        View Details
                    </button>
                </div>
            </div>
        `;

        // 2. Tạo HTML cho phần chi tiết (bị ẩn)
        //    (Giả sử bạn đã có hàm createOrderDetailsHtml(order))
        const orderDetailsHtml = createOrderDetailsHtml(order);

        // 3. Gán CẢ HAI khối HTML vào thẻ div
        orderItem.innerHTML = orderSummaryHtml + orderDetailsHtml;
        // --- *** KẾT THÚC PHẦN THAY ĐỔI *** ---

        // Thêm đơn hàng này vào container
        orderListContainer.appendChild(orderItem);
    });
}

// ==========================================================
// QUẢN LÝ SỔ ĐỊA CHỈ (TRANG PROFILE)
// ==========================================================

// --- 1. HÀM TÁI SỬ DỤNG (Giống hệt code của bạn) ---
// Tên key lưu trữ trong localStorage
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

/**
 * Render lại giao diện Sổ Địa chỉ cho trang Profile.
 * Hàm này khác với 'renderAddresses' của trang checkout.
 */
function renderProfileAddresses() {
    // Query selector đến container của tab Sổ Địa chỉ
    const container = document.querySelector("#address-book .address-book");
    if (!container) {
        // console.error("Không tìm thấy container '.address-book' của profile.");
        return; // Thoát nếu không ở đúng trang
    }

    const addNewBtn = container.querySelector(".add-new-address-btn");

    // Xóa hết các address item cũ trước khi render lại
    const oldItems = container.querySelectorAll(".address-item-profile");
    oldItems.forEach(item => item.remove());

    const addresses = getAddresses(); // Lấy danh sách address từ localStorage

    // Tạo và chèn các address item vào container
    addresses.forEach((addr, index) => {
        const item = document.createElement("div");
        item.classList.add("address-item-profile");

        // Tạo huy hiệu "Default" nếu addr.selected = true
        const defaultBadge = addr.selected
            ? '<span class="default-badge">Default</span>'
            : '';

        // Tạo HTML dựa trên cấu trúc của trang profile
        // QUAN TRỌNG: Thêm class 'edit-btn', 'delete-btn' và 'data-index' vào các icon
        item.innerHTML = `
            <div class="address-detail">
                <p class="address-name">${addr.name} ${defaultBadge}</p>
                <p class="address-phone">${addr.phone}</p>
                <p class="address-line">${addr.address}</p>
            </div>
            <div class="button-groups">
                <img src="img/edit.png" alt="Edit" class="edit-btn" data-index="${index}">
                <img src="img/delete.png" alt="Delete" class="delete-btn" data-index="${index}">
            </div>
        `;

        // Chèn trước nút "Add New Address"
        container.insertBefore(item, addNewBtn);
    });

    // Gắn sự kiện cho các button edit, delete (hàm mới bên dưới)
    attachProfileAddressEvents();
}


// --- 3. HÀM GẮN SỰ KIỆN MỚI (Đã chỉnh sửa) ---

/**
 * Gắn sự kiện cho các button edit, delete trong mỗi card Address.
 * Hàm này không xử lý radio button như trang checkout.
 */
function attachProfileAddressEvents() {
    // Dùng '#address-book' để đảm bảo chỉ query đúng các nút của tab này
    const editButtons = document.querySelectorAll("#address-book .edit-btn");
    const deleteButtons = document.querySelectorAll("#address-book .delete-btn");

    // Duyệt tất cả các nút Edit và gắn sự kiện click
    editButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            const addr = getAddresses()[index];

            // Giả sử trang profile dùng CHUNG form modal/popup
            // với trang checkout (có id: #name, #phone, #address)
            try {
                document.querySelector("#name").value = addr.name;
                document.querySelector("#phone").value = addr.phone;
                document.querySelector("#address").value = addr.address;

                const addressInput = document.querySelector(".address-input");
                addressInput.querySelector("h3").textContent = "Edit Address";
                addressInput.style.display = "flex";
                addressInput.dataset.editIndex = index; // Lưu index để biết đang sửa
            } catch (formError) {
                console.error("Không tìm thấy form nhập địa chỉ. Bạn cần đảm bảo HTML của form tồn tại trên trang này.", formError);
                alert("Lỗi: Không tìm thấy form chỉnh sửa.");
            }
        });
    });

    // Duyệt tất cả các nút Delete và gắn sự kiện click
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
                return; // Ngừng nếu người dùng hủy
            }

            const index = e.target.dataset.index;
            let addresses = getAddresses();

            // Kiểm tra xem có đang xóa địa chỉ mặc định không
            const wasDefault = addresses[index].selected;

            addresses.splice(index, 1); // Xóa address trong mảng

            // Nếu vừa xóa địa chỉ mặc định VÀ vẫn còn địa chỉ khác
            if (wasDefault && addresses.length > 0) {
                // Tự động set địa chỉ đầu tiên làm mặc định mới
                addresses[0].selected = true;
            }

            saveAddresses(addresses); // Lưu lại mảng đã xóa vào localStorage
            renderProfileAddresses(); // Render lại giao diện SỔ ĐỊA CHỈ
        });
    });

    // Không cần xử lý radio, vì trang này không có
}


// --- 4. HÀM LOGIC CHO FORM (Đã chỉnh sửa) ---

/**
 * Thêm logic cho form nhập address (nút Add New, Save, Close).
 * Giả sử dùng chung form '.address-input'
 */
function addLogicToProfileAddressForm() {
    // Sửa selector cho nút "Add New" của trang profile
    const addNewAddressButton = document.querySelector(".add-new-address-btn");

    // Các selector này giả sử là chung
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
            addressInput.dataset.editIndex = ""; // Xóa trạng thái edit
            // Xóa trắng form
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

            if (!name || !phone || !address) {
                alert("Please fill in all fields");
                return;
            }

            let addresses = getAddresses();
            const editIndex = addressInput.dataset.editIndex;

            if (editIndex !== "" && editIndex !== undefined) {
                // CẬP NHẬT (EDIT)
                // Giữ nguyên trạng thái 'selected' của địa chỉ đang sửa
                addresses[editIndex] = {
                    name,
                    phone,
                    address,
                    selected: addresses[editIndex].selected
                };
            } else {
                // THÊM MỚI (ADD NEW)
                // Địa chỉ đầu tiên thêm vào sẽ được set làm mặc định
                addresses.push({
                    name,
                    phone,
                    address,
                    selected: addresses.length === 0
                });
            }

            saveAddresses(addresses); // Lưu lại vào localStorage
            renderProfileAddresses(); // Render lại giao diện SỔ ĐỊA CHỈ
            addressInput.style.display = "none"; // Ẩn form
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initApp()

});