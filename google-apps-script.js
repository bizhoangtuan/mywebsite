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
      headerRange.setBackground("#1E1B14");
      headerRange.setFontColor("#C8A45A");
      headerRange.setFontWeight("bold");
      headerRange.setFontSize(11);
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

    // Format row mới (zebra striping)
    const lastRow    = sheet.getLastRow();
    const rowRange   = sheet.getRange(lastRow, 1, 1, COLUMNS.length);
    const bgColor    = lastRow % 2 === 0 ? "#1E1B14" : "#252018";
    rowRange.setBackground(bgColor);
    rowRange.setFontColor("#D1C7B3");
    rowRange.setFontSize(11);
    rowRange.setVerticalAlignment("middle");

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
 * Gửi email thông báo khi có lead mới
 */
function sendNotificationEmail(data, timestamp) {
  try {
    const subject = `🔔 Lead mới từ website: ${data.name || "Không rõ tên"} - ${data.phone || ""}`;

    const body = `
Xin chào Tuấn,

Có một yêu cầu tư vấn mới từ website profile của bạn!

━━━━━━━━━━━━━━━━━━━━━━━━
📋 THÔNG TIN LIÊN HỆ
━━━━━━━━━━━━━━━━━━━━━━━━
👤 Họ và tên:       ${data.name || "—"}
📱 Số điện thoại:   ${data.phone || "—"}
✉️  Email:           ${data.email || "—"}
🏢 Doanh nghiệp:   ${data.company || "—"}

━━━━━━━━━━━━━━━━━━━━━━━━
💼 NHU CẦU TƯ VẤN
━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Dịch vụ quan tâm: ${data.service || "—"}
📝 Mô tả bài toán:
${data.message || "Không có mô tả"}

━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Thời gian gửi: ${timestamp}
🌐 Nguồn: ${data.source || "Website Profile"}
━━━━━━━━━━━━━━━━━━━━━━━━

Xem toàn bộ danh sách lead tại:
https://docs.google.com/spreadsheets/d/1NkN-zPFtrDX5l2teRJ5oZOiwXDX3JB1dUVNL1PJpmwE

Chúc bạn chốt deal thành công! 🎯
    `;

    GmailApp.sendEmail(NOTIFY_EMAIL, subject, body);
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
