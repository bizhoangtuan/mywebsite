/**
 * ============================================================
 *  GOOGLE APPS SCRIPT — Nhận form liên hệ → Ghi vào Sheet
 *  Chủ sở hữu: biz.hoangtuan@gmail.com
 *  Sheet ID: 1NkN-zPFtrDX5l2teRJ5oZOiwXDX3JB1dUVNL1PJpmwE
 * ============================================================
 *
 *  HƯỚNG DẪN CÀI ĐẶT (làm 1 lần duy nhất):
 *
 *  1. Mở Google Sheet của bạn
 *  2. Menu trên cùng → Extensions → Apps Script
 *  3. Xóa code mặc định, paste toàn bộ file này vào
 *  4. Nhấn Save (Ctrl+S)
 *  5. Nhấn Deploy → New deployment
 *     - Type: Web app
 *     - Execute as: Me (biz.hoangtuan@gmail.com)
 *     - Who has access: Anyone
 *  6. Nhấn Deploy → Copy URL vừa tạo
 *  7. Dán URL đó vào config.js ở mục: formWebhookUrl
 *  8. Done! Test thử bằng cách điền form trên website
 * ============================================================
 */

const SCRIPT_VERSION = "2026-10-12-v3-html-email";
const SHEET_NAME = "Form Liên hệ";   // Tên tab trong Google Sheet
const NOTIFY_EMAIL = "biz.hoangtuan@gmail.com"; // Email nhận thông báo

// Các cột trong Sheet (theo thứ tự)
const COLUMNS = [
  "Thời gian",
  "Họ và tên",
  "Số điện thoại",
  "Email",
  "Doanh nghiệp",
  "Dịch vụ quan tâm",
  "Mô tả bài toán",
  "Nguồn"
];

/**
 * Mở URL /exec trên trình duyệt để kiểm tra deployment đang chạy phiên bản nào
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", version: SCRIPT_VERSION }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Hàm chính — chạy khi website POST form data đến đây
 */
function doPost(e) {
  try {
    // Parse JSON data từ form
    const data = JSON.parse(e.postData.contents);

    // Lấy hoặc tạo sheet
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    let sheet   = ss.getSheetByName(SHEET_NAME);

    // Nếu sheet chưa tồn tại → tạo mới + thêm header
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(COLUMNS);

      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, COLUMNS.length);
      styleHeader(sheet);
      sheet.setFrozenRows(1);

      // Set column widths
      sheet.setColumnWidth(1, 160); // Thời gian
      sheet.setColumnWidth(2, 160); // Họ tên
      sheet.setColumnWidth(3, 130); // SĐT
      sheet.setColumnWidth(4, 200); // Email
      sheet.setColumnWidth(5, 180); // Doanh nghiệp
      sheet.setColumnWidth(6, 200); // Dịch vụ
      sheet.setColumnWidth(7, 300); // Mô tả
      sheet.setColumnWidth(8, 120); // Nguồn
    }

    // Chuẩn bị row data
    const now = new Date();
    const timestamp = Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");

    const row = [
      timestamp,
      data.name        || "",
      data.phone       || "",
      data.email       || "",
      data.company     || "",
      data.service     || "",
      data.message     || "",
      data.source      || "Website Profile",
    ];

    // Ghi vào sheet
    sheet.appendRow(row);

    // Giữ nguyên số 0 đầu của SĐT (ép cột thành dạng text) + format dòng mới
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 3).setNumberFormat("@");
    sheet.getRange(lastRow, 3).setValue(normalizePhone(row[2]));
    styleRow(sheet, lastRow);

    // Gửi email thông báo
    sendNotificationEmail(data, timestamp);

    // Trả về success
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Đã lưu thành công" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Log lỗi
    console.error("Error:", err.toString());

    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Chuẩn hóa SĐT: thêm lại số 0 đầu nếu bị mất (vd 919073456 -> 0919073456)
 */
