// ===== Global =====
let selectedVoucher = null; // Voucher đang chọn

// ===== Render giỏ hàng =====
const renderCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.querySelector(".cart-items");

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p>Your cart is empty!</p>`;
        document.querySelector(".cart-content").innerHTML = `
        <section class="empty-section flex-col">
          <p class="empty">Oops! Your cart is empty!</p>
          <button class="back-button" onclick="window.location.href='index.html'">Back to Home</button>
        </section>`;
        updateOrderSummary(0, 0, 0, 0, 0);
        return;
    }

    // Render sản phẩm trong giỏ
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="img/products/${item.image}" alt="${item.name}" class="item-image">
            <div class="item-detail flex">
                <div class="item-info">
                    <div class="item-title">${item.name}</div>
                    <div class="item-id">#${item.id}</div>
                </div>
                <div class="item-controls">
                    <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                    <input type="number" value="${item.quantity}" readonly>
                    <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                    <div class="item-price">$${item.price * item.quantity}</div>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">×</button>
                </div>
            </div>
        </div>
    `).join("");

    // Tính toán tổng
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = 50;
    const shipping = 29;
    const discount = calcDiscount(subtotal, selectedVoucher);
    const total = subtotal + tax + shipping - discount;

    updateOrderSummary(subtotal, total, tax, shipping, discount);
};

// ===== Update Order Summary =====
const updateOrderSummary = (subtotal, total, tax = 0, shipping = 0, discount = 0) => {
    document.querySelector(".summary-details").innerHTML = `
        <div class="summary-row"><span>Subtotal</span><span>$${subtotal}</span></div>
        <div class="summary-row"><span class="not-important-price">Estimated Tax</span><span class="not-important-price">$${tax}</span></div>
        <div class="summary-row"><span class="not-important-price">Estimated Shipping & Handling</span><span class="not-important-price">$${shipping}</span></div>
        <div class="summary-row"><span>Discount</span><span>-$${discount}</span></div>
        <div class="summary-total"><span>Total</span><span>$${total}</span></div>
    `;

    // ✅ Lưu vào localStorage
    saveSummary(subtotal, total, tax, shipping, discount);
};


// ===== Thay đổi số lượng =====
const changeQuantity = (id, delta) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(p => p.id === id);

    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(p => p.id !== id); // nếu số lượng <= 0 thì xoá luôn
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
};

// ===== Xoá sản phẩm =====
const removeFromCart = (id) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
};

// ===== Render voucher vào select =====
const renderVoucherOptions = () => {
    const selectEl = document.querySelector(".promo-select");
    if (!selectEl) return;

    selectEl.innerHTML = `<option value="" selected disabled>Select promo code</option>`;
    arrVoucher.forEach(([name, value, type]) => {
        const label = type === 0 ? `${name} - ${value}% off` : `${name} - $${value} off`;
        const option = new Option(label, name);
        selectEl.appendChild(option);
    });

    // Chọn voucher
    selectEl.addEventListener("change", (e) => {
        selectedVoucher = e.target.value;
        renderCart();
    });
};

// Lưu thông tin tóm tắt đơn hàng
const saveSummary = (subtotal, total, tax, shipping, discount) => {
    const summary = {
        subtotal,
        tax,
        shipping,
        discount,
        total
    };
    localStorage.setItem("orderSummary", JSON.stringify(summary));
};

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    renderVoucherOptions();
});
