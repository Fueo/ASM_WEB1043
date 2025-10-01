function toggleFilter(header) {
    const section = header.parentElement;
    section.classList.toggle('collapsed');
}

// Initialize all sections as collapsed except the first one
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

document.querySelector(".filter-btn").addEventListener("click", function () {
    const sidebar = document.querySelector(".products-sidebar");
    sidebar.style.display = sidebar.style.display === "block" ? "none" : "block";
}
)