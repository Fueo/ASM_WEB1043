const productsData = [
    {
        img: "iphone1.png",
        title: "Apple iPhone 14 Pro 512GB Gold (MQ233)",
        price: 1437,
    },
    {
        img: "iphone2.png",
        title: "Apple iPhone 11 128GB White (MQ223)",
        price: 510,
    },
    {
        img: "iphone3.png",
        title: "Apple iPhone 11 128GB White (MQ223)",
        price: 550,
    },
    {
        img: "airpod.png",
        title: "AirPods Max Silver Starlight Aluminium",
        price: 549,
    },
    {
        img: "watch.png",
        title: "Samsung Galaxy Watch6 Classic 47mm Black",
        price: 369,
    },
    {
        img: "galaxyz.png",
        title: "Galaxy Z Fold5 Unlocked | 256GB | Phantom Black",
        price: 1799,
    },
    {
        img: "iphone5.png",
        title: "Apple IPhone 13 Mini 128GB Blue (MLL73)",
        price: 599,
    },
    {
        img: "ipad.png",
        title: 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021',
        price: 398,
    },
    {
        img: "ipad.png",
        title: 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021',
        price: 398,
    },
    {
        img: "ipad.png",
        title: 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021',
        price: 398,
    },
    {
        img: "ipad.png",
        title: 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021',
        price: 398,
    },
    {
        img: "ipad.png",
        title: 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021',
        price: 398,
    },
    {
        img: "ipad.png",
        title: 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021',
        price: 398,
    },
    {
        img: "ipad.png",
        title: 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021',
        price: 398,
    },
    {
        img: "ipad.png",
        title: 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021',
        price: 398,
    },
    {
        img: "ipad.png",
        title: 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021',
        price: 398,
    },
    {
        img: "ipad.png",
        title: 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021',
        price: 398,
    },
    {
        img: "ipad.png",
        title: 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021',
        price: 398,
    },
    {
        img: "ipad.png",
        title: 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021',
        price: 398,
    },
];

// Pagination settings
const ITEMS_PER_PAGE = 6;
let currentPage = 1;

const renderPagination = (totalItems) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const paginationContainer = document.querySelector('.pagination');

    let paginationHTML = `
        <button class="page-btn" onclick="changePage('prev')">&lt;</button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button class="page-btn ${i === currentPage ? 'active' : ''}" 
                        onclick="changePage(${i})">${i}</button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span class="page-ellipsis">...</span>`;
        }
    }

    paginationHTML += `
        <button class="page-btn" onclick="changePage('next')">&gt;</button>
    `;

    paginationContainer.innerHTML = paginationHTML;
};

const changePage = (page) => {
    const totalPages = Math.ceil(productsData.length / ITEMS_PER_PAGE);

    if (page === 'prev') {
        currentPage = Math.max(1, currentPage - 1);
    } else if (page === 'next') {
        currentPage = Math.min(totalPages, currentPage + 1);
    } else {
        currentPage = page;
    }

    renderProducts();
};

const renderProducts = () => {
    const productGrid = document.querySelector('.products-grid');

    // Calculate pagination indices
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProducts = productsData.slice(startIndex, endIndex);

    const productsHTML = paginatedProducts.map(product => {
        return `
            <div class="product-card">
                <button class="fav-btn">
                    <img src="img/cart-icon.png" 
                         alt="Cart">
                </button>
                <div class="image">
                    <img src="img/products/${product.img}" 
                         alt="${product.title}">
                </div>
                <div class="product-title">${product.title}</div>
                <div class="product-price">$${product.price}</div>
                <button class="btn btn-fill-black btn-buy">Buy Now</button>
            </div>
        `;
    }).join('');

    productGrid.innerHTML = productsHTML;
    renderPagination(productsData.length);

    // Update selected products count
    document.querySelector('.selected-count b').textContent = productsData.length;
};

// Initialize products when DOM is loaded
document.addEventListener('DOMContentLoaded', renderProducts);
