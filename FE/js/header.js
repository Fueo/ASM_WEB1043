let isShow = false; // Trạng thái hiển thị User menu

// 🔹 Kiểm tra user trong localStorage để xác định trạng thái đăng nhập
let isLoggedIn = !!localStorage.getItem('user');

// ========================
// ⚙️ Toggle menu user
// ========================
const toggleUserBlock = () => {
    document.querySelectorAll(".user_block").forEach(user_block => {
        user_block.classList.toggle("show");
    });

    // Đổi mũi tên hướng xuống/lên (nếu có)
    const arrow = document.querySelector(".arrow-account");
    if (arrow) arrow.innerHTML = isShow ? '&#129170;' : '&#129171;';

    // Cập nhật trạng thái hiển thị
    isShow = !isShow;

    // Cập nhật hiển thị login/logout
    checkLogin();
};

// ========================
// 👤 Kiểm tra trạng thái đăng nhập
// ========================
const checkLogin = () => {
    isLoggedIn = !!localStorage.getItem('user'); // cập nhật lại mỗi lần kiểm tra

    if (isLoggedIn) {
        // Nếu đã đăng nhập → ẩn phần chưa đăng nhập
        document.querySelectorAll(".not_logged_in").forEach(block => {
            block.style.display = 'none';
        });

        // Hiện phần đã đăng nhập
        document.querySelectorAll(".logged_in").forEach(block => {
            block.style.display = 'block';
        });
    } else {
        // Nếu chưa đăng nhập → ẩn phần đã đăng nhập
        document.querySelectorAll(".logged_in").forEach(block => {
            block.style.display = 'none';
        });

        // Hiện phần chưa đăng nhập
        document.querySelectorAll(".not_logged_in").forEach(block => {
            block.style.display = 'block';
        });
    }
};

// ========================
// 🛒 Cập nhật badge giỏ hàng
// ========================
const updateCartDisplay = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.length;

    document.querySelectorAll(".badge").forEach(badge => {
        if (cartCount === 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'flex';
            badge.innerHTML = cartCount;
        }
    });
};

// ========================
// 📱 Menu Mobile Toggle
// ========================
const toggleMenu = () => {
    document.querySelector(".mobile-menu")?.classList.toggle("menu-active");
};

// ========================
// 🚀 Khi tải trang
// ========================
document.addEventListener("DOMContentLoaded", () => {
    checkLogin();
    updateCartDisplay();
});

const logout = () => {
    localStorage.removeItem('user');
    alert('👋 Bạn đã đăng xuất.');
    checkLogin(); // Cập nhật lại giao diện
    window.location.href = 'index.html'; // Quay về trang chủ
};


// ========================
// 🔄 Lắng nghe thay đổi giỏ hàng từ tab khác
// ========================
window.addEventListener('storage', (event) => {
    if (event.key === 'cart') {
        updateCartDisplay();
    }
    if (event.key === 'user') {
        checkLogin(); // Nếu user thay đổi (đăng nhập / đăng xuất)
    }
});
