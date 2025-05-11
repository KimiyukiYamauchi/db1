function gradeAllResponses() {
  const spreadsheetId =
    PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheets()[0];

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

        if (correctSQL && 判定ColIndex !== -1) {
          let feedback = "";

          if (studentSQL && studentSQL.trim() !== "") {
            feedback = getSQLJudgementWithChatGPT(studentSQL, correctSQL);
          } else {
            feedback = "判定：不正解\n理由：未入力のため";
          }

          sheet.getRange(row + 1, 判定ColIndex + 1).setValue(feedback);
        }
      }
    });
  }

  Logger.log("全回答の判定が完了しました。");
}

function getCorrectAnswersFromJson() {
  const fileName = "db1_chap02.01.json";
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
  const apiKey = PropertiesService.getScriptProperties().getProperty("API_KEY"); // ← ここにAPIキーをセット
  const prompt = `
あなたは優秀なリレーショナルデータベースの講師です。
学生が提出した「学生の解答」と「模範解答」を比較し、問題点を指摘してください
「学生の解答」を「あなたの解答」として、問題点を指摘してください

【学生の解答】
${studentSQL}

【模範解答】
${correctSQL}

次の形式で出力してください：
判定：正解 または 不正解
理由：○○○

### 理由の例
- あなたの解答は模範解答と全く同じであり、SQLの文法も正しく、特に問題はありません。
- あなたの解答はSQL文の最初のキーワードが"ELECT"となっていますが、これは誤りで、正しくは"SELECT"となります。"SELECT"はデータベースからデータを選択するためのSQLのキーワードです。
- あなたの解答では半径が10000より大きい惑星の情報を取得していますが、模範解答では半径が10000以上の惑星の情報を取得しています。したがって、半径がちょうど10000の惑星の情報は学生の解答では取得できません。この違いが問題となります。
- あなたの解答では、重量が60000より小さい惑星の情報を取得しています。しかし、模範解答では、重量が60000以下の惑星の情報を取得しています。したがって、重量がちょうど60000の惑星の情報が学生の解答では取得できないため、不正解となります。
- 実行不可能のため不正解です。
`;

  const payload = {
    model: "gpt-4.1-mini",
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

function appendJudgementSummaryRow() {
  const spreadsheetId =
    PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheets()[0];
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const data = sheet.getDataRange().getValues();

  const summaryRow = new Array(headers.length).fill("");

  headers.forEach((header, colIndex) => {
    if (header.startsWith("判定_Q")) {
      let correct = 0;
      let incorrect = 0;

      for (let i = 1; i < data.length; i++) {
        const value = data[i][colIndex];
        if (typeof value === "string") {
          if (/判定\s*[:：]\s*正解/.test(value)) {
            correct++;
          } else if (/判定\s*[:：]\s*不正解/.test(value)) {
            incorrect++;
          }
        }
      }

      const total = correct + incorrect;
      const rate = total > 0 ? Math.round((correct / total) * 100) : 0;

      summaryRow[
        colIndex
      ] = `正解: ${correct} / 不正解: ${incorrect} / 正解率: ${rate}%`;
    }
  });

  sheet.appendRow(summaryRow);
  Logger.log("判定集計行を追加しました。");
}

function appendJudgementSummaryColumns() {
  const spreadsheetId =
    PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheets()[0];
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const data = sheet.getDataRange().getValues();

  // 判定_Qn の列インデックスを抽出
  const 判定ColIndices = headers
    .map((h, i) => (h.startsWith("判定_Q") ? i : -1))
    .filter((i) => i !== -1);

  const newHeaders = ["正解数", "不正解数", "正解率"];
  sheet
    .getRange(1, headers.length + 1, 1, newHeaders.length)
    .setValues([newHeaders]);

  for (let row = 1; row < data.length; row++) {
    let correct = 0;
    let incorrect = 0;

    判定ColIndices.forEach((col) => {
      const value = data[row][col];
      if (typeof value === "string") {
        if (/判定\s*[:：]\s*正解/.test(value)) {
          correct++;
        } else if (/判定\s*[:：]\s*不正解/.test(value)) {
          incorrect++;
        }
      }
    });

    const total = correct + incorrect;
    const rate = total > 0 ? Math.round((correct / total) * 100) : 0;
    const resultRow = [[correct, incorrect, `${rate}%`]];

    sheet.getRange(row + 1, headers.length + 1, 1, 3).setValues(resultRow);
  }

  Logger.log("各行の正解数・不正解数・正解率を追加しました。");
}
