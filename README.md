# 🚀 Hướng dẫn Deploy & Chỉnh sửa Website

## 📁 Cấu trúc thư mục
```
nht-profile/
├── index.html   ← Source code (không cần chỉnh)
├── config.js    ← FILE SETTING — chỉnh nội dung tại đây
└── README.md    ← File này
```

---

## ✏️ Cách chỉnh sửa nội dung

Mở file `config.js` bằng bất kỳ text editor nào (Notepad, VS Code...).

| Muốn đổi | Chỉnh mục |
|---|---|
| Tên, chức danh, bio | `profile.firstName / lastName / role / bio` |
| Câu triết lý | `profile.quote / quoteSub` |
| Facebook, LinkedIn | `links.facebook / linkedin` |
| SĐT, email, địa chỉ | `contact.phone / email / address` |
| Số liệu thành tựu | `stats[]` — đổi `number` và `label` |
| Dịch vụ / năng lực | `services[]` — đổi `icon / name / desc / tags` |
| Knowledge Graph nodes | `graph.nodes[]` — đổi `label / title / desc / tags / x / y / r` |
| Đường kết nối graph | `graph.edges[]` — thêm/xóa cặp `["id1","id2"]` |
| SEO / Tab tiêu đề | `meta.title / description` |

### Ví dụ: Thêm 1 dịch vụ mới
```js
services: [
  // ... các dịch vụ cũ ...
  {
    icon: "🎯",
    name: "Tên dịch vụ mới",
    desc: "Mô tả ngắn về dịch vụ này.",
    tags: ["Tag 1", "Tag 2", "Tag 3"],
  },
],
```

### Ví dụ: Thêm 1 node mới vào Knowledge Graph
```js
// Thêm vào graph.nodes[]
{
  id:"new1", label:"Tên\nNode", x:300, y:150, r:26, cat:"hoc",
  title:"Tiêu đề đầy đủ",
  desc:"Mô tả chi tiết hiện trong panel khi click.",
  tags:["Tag A","Tag B"]
},

// Thêm kết nối vào graph.edges[]
["hub","new1"],
["new1","lam1"],
```

**Giá trị `cat`:**
- `"hoc"` → màu vàng nhạt (Thực Học)
- `"lam"` → màu nâu ấm (Thực Làm)
- `"gt"`  → màu vàng đậm (Thực Giá Trị)
- `"hub"` → chỉ dùng cho node trung tâm

**Tọa độ x, y (viewBox 900×500):**
- x: 0 = trái, 900 = phải
- y: 0 = trên, 500 = dưới

---

## 🌐 Deploy lên Netlify (miễn phí)

### Cách 1: Kéo thả (nhanh nhất — 1 phút)
1. Vào [netlify.com](https://netlify.com) → Đăng ký / Đăng nhập
2. Chọn **"Add new site"** → **"Deploy manually"**
3. **Kéo thả toàn bộ thư mục `nht-profile`** vào ô drop zone
4. Netlify tự tạo URL dạng `https://random-name.netlify.app`
5. Vào **Site settings → Domain** để đổi tên thành `nguyenhoangtuan.netlify.app`

### Cách 2: Dùng Netlify CLI
```bash
npm install -g netlify-cli
cd nht-profile
netlify deploy --prod
```

### Cách 3: Kết nối GitHub (tự động update khi push code)
1. Upload thư mục lên GitHub repository
2. Netlify → **"Import from Git"** → chọn repo
3. Mỗi lần push code → Netlify tự deploy lại

---

## 🔗 Tích hợp Form liên hệ thật (nhận email khi có người điền)

### Dùng Netlify Forms (miễn phí, dễ nhất):
Mở `index.html`, tìm thẻ `<form id="contact-form"...>` và thêm `data-netlify="true"`:
```html
<form id="contact-form" data-netlify="true" name="contact" ...>
```
→ Netlify tự nhận form submissions, xem tại **Site dashboard → Forms**

### Dùng Formspree (nhận email trực tiếp):
1. Đăng ký tại [formspree.io](https://formspree.io)
2. Tạo form → lấy endpoint dạng `https://formspree.io/f/xxxxxxxx`
3. Trong `index.html`, thay hàm `handleSubmit`:
```js
async function handleSubmit(e) {
  e.preventDefault();
  const data = new FormData(e.target);
  await fetch('https://formspree.io/f/XXXXXXXX', {
    method:'POST', body: data,
    headers:{'Accept':'application/json'}
  });
  document.getElementById('contact-form').style.display='none';
  document.getElementById('form-success').style.display='block';
}
```

---

## 📸 Upload ảnh đại diện
Mở file `index.html` trên trình duyệt → nhấn khung ảnh → chọn ảnh từ máy → crop → xác nhận.

*(Tính năng này không hoạt động trong Claude artifact do sandbox, nhưng chạy bình thường khi mở file hoặc deploy lên web.)*
