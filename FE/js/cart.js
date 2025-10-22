
// ===== Global =====
let selectedVoucher = null; // Biến lưu voucher đang chọn

// Hàm lấy giỏ hàng từ localStorage
const getCart = () => {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Hàm lưu giỏ hàng vào localStorage
const saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Hàm render giỏ hàng
const renderCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || []; // Lấy giỏ hàng từ localStorage hoặc mảng rỗng nếu không có
    const cartContainer = document.querySelector(".cart-items"); // Container HTML chứa các sản phẩm trong giỏ

    if (cart.length === 0) { // Nếu giỏ hàng rỗng thì render html giỏ hàng trống
        cartContainer.innerHTML = `<p>Your cart is empty!</p>`;
        document.querySelector(".cart-content").innerHTML = `
        <section class="empty-section flex-col">
          <p class="empty">Oops! Your cart is empty!</p>
          <button class="back-button" onclick="window.location.href='index.html'">Back to Home</button>
        </section>`;
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
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button> 
                    <input type="number" value="${item.quantity}" readonly>
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                    <div class="item-price">$${item.price * item.quantity}</div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">×</button>
                </div>
            </div>
        </div>
    `).join("");

    // Tính toán tổng
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); // Tổng tiền trước thuế, phí ship, giảm giá
    const tax = 50; // Thuế cố định
    const shipping = 29; // Phí ship cố định
    const discount = calcDiscount(subtotal, selectedVoucher); // Giảm giá dựa trên voucher đã chọn (Hàm này ở file voucher.js)
    const total = subtotal + tax + shipping - discount; // Tổng cuối cùng

    updateOrderSummary(subtotal, total, tax, shipping, discount); // Cập nhật phần tóm tắt đơn hàng bằng các giá trị đã tính toán
    updateCartDisplay(); // Cập nhật hiển thị badge giỏ hàng trong header
};

// Hàm cập nhật phần tóm tắt đơn hàng với các giá trị đã tính toán là tham số truyền vào
const updateOrderSummary = (subtotal, total, tax = 0, shipping = 0, discount = 0) => {
    document.querySelector(".summary-details").innerHTML = `
        <div class="summary-row"><span>Subtotal</span><span>$${subtotal}</span></div>
        <div class="summary-row"><span class="not-important-price">Estimated Tax</span><span class="not-important-price">$${tax}</span></div>
        <div class="summary-row"><span class="not-important-price">Estimated Shipping & Handling</span><span class="not-important-price">$${shipping}</span></div>
        <div class="summary-row"><span>Discount</span><span>-$${discount}</span></div>
        <div class="summary-total"><span>Total</span><span>$${total}</span></div>
    `;

    // Lưu vào localStorage
    saveSummary(subtotal, total, tax, shipping, discount);
};


// Hàm logic thay đổi số lượng sản phẩm trong giỏ đã được gán vào nút - và + trong hàm renderCart
const changeQuantity = (id, delta) => {
    let cart = getCart() // Lấy giỏ hàng từ localStorage hoặc mảng rỗng nếu không có
    const item = cart.find(p => p.id === id); // Tìm sản phẩm trong giỏ vừa lấy từ localstorage dựa trên id truyền từ tham số

    // Nếu tìm thấy sản phẩm thì thay đổi số lượng dựa trên biến delta truyền vào (delta = 1 hoặc -1)
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            return; // Nếu số lượng <= 0 thì không làm gì cả (không cho giảm nữa)
        }
    }

    saveCart(cart)// Cập nhật lại giỏ hàng trong localStorage
    renderCart(); // chay lại hàm renderCart để cập nhật giao diện
};

// Hàm logic xóa sản phẩm khỏi giỏ đã được gán vào nút × trong hàm renderCart
const removeFromCart = (id) => {
    let cart = getCart(); // Lấy giỏ hàng từ localStorage hoặc mảng rỗng nếu không có
    cart = cart.filter(item => item.id !== id); // Lọc bỏ sản phẩm có id trùng với id truyền vào tham số
    //Hàm filter sẽ trả về mảng mới gồm các phần tử thõa mản điều kiện trong hàm callback (item.id !== id) 
    // => giữ lại các phần tử có id khác với id truyền vào => xóa phần tử có id trùng với id truyền vào

    saveCart(cart); // Cập nhật lại giỏ hàng trong localStorage
    renderCart(); // chay lại hàm renderCart để cập nhật giao diện
};

// Hàm render các option voucher vào trong thẻ select
const renderVoucherOptions = () => {
    const selectEl = document.querySelector(".promo-select"); // Lấy thẻ select trong HTML
    if (!selectEl) return; // Nếu không tìm thấy thẻ select thì return hàm

    selectEl.innerHTML = `<option value="" selected disabled>Select promo code</option>`; // Khởi tạo thẻ select với option mặc định
    // ForEach để duyệt mảng và tạo option cho mỗi voucher
    // Thay vì viết một biến voucher đại diện thì dùng [name, value, type] để destructure trực tiếp mảng con thành các biến.
    // Viết dúng và đủ sẽ là
    // arrVoucher.forEach(voucher => {
    //     let name = voucher[0];
    //     let value = voucher[1];
    //     let type = voucher[2];
    //     ...
    // });
    // !!! mảng arrVoucher ở file voucher.js.
    arrVoucher.forEach(([name, value, type]) => {
        const label = type === 0 ? `${name} - ${value}% off` : `${name} - $${value} off`;
        // Nếu type = 0 thì hiển thị % ngược lại hiển thị $. VD type = 0, name = "NEW10", value = 10 thì label = "NEW10 - 10% off"
        const option = new Option(label, name);
        // Cú pháp tạo thẻ Option mới trong JS mà không cần createElement.
        selectEl.appendChild(option); // add option vào trong thẻ select.
    });

    // Thêm sự kiện onchange cho thẻ select để cập nhật lại giỏ hàng khi chọn voucher, tham số e là event object
    selectEl.addEventListener("change", (e) => {
        selectedVoucher = e.target.value; // Cập nhật biến global selectedVoucher bằng giá trị voucher được chọn (e.target.value)
        renderCart(); // Render lại giao diện
    });
};

// Lưu thông tin tóm tắt đơn hàng
const saveSummary = (subtotal, total, tax, shipping, discount) => {
    // Khởi tạo biến object
    const summary = {
        subtotal,
        tax,
        shipping,
        discount,
        total
    };
    localStorage.setItem("orderSummary", JSON.stringify(summary)); // Lưu vào localStorage với key là 'orderSummary'
};

// Hàm khởi tạo khi load trang
document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    renderVoucherOptions();
});
