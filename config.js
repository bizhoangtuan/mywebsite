/**
 * ============================================================
 *  CONFIG.JS — FILE CẤU HÌNH WEBSITE CÁ NHÂN
 *  Chỉnh sửa file này để cập nhật toàn bộ nội dung website.
 *  KHÔNG cần chạm vào index.html.
 * ============================================================
 */

const CONFIG = {

  /* ──────────────────────────────────────────
   * 1. THÔNG TIN CÁ NHÂN
   * ────────────────────────────────────────── */
  profile: {
    firstName:  "Nguyễn",          // Dòng 1 tên lớn
    lastName:   "Hoàng Tuấn",      // Dòng 2 tên lớn (màu vàng)
    role:       "Business Development Manager",
    company:    "OneAds Digital",
    eyebrow:    "BDM · ONEADS DIGITAL",  // Nhãn nhỏ phía trên tên

    bio: "Mình đồng hành cùng anh/chị chủ doanh nghiệp thiết lập hệ thống quản trị bài bản, chuyển đổi số và tăng trưởng từ gốc rễ. Điểm giao thoa giữa <strong>Công nghệ</strong> – <strong>Vận hành</strong> – <strong>Marketing</strong>.",

    // 3 giá trị cốt lõi hiển thị dạng pill
    pillars: ["Thực Học", "Thực Làm", "Thực Giá Trị"],

    // Câu triết lý / quote
    quote: "Một hệ thống kinh doanh xuất sắc là hệ thống có thể tự vận hành trơn tru ngay cả khi không có người tạo ra nó ở đó.",
    quoteSub: "Mục tiêu lớn nhất khi đồng hành cùng đối tác không chỉ là setup một công cụ, mà là chuyển giao một <strong>Tư duy Vận hành</strong> — để đội ngũ hoàn toàn làm chủ công nghệ, giải phóng lãnh đạo khỏi sự vụ để tập trung vào tầm nhìn.",
  },

  /* ──────────────────────────────────────────
   * 2. LINKS & LIÊN HỆ
   * ────────────────────────────────────────── */
  links: {
    facebook:   "https://www.facebook.com/biz.nguyenhoangtuan/",
    linkedin:   "https://www.linkedin.com/in/biz-tuannguyenhoang/",
    website:    "https://oneads.vn",
    fullProfile:"https://oneads.vn/blogs/ho-so-chuyen-gia/nguyen-hoang-tuan",
  },

  contact: {
    phone:    "08.9992.3959",
    phoneHref:"tel:0899923959",
    email:    "info@oneads.vn",
    address:  "31 Đ.C18, Phường Bảy Hiền, TP.HCM",
    website:  "oneads.vn",
    websiteHref: "https://oneads.vn",
  },

  /* ──────────────────────────────────────────
   * 3. SỐ LIỆU THÀNH TỰU (STATS)
   * ────────────────────────────────────────── */
  stats: [
    { number: "350+",  label: "Doanh nghiệp triển khai Haravan" },
    { number: "50+",   label: "Hệ thống Lark đã setup" },
    { number: "1000+", label: "Khách hàng OneAds Digital" },
    { number: "200+",  label: "Ngành hàng đã triển khai" },
  ],

  /* ──────────────────────────────────────────
   * 4. DỊCH VỤ / NĂNG LỰC
   *    icon: emoji hoặc để trống ""
   *    tags: mảng nhãn nhỏ
   * ────────────────────────────────────────── */
  services: [
    {
      icon: "🛒",
      name: "Hệ sinh thái TMĐT & Omnichannel",
      desc: "Quy hoạch toàn bộ điểm chạm bán hàng về một Core System (Haravan). Đồng bộ kho, đơn hàng, CRM đa kênh từ Website → Sàn → Social Commerce.",
      tags: ["Haravan", "Shopee", "TikTok Shop", "Zalo OA", "POS"],
    },
    {
      icon: "⚙️",
      name: "Chuẩn hóa Vận hành Nội bộ",
      desc: "Phá bỏ silo dữ liệu, kết nối mọi tác vụ trên Lark. Workflow Automation, CRM B2B, OKR, SOP – giúp đội ngũ tự vận hành.",
      tags: ["Lark Suite", "N8n / Make", "OKR", "SOP", "Anycross"],
    },
    {
      icon: "📈",
      name: "Performance Marketing & Ads",
      desc: "Tối ưu chuyển đổi đo lường được. Google Ads, Meta Ads, TikTok Ads, Shopee Internal & CPAS. Tracking chuẩn, ROI minh bạch.",
      tags: ["Google Ads", "Meta Ads", "TikTok Ads", "CPAS", "GA4"],
    },
    {
      icon: "🤖",
      name: "AI & Tự động hóa",
      desc: "Nhúng AI Agent vào quy trình vận hành thực tế. Tự động hóa Content Marketing, báo cáo GA4/GSC, trích xuất dữ liệu.",
      tags: ["AI Agent", "Workflow", "SEO AIO", "Auto Report"],
    },
  ],

  /* ──────────────────────────────────────────
   * 5. KNOWLEDGE GRAPH
   *    cat: 'hub' | 'hoc' | 'lam' | 'gt'
   *    x, y: tọa độ (viewBox 900×500)
   *         x tăng → sang phải | y tăng → xuống dưới
   *    r: bán kính node (số lớn = node to hơn)
   * ────────────────────────────────────────── */
  graph: {
    nodes: [
      {
        id:"hub", label:"NHT\nHub", x:450, y:248, r:50, cat:"hub",
        title:"Nguyễn Hoàng Tuấn – BDM OneAds Digital",
        desc:"Business Development Manager tại OneAds Digital. 350+ doanh nghiệp triển khai Haravan, 50+ hệ thống Lark. Điểm giao thoa: Công nghệ – Vận hành – Marketing.",
        tags:["BDM","Generalist","System Thinker","Growth Hacker"]
      },
      // ── THỰC HỌC ──
      {
        id:"hoc1", label:"Growth\nStrategy", x:140, y:90, r:32, cat:"hoc",
        title:"Tư duy Tăng trưởng Tích hợp",
        desc:"Giao thoa chiến lược giữa Marketing – Bán hàng – Vận hành. Thiết kế Customer Journey, Tracking & Re-marketing, nội dung theo Pains & Gains.",
        tags:["Customer Journey","Re-marketing","Integrated Growth"]
      },
      {
        id:"hoc2", label:"AI &\nAutomation", x:255, y:48, r:27, cat:"hoc",
        title:"AI & Micro-Task Automation",
        desc:"Ứng dụng AI vào thực tiễn: Workflow Automation, AI Agent Integration, tự động hóa Content Marketing, báo cáo GA4/GSC.",
        tags:["AI Agent","Make","N8n","Anycross"]
      },
      {
        id:"hoc3", label:"Data-\nDriven", x:96, y:228, r:25, cat:"hoc",
        title:"Tư duy Data-Driven",
        desc:"Số hóa báo cáo doanh thu, tồn kho và hiệu suất nhân viên theo thời gian thực. Ra quyết định từ dữ liệu.",
        tags:["GA4","GSC","Real-time Reporting"]
      },
      {
        id:"hoc4", label:"Customer\nJourney", x:168, y:388, r:25, cat:"hoc",
        title:"Customer Journey Mapping",
        desc:"Thấu hiểu hành trình khách hàng để thiết kế touchpoints tối ưu – từ nhận diện đến hậu mãi.",
        tags:["Touchpoints","CLV","Retention"]
      },
      // ── THỰC LÀM ──
      {
        id:"lam1", label:"Haravan\nOmnichannel", x:688, y:82, r:36, cat:"lam",
        title:"Hệ sinh thái TMĐT & Omnichannel",
        desc:"Triển khai 350+ doanh nghiệp trên Haravan. Bán đa kênh: Website, Facebook, TikTok, Zalo OA, Shopee, Lazada, POS.",
        tags:["Haravan","Shopee","TikTok Shop","TOP 1 Partner"]
      },
      {
        id:"lam2", label:"Lark\nWorkspace", x:750, y:228, r:32, cat:"lam",
        title:"Chuẩn hóa Vận hành (Larksuite)",
        desc:"Triển khai 50+ hệ thống Lark. Cấu trúc tập trung, Workflow Automation, CRM B2B, SOP.",
        tags:["Lark","OKR","BSC","SOP","CRM B2B"]
      },
      {
        id:"lam3", label:"Performance\nMarketing", x:688, y:390, r:30, cat:"lam",
        title:"Performance Marketing",
        desc:"Google Ads, Meta Ads, TikTok Ads, Shopee Internal, CPAS. Tối ưu chuyển đổi đo lường được.",
        tags:["Google Ads","Meta Ads","TikTok Ads","CPAS"]
      },
      {
        id:"lam4", label:"Content\n& Brand", x:556, y:446, r:26, cat:"lam",
        title:"Content & Brand Strategy",
        desc:"SEO AIO, IMC Plan Marketing, Media Content Daily, Media Video Short. Định vị thương hiệu bền vững.",
        tags:["SEO AIO","IMC","Media Content","Branding"]
      },
      // ── THỰC GIÁ TRỊ ──
      {
        id:"gt1", label:"Hệ thống\nTự vận hành", x:352, y:432, r:32, cat:"gt",
        title:"Hệ thống Tự vận hành",
        desc:"Chuyển giao Tư duy Vận hành, không chỉ setup công cụ. Hệ thống tự hoạt động khi không có người tạo ra nó.",
        tags:["SOPs","Automation","Self-Operating System"]
      },
      {
        id:"gt2", label:"350+\nDoanh nghiệp", x:218, y:450, r:28, cat:"gt",
        title:"Tác động thực tế",
        desc:"350+ doanh nghiệp Haravan, 50+ hệ thống Lark. Mọi kiến thức đều kiểm chứng thực tiễn.",
        tags:["350+ Haravan","50+ Lark","Proven Results"]
      },
      {
        id:"gt3", label:"Training\n& Academy", x:396, y:52, r:26, cat:"gt",
        title:"Đào tạo & Chuyển giao",
        desc:"OneAds Academy: Đào tạo Quản trị, Lark, Haravan, Performance Marketing, Vận hành Sàn, Content, Branding.",
        tags:["Academy","Coaching","Knowledge Transfer"]
      },
      {
        id:"gt4", label:"SME\nPartner", x:498, y:432, r:26, cat:"gt",
        title:"Đối tác chiến lược SME",
        desc:"Cầu nối giúp SME tháo gỡ nút thắt: tìm kiếm khách hàng, ứng dụng công nghệ, bứt phá doanh thu.",
        tags:["SME","B2B Advisory","Strategic Partner"]
      },
    ],

    // Các cặp kết nối [id_nguồn, id_đích]
    // Thêm hoặc xóa cặp để thay đổi đường nối
    edges: [
      ["hub","hoc1"],["hub","hoc2"],["hub","hoc3"],["hub","hoc4"],
      ["hub","lam1"],["hub","lam2"],["hub","lam3"],["hub","lam4"],
      ["hub","gt1"], ["hub","gt2"], ["hub","gt3"], ["hub","gt4"],
      ["hoc1","lam1"],["hoc1","lam3"],
      ["hoc2","lam2"],["hoc2","lam3"],
      ["hoc3","lam1"],["hoc3","lam2"],
      ["hoc4","lam4"],
      ["lam1","gt2"],["lam2","gt1"],["lam2","gt2"],
      ["lam3","gt4"],["lam4","gt3"],
      ["gt1","gt3"],["gt2","gt4"],
      ["hoc1","gt3"],["hoc2","gt1"],
    ],
  },

  /* ──────────────────────────────────────────
   * 6. FORM LIÊN HỆ
   * Sau khi deploy Apps Script, dán URL vào đây
   * ────────────────────────────────────────── */
  form: {
    // Dán Web App URL từ Google Apps Script vào đây
    // Ví dụ: "https://script.google.com/macros/s/AKfy.../exec"
    webhookUrl: "https://script.google.com/macros/s/AKfycbw64XWqXG-HrnIe_V7uge6bjDN7M3oPRXEIE7nHd_dLUu6_M7CZtAO9zSYlIe2PtPs7gQ/exec",

    // Tiêu đề thông báo thành công
    successTitle:   "Đã nhận thông tin!",
    successMessage: "Mình sẽ liên hệ lại trong vòng 24h.",
  },

  /* ──────────────────────────────────────────
   * 7. META (SEO & Tab trình duyệt)
   * ────────────────────────────────────────── */
  meta: {
    title:       "Nguyễn Hoàng Tuấn | Giải pháp Vận hành & Tăng trưởng số",
    description: "Đồng hành cùng SME thiết lập hệ thống quản trị và chuyển đổi số. Tư vấn Haravan, Lark Suite, Digital Marketing và AI Automation để chuẩn hóa quy trình, dữ liệu và vận hành hiệu quả.",
    ogImage:     "https://mywebsite.biz-hoangtuan.workers.dev/assets/share-image.png",
  },

};
