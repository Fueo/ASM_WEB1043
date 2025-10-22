//File js xử lý giao diện slide trong index.html ở giao diện Mobile
const popularProducts = [
    [
        "img/products/popular1.png", // image
        "Popular Products",          // title
        "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.", // desc
    ],
    [
        "img/products/popular2.png",
        "Ipad Pro",
        "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.",
    ],
    [
        "img/products/popular3.png",
        "Samsung Galaxy",
        "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.",
    ],
    [
        "img/products/popular4.png",
        "Macbook Pro",
        "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.",
    ]
];

let currentIndex = 0;

const changeContext = (index) => {
    const container = document.querySelector(".popular-card-mobile");

    container.innerHTML = popularProducts.map((item, indexLoop) => {
        if (indexLoop == index)
            return `
            <div class="image">
            <img src="${item[0]}" alt="${item[1]}">
            </div>
            <div class="popular-info flex-col">
            <h3>${item[1]}</h3>
            <p>${item[2]}</p>
            <button class="btn btn-black btn-banner">Shop now</button>
            </div>
        `
    }).join("");
    updateDots(currentIndex);

    currentIndex = index;
}

const check = (action) => {
    switch (action) {
        case "next": {
            currentIndex++;
            console.log(currentIndex);
            if (currentIndex >= popularProducts.length) currentIndex = 0;
            changeContext(currentIndex);
            break;
        }
        case "previous": {
            currentIndex--;
            console.log(currentIndex);

            if (currentIndex < 0) currentIndex = popularProducts.length - 1;
            changeContext(currentIndex);
            break;
        }
    }
}

function updateDots(currentIndex) {
    const dots = document.querySelectorAll(".dot");

    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
}