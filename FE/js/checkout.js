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
const handleCheckOut = async () => {
    const addresses = JSON.parse(localStorage.getItem("checkout_addresses")) || [];
    const paymentMethod = localStorage.getItem("paymentMethod") || "cod";
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orderSummary = JSON.parse(localStorage.getItem("orderSummary")) || {};

    if (cart.length === 0) {
        alert("Cart is empty, cannot checkout!");
        return;
    }

    let selectedAddress = addresses.find(addr => addr.selected) || addresses[0];
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        selectedAddress.idAccount = user.id;
    }


    if (!selectedAddress) {
        alert("Please select a shipping address!");
        return;
    }

    const order = {
        id: "ORD-" + Date.now(),
        date: new Date().toLocaleString(),
        items: cart,
        summary: orderSummary,
        customer: selectedAddress,
        paymentMethod: paymentMethod,
        status: "Confirmed"
    };

    try {
        const response = await fetch("http://localhost:3000/api/save-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        });

        const result = await response.json();

        if (result.success) {
            // Nếu lưu thành công thì cập nhật lịch sử order local
            let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
            orderHistory.push(order);
            localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

            // Xóa giỏ hàng
            localStorage.removeItem("cart");

            window.location.href = "invoice.html";
        } else {
            alert("Failed to save order: " + result.message);
        }
    } catch (error) {
        console.error("Error when saving order:", error);
        alert("Server error! Cannot save order.");
    }
};



// Khởi tạo khi load trang
document.addEventListener("DOMContentLoaded", () => {
    renderCheckoutItems();
    renderCheckoutSummary();
    AddEventToRadioPayment();
});
