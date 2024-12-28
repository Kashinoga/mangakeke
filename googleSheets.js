const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const dotenv = require("dotenv");

dotenv.config();

const spreadSheetId = process.env.GOOGLE_SPREAD_SHEET_ID;

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Prints the manga spread sheet
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function listManga(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadSheetId,
    range: "Manga!A2:F",
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return;
  }

  const mangaMap = new Map();

  rows.forEach((row) => {
    console.log(
      `Name: ${row[0]}, Chapter: ${row[1]}, Link: ${row[2]}, Release day: ${row[3]}, Description: ${row[4]}, image: ${row[5]}`
    );

    if (!mangaMap.has(row[0].toLowerCase())) {
      mangaMap.set(row[0].toLowerCase(), {
        name: row[0],
        chapter: row[1],
        link: row[2],
        day: row[3],
        description: row[4],
        image: row[5],
      });
    }
  });

  return mangaMap;
}

async function getManga() {
  console.log("hello are we here");
  const auth = await authorize(); // Wait for authorization
  const manga = await listManga(auth); // Wait for manga data
  return manga;
}

/**
 * Add to the manga spreadsheet
 * @param data The data object {name, chapter, link, day, description, image}
 */
async function appendManga(data) {
  const auth = await authorize(); // Wait for authorization
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = spreadSheetId;
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Manga", // all the range in the manga sheet
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [data],
      },
    });
  } catch (error) {
    console.error(
      "Error appending the data to your google sheets : ",
      error.message
    );
    throw new Error(`Failed to add manga data ${error.message}`);
  }
}

module.exports = {
  getManga,
  appendManga,
};
