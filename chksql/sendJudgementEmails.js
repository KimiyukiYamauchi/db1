function sendJudgementEmails() {
  const spreadsheetId =
    PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheets()[0];

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const allValues = sheet.getDataRange().getValues();

  Logger.log("headers: " + JSON.stringify(headers));

  const emailColIndex = findEmailColumnIndex(headers);
  if (emailColIndex === -1) {
    throw new Error("メールアドレス列（Email Address）が見つかりません。");
  }

  for (let row = 1; row < allValues.length; row++) {
    const rowData = allValues[row];
    const email = rowData[emailColIndex];
    let mailBody = "SQL課題の判定結果をお送りします。\n\n";

    headers.forEach((header, colIndex) => {
      if (header.startsWith("判定_Q")) {
        const 判定結果 = rowData[colIndex];
        if (判定結果) {
          mailBody += `${header}:\n${判定結果}\n\n`;
        }
      }
    });

    if (email) {
      GmailApp.sendEmail(email, "SQL課題の判定結果", mailBody);
      Logger.log(`判定結果を ${email} に送信しました。`);
    }
  }

  Logger.log("すべての回答者に判定メールを送信しました。");
}

function findEmailColumnIndex(headers) {
  return headers.findIndex((h) => {
    return typeof h === "string" && h.trim().toLowerCase() === "email address";
  });
}
