let state = 0;
const toggleMenu = () => {
    if (state === 0) {
        document.querySelector(".mobile-menu").style = 'transform: translateX(0);'
        state = 1;
    }
    else {
        document.querySelector(".mobile-menu").style = 'transform: translateX(-100%);'
        state = 0;
    }
};