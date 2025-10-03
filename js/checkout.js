
// Lấy dữ liệu từ localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const orderSummary = JSON.parse(localStorage.getItem("orderSummary")) || null;

// Render danh sách sản phẩm trong checkout summary
const renderCheckoutItems = () => {
    const container = document.querySelector(".order-summary");
    if (!container) return;

    // Xóa các item mẫu cứng trong HTML
    const oldItems = container.querySelectorAll(".summary-item");
    oldItems.forEach(item => item.remove());

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
    if (!orderSummary) return;

    document.querySelector(".summary-subtotal .subtotal-value").textContent = `$${orderSummary.subtotal}`;
    document.querySelector(".summary-tax .tax-value").textContent = `$${orderSummary.tax}`;
    document.querySelector(".summary-shipping-handling .shipping-handling-value").textContent = `$${orderSummary.shipping}`;
    document.querySelector(".summary-discount .discount-value").textContent = `-$${orderSummary.discount}`;
    document.querySelector(".summary-total .total-value").textContent = `$${orderSummary.total}`;
};

const handleCheckOut = () => {
    // Hàm tạo đơn hàng sau khi checkout
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const summary = JSON.parse(localStorage.getItem("orderSummary")) || {};
    const addresses = JSON.parse(localStorage.getItem("checkout_addresses")) || [];
    const paymentMethod = localStorage.getItem("paymentMethod") || "cod";

    if (cart.length === 0) {
        alert("Cart is empty, cannot checkout!");
        return;
    }

    // Lấy địa chỉ đang chọn
    const selectedAddress = addresses.find(addr => addr.selected) || addresses[0];

    // Tạo order object
    const order = {
        id: "ORD-" + Date.now(),  // ID duy nhất dựa trên timestamp
        date: new Date().toLocaleString(),
        items: cart,
        summary: summary,
        customer: selectedAddress,
        paymentMethod: paymentMethod,
        status: "Confirmed"
    };

    // Lấy orderHistory cũ
    let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    orderHistory.push(order);

    // Lưu lại
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

    // Xóa cart sau khi checkout
    localStorage.removeItem("cart");

    alert("Checkout successful! 🎉 Order saved.");
    window.location.href = "invoice.html"; // Chuyển sang trang in hóa đơn

    window.location.href = 'involce.html';
}


// Khởi tạo khi load trang
document.addEventListener("DOMContentLoaded", () => {
    renderCheckoutItems();
    renderCheckoutSummary();

    //từ file address.js
    renderAddresses();
    addressInputFunction();
});