function normalizePhone(v) {
  const t = String(v == null ? "" : v).trim();
  if (/^[1-9][0-9]{8}$/.test(t)) return "0" + t;
  return t;
}

function styleHeader(sheet) {
  const r = sheet.getRange(1, 1, 1, COLUMNS.length);
  r.setBackground("#e65f35").setFontColor("#ffffff").setFontWeight("bold")
   .setFontSize(11).setVerticalAlignment("middle");
}

function styleRow(sheet, rowIndex) {
  const r = sheet.getRange(rowIndex, 1, 1, COLUMNS.length);
  r.setBackground(rowIndex % 2 === 0 ? "#ffffff" : "#fff8f1")
   .setFontColor("#2e241f").setFontSize(11)
   .setVerticalAlignment("top").setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
}

/**
 * Chạy thủ công 1 lần: sửa lại toàn bộ dòng cũ (màu sáng dễ đọc + khôi phục số 0 đầu SĐT)
 */
function fixSheetFormat() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return;
  styleHeader(sheet);
  const last = sheet.getLastRow();
  if (last < 2) return;
  sheet.getRange(2, 1, last - 1, 3).setNumberFormat("@");
  const phones = sheet.getRange(2, 3, last - 1, 1);
  phones.setValues(phones.getValues().map((x) => [normalizePhone(x[0])]));
  for (let i = 2; i <= last; i++) styleRow(sheet, i);
  sheet.setColumnWidth(7, 380);
}

/**
 * Gửi email thông báo khi có lead mới (HTML, không dùng emoji để tránh lỗi font/mã hóa)
 */
