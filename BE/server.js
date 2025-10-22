const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// ==============================
// ⚙️ Middleware
// ==============================
app.use(cors());
app.use(express.json());

// ==============================
// 📂 Đường dẫn file JSON
// ==============================
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const ACCOUNTS_FILE = path.join(__dirname, 'accounts.json');
const HOME_PRODUCTS_FILE = path.join(__dirname, 'home.json');
const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const CATEGORY_FILE = path.join(__dirname, 'categories.json');

// ==============================
// 📘 Hàm đọc/ghi file
// ==============================
const readJSON = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeJSON = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// ==============================
// 🧾 API: Lưu đơn hàng
// ==============================
app.post('/api/save-order', (req, res) => {
    const newOrder = req.body;

    if (!newOrder || !newOrder.items) {
        return res.status(400).json({ success: false, message: 'Dữ liệu đơn hàng không hợp lệ.' });
    }

    try {
        const orders = readJSON(ORDERS_FILE);
        orders.push(newOrder);
        writeJSON(ORDERS_FILE, orders);

        res.json({ success: true, message: 'Đơn hàng đã được lưu thành công vào orders.json' });
    } catch (error) {
        console.error('❌ Lỗi khi lưu đơn hàng:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lưu dữ liệu.' });
    }
});

// ==============================
// 📜 API: Lịch sử đơn hàng
// ==============================
app.get('/api/orders-history', (req, res) => {
    try {
        const orders = readJSON(ORDERS_FILE);
        res.json({ success: true, orders });
    } catch (error) {
        console.error('❌ Lỗi khi đọc lịch sử đơn hàng:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy dữ liệu.' });
    }
});

// ==============================
// 👥 API: Danh sách tài khoản
// ==============================
app.get('/api/account', (req, res) => {
    try {
        const accounts = readJSON(ACCOUNTS_FILE);
        res.json(accounts);
    } catch (error) {
        console.error('❌ Lỗi khi đọc danh sách tài khoản:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy dữ liệu.' });
    }
});

// ==============================
// 🆕 API: Thêm tài khoản mới
// ==============================
app.post('/api/add-account', (req, res) => {
    const newAccount = req.body;

    if (!newAccount || !newAccount.email || !newAccount.password || !newAccount.role) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin tài khoản.' });
    }

    try {
        const accounts = readJSON(ACCOUNTS_FILE);

        // Kiểm tra trùng email
        const exists = accounts.some(acc => acc.email === newAccount.email);
        if (exists) {
            return res.status(409).json({ success: false, message: 'Email đã tồn tại.' });
        }

        // Tạo ID mới tự tăng
        const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
        newAccount.id = newId;

        accounts.push(newAccount);
        writeJSON(ACCOUNTS_FILE, accounts);

        res.json({ success: true, message: 'Tài khoản đã được thêm thành công.', data: newAccount });
    } catch (error) {
        console.error('❌ Lỗi khi thêm tài khoản:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lưu tài khoản.' });
    }
});

// ==============================
// 🔐 API: Đăng nhập tài khoản
// ==============================
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu.' });
    }

    try {
        const accounts = readJSON(ACCOUNTS_FILE);
        const user = accounts.find(acc => acc.email === email && acc.password === password);

        if (!user) {
            return res.status(401).json({ success: false, message: 'Sai email hoặc mật khẩu.' });
        }

        res.json({
            success: true,
            message: 'Đăng nhập thành công.',
            user: { id: user.id, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('❌ Lỗi khi đăng nhập:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi đăng nhập.' });
    }
});

// ==============================
// 🏠 API: Trang chủ, sản phẩm, danh mục
// ==============================
app.get('/api/index', (req, res) => {
    try {
        const data = readJSON(HOME_PRODUCTS_FILE);
        res.json(data);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Không thể tải dữ liệu sản phẩm.' });
    }
});

app.get('/api/product', (req, res) => {
    try {
        const data = readJSON(PRODUCTS_FILE);
        res.json(data);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Không thể tải dữ liệu sản phẩm.' });
    }
});

app.get('/api/category', (req, res) => {
    try {
        const data = readJSON(CATEGORY_FILE);
        res.json(data);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Không thể tải dữ liệu sản phẩm.' });
    }
});

// ==============================
// 🚀 Khởi động server
// ==============================
app.listen(PORT, () => {
    console.log(`✅ Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`🔗 API danh sách sản phẩm: http://localhost:${PORT}/api/product`);
    console.log(`🔗 API danh mục: http://localhost:${PORT}/api/category`);
    console.log(`🔗 API trang chủ: http://localhost:${PORT}/api/index`);
    console.log(`🔗 API lưu đơn hàng: http://localhost:${PORT}/api/save-order`);
    console.log(`🔗 API lịch sử đơn hàng: http://localhost:${PORT}/api/orders-history`);
    console.log(`🔗 API tài khoản: http://localhost:${PORT}/api/account`);
    console.log(`🔗 API thêm tài khoản: http://localhost:${PORT}/api/add-account`);
    console.log(`🔗 API đăng nhập: http://localhost:${PORT}/api/login`);
});
