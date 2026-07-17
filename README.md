# FURIEUX PARFUM — website demo

## Chạy thử ở máy tính
1. Cài Node.js (>=18) nếu chưa có: https://nodejs.org
2. Mở terminal tại thư mục này, chạy:
   npm install
   npm run dev
3. Mở link hiện ra (thường là http://localhost:5173)

## Đưa web lên internet (có link thật)
1. Tạo repo trên GitHub, đẩy toàn bộ thư mục này lên.
2. Vào vercel.com -> đăng nhập bằng GitHub -> "Add New Project" -> chọn repo vừa tạo.
3. Vercel tự nhận đây là project Vite, chỉ cần bấm Deploy.
4. Sau khi deploy xong, Vercel cho 1 link dạng: furieux-parfum.vercel.app
5. Muốn dùng tên miền riêng (vd: furieux.vn): mua tên miền, vào Vercel > Project > Settings > Domains, làm theo hướng dẫn trỏ DNS.

## Lưu ý
Bản này là frontend demo: giỏ hàng, đặt hàng chỉ chạy trên trình duyệt, chưa lưu đơn hàng thật, chưa có thanh toán thật.
Muốn bán hàng thật cần thêm:
- Backend lưu đơn hàng (gợi ý: Supabase - dễ setup, có gói miễn phí)
- Cổng thanh toán VNPay / MoMo / ZaloPay hoặc giữ COD/chuyển khoản thủ công