function sendNotificationEmail(data, timestamp) {
  try {
    const esc = (v) => String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    const dash = (v) => (v && String(v).trim()) ? esc(v) : '<span style="color:#9a9a9a;">—</span>';

    const name    = (data.name || "").trim();
    const phone   = (data.phone || "").trim();
    const email   = (data.email || "").trim();
    const source  = data.source || "Website Profile";
    const message = (data.message || "").trim();
    const phoneDigits = phone.replace(/[^0-9+]/g, "");
    const sheetUrl = "https://docs.google.com/spreadsheets/d/" + SpreadsheetApp.getActiveSpreadsheet().getId();

    const subject = "[Lead mới] " + (name || "Không rõ tên") + " - " + (phone || "chưa có SĐT") +
                    (data.service ? " - " + data.service : "");

    const row = (label, valueHtml) =>
      '<tr>' +
        '<td style="padding:10px 0;width:150px;color:#7b6a60;font-size:14px;vertical-align:top;">' + label + '</td>' +
        '<td style="padding:10px 0;color:#2e241f;font-size:15px;font-weight:600;vertical-align:top;">' + valueHtml + '</td>' +
      '</tr>';

    const button = (href, text, bg) =>
      '<a href="' + href + '" style="display:inline-block;margin:0 8px 8px 0;padding:11px 20px;background:' + bg +
      ';color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:700;">' + text + '</a>';

    let buttons = "";
    if (phoneDigits) {
      buttons += button("tel:" + phoneDigits, "Gọi ngay", "#e65f35");
      buttons += button("https://zalo.me/" + phoneDigits.replace(/^\+?84/, "0"), "Nhắn Zalo", "#0068ff");
    }
    if (email) buttons += button("mailto:" + esc(email), "Gửi email", "#2e241f");

    const htmlBody =
      '<div style="background:#fbf3ea;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">' +
      '<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #eadfd2;">' +

        '<div style="background:#e65f35;padding:22px 28px;">' +
          '<div style="color:#ffe9df;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Lead mới từ website</div>' +
          '<div style="color:#ffffff;font-size:22px;font-weight:700;margin-top:6px;">' + esc(name || "Không rõ tên") + '</div>' +
          '<div style="color:#ffffff;font-size:15px;margin-top:2px;">' + esc(phone) + '</div>' +
        '</div>' +

        '<div style="padding:24px 28px 8px;">' +
          '<div style="font-size:12px;font-weight:700;color:#e65f35;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid #f0e6da;padding-bottom:8px;">Thông tin liên hệ</div>' +
          '<table style="width:100%;border-collapse:collapse;">' +
            row("Họ và tên", dash(name)) +
            row("Số điện thoại", phone ? '<a href="tel:' + phoneDigits + '" style="color:#2e241f;text-decoration:none;">' + esc(phone) + '</a>' : dash("")) +
            row("Email", email ? '<a href="mailto:' + esc(email) + '" style="color:#2e241f;">' + esc(email) + '</a>' : dash("")) +
            row("Doanh nghiệp", dash(data.company)) +
          '</table>' +
        '</div>' +

        '<div style="padding:8px 28px 8px;">' +
          '<div style="font-size:12px;font-weight:700;color:#e65f35;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid #f0e6da;padding-bottom:8px;">Nhu cầu tư vấn</div>' +
          '<table style="width:100%;border-collapse:collapse;">' +
            row("Dịch vụ quan tâm", dash(data.service)) +
          '</table>' +
          '<div style="margin:6px 0 14px;padding:14px 16px;background:#fff8f1;border-left:3px solid #e65f35;border-radius:0 8px 8px 0;color:#2e241f;font-size:14px;line-height:1.7;white-space:pre-wrap;">' +
            (message ? esc(message) : '<span style="color:#9a9a9a;">Không có mô tả</span>') +
          '</div>' +
        '</div>' +

        (buttons ? '<div style="padding:4px 28px 20px;">' + buttons + '</div>' : '') +

        '<div style="padding:16px 28px;background:#fbf3ea;border-top:1px solid #f0e6da;font-size:13px;color:#7b6a60;line-height:1.8;">' +
          'Thời gian gửi: <strong>' + esc(timestamp) + '</strong><br>' +
          'Nguồn: <strong>' + esc(source) + '</strong><br>' +
          '<span style="color:#b8a99d;font-size:11px;">Script ' + SCRIPT_VERSION + '</span><br>' +
          '<a href="' + sheetUrl + '" style="color:#e65f35;font-weight:700;">Mở danh sách lead trên Google Sheet</a>' +
        '</div>' +

      '</div></div>';

    const plainBody =
      "Lead mới từ website\n\n" +
      "Họ và tên: " + (name || "—") + "\n" +
      "Số điện thoại: " + (phone || "—") + "\n" +
      "Email: " + (email || "—") + "\n" +
      "Doanh nghiệp: " + (data.company || "—") + "\n" +
      "Dịch vụ quan tâm: " + (data.service || "—") + "\n" +
      "Mô tả bài toán: " + (message || "Không có mô tả") + "\n\n" +
      "Thời gian gửi: " + timestamp + "\n" +
      "Nguồn: " + source + "\n" +
      "Danh sách lead: " + sheetUrl;

    const options = { htmlBody: htmlBody, name: "Website Nguyễn Hoàng Tuấn" };
    if (email) options.replyTo = email;

    GmailApp.sendEmail(NOTIFY_EMAIL, subject, plainBody, options);
  } catch (err) {
    console.error("Email error:", err.toString());
    // Không throw — nếu email lỗi vẫn lưu sheet bình thường
  }
}

/**
 * Hàm test — chạy thủ công để kiểm tra script hoạt động
 * Vào Apps Script → chọn hàm testScript → nhấn Run
 */
function testScript() {
  const fakeData = {
    postData: {
      contents: JSON.stringify({
        name:    "Nguyễn Test",
        phone:   "0901234567",
        email:   "test@company.com",
        company: "Công ty ABC",
        service: "TMĐT & Omnichannel (Haravan)",
        message: "Đây là test submission từ Apps Script.",
        source:  "Test"
      })
    }
  };

  const result = doPost(fakeData);
  console.log("Test result:", result.getContent());
  Logger.log("✅ Test thành công! Kiểm tra Sheet xem có dòng mới chưa.");
}
