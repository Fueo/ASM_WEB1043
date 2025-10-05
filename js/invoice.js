// Thêm xử lý sự kiện cho nút showInvoice.
const addEventShowInvoice = () => {
    const viewInvoiceButton = document.querySelector('.view-button');
    const invoiceSuccessSection = document.querySelector('.invoice-success');
    const invoiceContentSection = document.querySelector('.invoice-content');

    if (viewInvoiceButton && invoiceSuccessSection && invoiceContentSection) { // Nếu query đc thì mới add sk
        viewInvoiceButton.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default action

            // Toggle visibility
            invoiceContentSection.style.display = 'block'; // Show invoice content
        });
    } else {
        console.error('One or more elements not found. Check your selectors.');
    }
}

// Hàm render giao diện hóa đơn
function renderInvoice() {
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || []; // Lấy ra mảng orderHistory trong local storage
    if (orderHistory.length === 0) return;

    const lastOrder = orderHistory[orderHistory.length - 1]; // Chỉ lấy hóa đơn mới nhất

    // Hiển thị Customer Info
    document.querySelector(".customer-info").innerHTML = `
        <h3>Customer Information</h3>
        <p>Name: ${lastOrder.customer.name || ""}</p>
        <p>Phone: ${lastOrder.customer.phone || ""}</p>
        <p>Address: ${lastOrder.customer.address || ""}</p>
    `;

    // Hiển thị Order Info
    document.querySelector(".order-info").innerHTML = `
        <h3>Order Information</h3>
        <p>Order Date: ${lastOrder.date}</p>
        <p>Payment Method: ${lastOrder.paymentMethod.toUpperCase()}</p>
        <p>Status: <span class="status-confirmed">${lastOrder.status}</span></p>
    `;

    // Hiển thị sản phẩm
    const tbody = document.querySelector(".invoice-table tbody");
    tbody.innerHTML = "";
    lastOrder.items.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price}</td>
                <td>$${item.price * item.quantity}</td>
            </tr>
        `;
    });

    // Thêm các dòng Subtotal / Tax / Shipping / Discount / Total
    tbody.innerHTML += `
        <tr><td colspan="3" class="right-align">Shipment</td><td>$${lastOrder.summary.shipping}</td></tr>
        <tr><td colspan="3" class="right-align">Subtotal</td><td>$${lastOrder.summary.subtotal}</td></tr>
        <tr><td colspan="3" class="right-align">Estimated Tax</td><td>$${lastOrder.summary.tax}</td></tr>
        <tr><td colspan="3" class="right-align">Discount</td><td>-$${lastOrder.summary.discount}</td></tr>
        <tr><td colspan="3" class="right-align total">Total</td>
            <td class="total" style="font-size:1.6rem; font-weight:600;">$${lastOrder.summary.total}</td>
        </tr>
    `;
}

// Gọi khi load trang
document.addEventListener('DOMContentLoaded', function () {
    addEventShowInvoice();
    renderInvoice();
});