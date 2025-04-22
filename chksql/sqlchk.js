function onFormSubmit(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const submittedRow = sheet.getLastRow();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet
    .getRange(submittedRow, 1, 1, sheet.getLastColumn())
    .getValues()[0];

  // ChatGPTによる評価のための模範解答一覧（Q1〜Q6）
  const correctAnswers = getCorrectAnswersFromJson();

  headers.forEach((header, colIndex) => {
    const match = header.match(/^(Q[0-9]+)[\s:：]/); // 「Q1: ～」形式に対応
    if (match) {
      const qNum = match[1]; // 例: "Q1"
      const 判定列名 = `判定_${qNum}`;
      const 判定ColIndex = headers.findIndex((h) => h === 判定列名);
      const studentSQL = rowData[colIndex];
      const correctSQL = correctAnswers[qNum];

      if (correctSQL && 判定ColIndex !== -1 && studentSQL) {
        const feedback = getSQLJudgementWithChatGPT(studentSQL, correctSQL);
        sheet.getRange(submittedRow, 判定ColIndex + 1).setValue(feedback);
      }
    }
  });
}

function gradeAllResponses() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const dataRange = sheet.getDataRange();
  const allValues = dataRange.getValues();
  const correctAnswers = getCorrectAnswersFromJson(); // quiz_data.json から読み込み

  for (let row = 1; row < allValues.length; row++) {
    // 1行目はヘッダーなのでスキップ
    const rowData = allValues[row];

    headers.forEach((header, colIndex) => {
      const match = header.match(/^(Q[0-9]+)[\s:：]/); // Q1: ～ の形式に対応
      if (match) {
        const qNum = match[1]; // Q1など
        const 判定列名 = `判定_${qNum}`;
        const 判定ColIndex = headers.findIndex((h) => h === 判定列名);
        const studentSQL = rowData[colIndex];
        const correctSQL = correctAnswers[qNum];

        if (correctSQL && 判定ColIndex !== -1 && studentSQL) {
          const feedback = getSQLJudgementWithChatGPT(studentSQL, correctSQL);
          sheet.getRange(row + 1, 判定ColIndex + 1).setValue(feedback); // +1は1行目がヘッダーのため
        }
      }
    });
  }

  Logger.log("全回答の判定が完了しました。");
}

function sendJudgementEmails() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
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
  return headers.findIndex(h => {
    return typeof h === 'string' && h.trim().toLowerCase() === "email address";
  });
}

function getCorrectAnswersFromJson() {
  const fileName = "quiz_data.json";
  const files = DriveApp.getFilesByName(fileName);

  if (!files.hasNext()) {
    throw new Error("quiz_data.json が見つかりません。");
  }

  const file = files.next();
  const content = file.getBlob().getDataAsString("utf-8");
  const data = JSON.parse(content);

  const correctAnswers = {};

  data.forEach((item) => {
    const qKey = `Q${item.questionNumber}`;
    correctAnswers[qKey] = item.answer;
  });

  return correctAnswers;
}

function getSQLJudgementWithChatGPT(studentSQL, correctSQL) {
  const apiKey = ScriptProperties.getProperty('API_KEY'); // ← ここにAPIキーをセット
  const prompt = `
以下のSQL文が同じ意味を持つか判定してください。

【学生の解答】
${studentSQL}

【模範解答】
${correctSQL}

次の形式で出力してください：
判定：正解 または 不正解
理由：○○○
`;

  const payload = {
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: `Bearer ${apiKey}` },
    payload: JSON.stringify(payload),
  };

  try {
    const response = UrlFetchApp.fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const json = JSON.parse(response.getContentText());
    return json.choices[0].message.content.trim();
  } catch (error) {
    return "エラー: " + error.message;
  }
}
