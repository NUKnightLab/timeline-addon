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

function onEdit(e) {
  SpreadsheetApp.getActiveSpreadsheet()
}

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
  
  SpreadsheetApp.getUi().showSidebar(ui);
}

function appendData(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  
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
  
  if (range.isBlank() == true) {
    range.setValues(template);
  }
  
}

function checkSheet() {
  var ss = SpreadsheetApp.getActiveSheet();
  var values = ss.getRange(1, 1, 1, 18).getValues();

  if(values[0][0] !== "Year" ||
     values[0][1] !== "Month" ||
     values[0][2] !== "Day" ||
     values[0][3] !== "Time" ||
     values[0][4] !== "End Year" ||
     values[0][5] !== "End Month" ||
     values[0][6] !== "End Day" ||
     values[0][7] !== "End Time" ||
     values[0][8] !== "Display Date" ||
     values[0][9] !== "Headline" ||
     values[0][10] !== "Text" ||
     values[0][11] !== "Media" ||
     values[0][12] !== "Media Credit" ||
     values[0][13] !== "Media Caption" ||
     values[0][14] !== "Media Thumbnail" ||
     values[0][15] !== "Type" ||
     values[0][16] !== "Group" || 
     values[0][17] !== "Background") {
    return false; 
  }
  
  return true;
}

function getRowValues(offset) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var cell = sheet.getActiveCell();
  
  if(cell.getRow() == 2 && offset == -1) {
    throw 'You\'re at the first row!'; 
  }
  
  if(cell.getRow() == sheet.getLastRow() && offset == 1) {
    throw 'You\'re on the last row!';
  }
  
  var range = sheet.getRange(cell.getRow() + offset, 1, 1, 18);
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