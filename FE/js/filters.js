// File js để xử lý logic filter trong products.html
// Hàm để số xuống các filter item.
function toggleFilter(header) {
    const section = header.parentElement;
    section.classList.toggle('collapsed');
}

//Thêm xử lý logic cho nút filter để ẩn hiện phần filter trong phiên bản mobile
document.querySelector(".filter-btn").addEventListener("click", function () {
    const sidebar = document.querySelector(".products-sidebar");
    sidebar.style.display = sidebar.style.display === "block" ? "none" : "block";
}
)

//Khởi tạo tất cả filter item và item đầu tiên được số xuống
document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.sidebar-section');
    sections.forEach((section, index) => {
        if (index === 0) {
            section.classList.remove('collapsed');
        } else {
            section.classList.add('collapsed');
        }
    });
});