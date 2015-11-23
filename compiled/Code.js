var template = [
  [
   "Year",
   "Month",
   "Day",
   "Time",
   "End Year",
   "End Month",
   "End Day",
   "End Time",
   "Display Date",
   "Headline",
   "Text",
   "Media",
   "Media Credit",
   "Media Caption",
   "Media Thumbnail",
   "Type",
   "Group",
   "Background"
  ]
];

/**
 * Creates a menu entry in the Google Sheets UI when the document is opened.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onOpen(e) {
  SpreadsheetApp.getUi().createAddonMenu()
      .addItem('Launch', 'launchApp')
      .addToUi();
}

/**
 * Runs when the add-on is installed.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode. (In practice, onInstall triggers always
 *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
 *     AuthMode.NONE.)
 */
function onInstall(e) {
  onOpen(e);
}

function createEditTrigger() {
  var ss = SpreadsheetApp.getActive();
  ScriptApp.newTrigger('uponEdit')
    .forSpreadsheet(ss)
    .onEdit()
    .create();
}

// installable trigger
function uponEdit() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();

  sheet.appendRow(template);
}

// function onEdit(e) {
// // simple trigger that must be bound to the spreadsheet
// }

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 */
function launchApp() {
  var ui;

  if(checkSheet()){
    ui = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('TimelineJS Helper')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  } else {
    ui = HtmlService.createHtmlOutputFromFile('Init')
      .setTitle('TimelineJS Initializer')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  }

  // addon must be deployed for this to work
  // createEditTrigger();

  SpreadsheetApp.getUi().showSidebar(ui);
}

function appendData(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();

  validateData(data);
  sheet.appendRow(data);
}

function editData(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var cell = sheet.getActiveCell();

  var range = sheet.getRange(cell.getRow(), 1, 1, 18);

  validateData(data);

  range.setValues([data]);
}

function validateData(data) {
  if(data[0] == "") {
    throw 'Invalid start year.';
  }
}

function addTemplate() {
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getSheets()[0];
 var range = sheet.getRange("A1:R1");

  if (range.isBlank() == true) {
    range.setValues(template);
  }

}

function checkSheet() {
  var ss = SpreadsheetApp.getActiveSheet();
  var values = ss.getRange(1, 1, 1, 18).getValues();

  for (var i = 0; i < 18; i++) {
    if (values[0][i] !== template[0][i]) {
      return false;
    }
  }

  return true;
}

function getRowData(row) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var cell = sheet.getActiveCell();

  var range = sheet.getRange(row + 2, 1, 1, 18);
  sheet.setActiveRange(range);

  var data = [];

  for (var i = 0; i < 18; i++) {
    data[i] = range.getCell(1, i + 1).getValue();
  }

  return data;
}

function initSheet() {
  addTemplate();

  var ui = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('TimelineJS Helper')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);

  SpreadsheetApp.getUi().showSidebar(ui);
}

function getAllRows() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();

  var lastRow = sheet.getLastRow();
  var headlines = [];

  for (var i = 2; i < lastRow + 1; i++) {
    headlines[i - 2] = sheet.getRange(i, 1, 1, 18).getCell(1, 10).getValue();
  }

  return headlines;
}
