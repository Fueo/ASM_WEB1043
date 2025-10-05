
// Lấy dữ liệu từ localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const orderSummary = JSON.parse(localStorage.getItem("orderSummary")) || null;

// Render danh sách sản phẩm trong checkout summary lấy từ mảng cart
const renderCheckoutItems = () => {
    const container = document.querySelector(".order-summary");
    if (!container) return; //Nếu không query được thì return

    // Xóa các item mẫu cứng trong HTML
    const oldItems = container.querySelectorAll(".summary-item");
    oldItems.forEach(item => item.remove());

    // Nếu mảng cart lấy về rỗng thì render ra giao diện rỗng
    if (cart.length === 0) {
        container.innerHTML = `<p>Your cart is empty!</p>`;
        return;
    }

    // Render sản phẩm
    cart.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("summary-item");
        div.innerHTML = `
            <div class="item-image">
                <img src="img/products/${item.image}" alt="${item.name}">
            </div>
            <div class="item-name">${item.name}</div>
            <div class="item-quantity">x${item.quantity}</div>
            <div class="item-price not-important-price">$${item.price * item.quantity}</div>
        `;
        // Chèn vào trước phần shipping/tổng
        const totalEl = container.querySelector(".summary-shipping");
        container.insertBefore(div, totalEl);
    });
};

// Render tổng kết đơn hàng (subtotal, tax, shipping, discount, total)
const renderCheckoutSummary = () => {
    if (!orderSummary) return; // Nếu không lấy được orderSummary từ localstorage thì return

    document.querySelector(".summary-subtotal .subtotal-value").textContent = `$${orderSummary.subtotal}`;
    document.querySelector(".summary-tax .tax-value").textContent = `$${orderSummary.tax}`;
    document.querySelector(".summary-shipping-handling .shipping-handling-value").textContent = `$${orderSummary.shipping}`;
    document.querySelector(".summary-discount .discount-value").textContent = `-$${orderSummary.discount}`;
    document.querySelector(".summary-total .total-value").textContent = `$${orderSummary.total}`;
};

// Thêm xử lý sự kiện vào các nút radio chọn payment method
const AddEventToRadioPayment = () => {
    // Lấy tất cả các input có name="paymentMethod"
    const paymentInputs = document.querySelectorAll('input[name="paymentMethod"]');

    // Gắn sự kiện change cho từng radio
    paymentInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const selectedMethod = e.target.value; // lấy giá trị (cod, creditCard, applePay)
            localStorage.setItem('paymentMethod', selectedMethod); // lưu vào localStorage
        });
    });

    // (Tùy chọn) — Khi load trang, nếu có giá trị cũ trong localStorage thì tự set checked
    const savedMethod = localStorage.getItem('paymentMethod');
    if (savedMethod) {
        const savedInput = document.querySelector(`input[name="paymentMethod"][value="${savedMethod}"]`);
        if (savedInput) savedInput.checked = true;
    }
}

//Xử lý sự kiện nút checkout
const handleCheckOut = () => {
    // Hàm tạo đơn hàng sau khi checkout
    const addresses = JSON.parse(localStorage.getItem("checkout_addresses")) || [];
    const paymentMethod = localStorage.getItem("paymentMethod") || "cod"; // lấy phương thức thanh toán từ localstorage

    // Kiểm tra nếu cart trong localstorage rỗng thì ko cho checkout
    if (cart.length === 0) {
        alert("Cart is empty, cannot checkout!");
        return;
    }

    // Lấy địa chỉ đang chọn bằng cách tìm ra phần tử trong mảng addresses
    // đã được lấy ở trên có thuộc tính selected là true, nếu ko có cái nào selected true thì lấy cái đầu
    const selectedAddress = addresses.find(addr => addr.selected) || addresses[0];

    // Tạo order object
    const order = {
        id: "ORD-" + Date.now(),  // ID duy nhất dựa trên timestamp
        date: new Date().toLocaleString(), // Hàm lấy ra String thời gian hiện tại
        items: cart, // cart lấy từ localstorage
        summary: summary, // summary lấy từ localstorage
        customer: selectedAddress, // Lấy từ localstorage
        paymentMethod: paymentMethod, // Lấy từ localstorage
        status: "Confirmed" // Cố định
    };

    // Lấy orderHistory cũ (orderHistory là mảng gồm các hóa đơn cũ) rồi add hóa đơn mới nhất vừa tạo vào
    let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    orderHistory.push(order);

    // Lưu lại mảng orderHistory mới
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

    // Xóa cart sau khi checkout
    localStorage.removeItem("cart");

    alert("Checkout successful! 🎉 Order saved."); // thông báo
    window.location.href = "invoice.html"; // Chuyển sang trang in hóa đơn
}


// Khởi tạo khi load trang
document.addEventListener("DOMContentLoaded", () => {
    renderCheckoutItems();
    renderCheckoutSummary();
    AddEventToRadioPayment();

    //từ file address.js
    renderAddresses();
    addressInputFunction();
});
