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
    if (!code) return 0; // Nếu không có code thì return hàm
    let voucher = arrVoucher.find(v => v[0] === code); // Tìm voucher trong mảng dựa trên code
    if (!voucher) return 0; // Nếu không tìm thấy voucher thì return hàm
    let [name, value, type] = voucher;
    // !!!Destructure mảng voucher thành các biến, nếu viết đủ và đúng thì sẽ là
    // let name = voucher[0]; let value = voucher[1]; let type = voucher[2];
    return type === 0 ? Math.floor(subtotal * value / 100) : value;
    // Tính giảm giá dựa trên type
    // nếu type = 0 thì giảm theo % và làm tròn xuống VD 10% của 199 = 19.9 thì giảm 19
    // nếu type = 1 thì giảm trực tiếp cố định
};