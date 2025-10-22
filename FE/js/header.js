let isShow = false; // Biến trạng thái hiển thị của User.
let isLoggedIn = false; // Biến trạng thái đăng nhập của User.

const toggleUserBlock = () => {
    //Vì có nhiều thẻ user_block (ở cả header PC và trong Mobile Menu) nên dùng querySelectorAll.
    document.querySelectorAll(".user_block").forEach(user_block => {
        user_block.classList.toggle("show");
        //Đổi mũi tên
        document.querySelector(".arrow-account").innerHTML = isShow ? '&#129170;' : '&#129171;';
    })

    //Set lại biến trạng thái
    isShow = !isShow;

    //Chạy hàm kiểm tra đăng nhập ở dưới
    checkLogin();
};

const checkLogin = () => {
    if (isLoggedIn) {
        //Nếu đã đăng nhập thì ẩn các thẻ dành cho người chưa đăng nhập đi
        document.querySelectorAll(".not_logged_in").forEach(block => {
            block.style = 'display:none'
        });
    }
    else {
        //Ngược lại, ẩn các thẻ dành cho người đã đăng nhập đi
        document.querySelectorAll(".logged_in").forEach(block => {
            block.style = 'display:none'
        });
    }
}

//Hàm cập nhật hiển thị badge giỏ hàng
const updateCartDisplay = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.length;

    document.querySelectorAll(".badge").forEach(badge => {
        if (cartCount === 0) {
            //Nếu giỏ hàng trong localStorage rỗng thì ẩn badge đi
            badge.style.display = 'none';
        } else {
            //Ngược lại hiển thị badge và set innerHtml của badge = length của mảng cart trong localstorage
            badge.style.display = 'flex';
            badge.innerHTML = cartCount;
        }
    });
};

//Hàm logic xử lý khi click vào icon menu trên mobile
const toggleMenu = () => {
    document.querySelector(".mobile-menu")
        .classList.toggle("menu-active");
};

// Gọi hàm kiểm tra đăng nhập khi trang web được tải
document.addEventListener("DOMContentLoaded", () => {
    checkLogin();
    updateCartDisplay();
});

// Ham này sẽ lắng nghe sự kiện thay đổi của 'localstorage' và nếu key thay đổi là 'cart' 
// thì cập nhật hiển thị giỏ hàng khi có thay đổi (áp dụng cho tất cả mọi trang html).
window.addEventListener('storage', function (event) {
    if (event.key === 'cart') {
        updateCartDisplay();
    }
});