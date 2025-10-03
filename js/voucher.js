// Danh sách voucher: [code, value, type]
// type: 0 = %, 1 = giảm trực tiếp
const arrVoucher = [
    ["NEW10", 10, 0],         // 10% off
    ["HOLIDAY20", 20, 0],     // 20% off
    ["APPLE15", 15, 0],       // 15% off
    ["SALE100", 100, 1],      // giảm trực tiếp 100
    ["SHIPFREE", 29, 1]       // giảm phí ship 29
];

// Hàm tính discount
const calcDiscount = (subtotal, code) => {
    if (!code) return 0;
    let voucher = arrVoucher.find(v => v[0] === code);
    if (!voucher) return 0;
    let [name, value, type] = voucher;
    return type === 0 ? Math.floor(subtotal * value / 100) : value;
};