# timeline-addon
Experimenting with a Google Docs add-on to manage TimelineJS spreadsheets

## Getting Started
This add-on uses the Grunt task runner to compile the HTML, CSS, and JS files that make up the add on into the inline HTML format that Google Apps Script accepts. It also uses [gapps](https://github.com/danthareja/node-google-apps-script) to upload those compiled files to Google Drive.

To install Grunt, you'll need the Node Package Manager, or npm. You can get that by [downloading Node.js](https://nodejs.org/en/download/)

Once you have Node.js installed, you can open your terminal and install Grunt with the command
```
npm install -g grunt
```

You'll also want to install the Grunt command line interface
```
npm install -g grunt-cli
```

The grunt plugin we use to compile our CSS and JS is [chyingp's Grunt inline](https://github.com/chyingp/grunt-inline). To install that, you can run
```
npm install grunt-inline --save-dev
```

The gapps package, created by danthareja, can be found [here](https://github.com/danthareja/node-google-apps-script). To install it, run
```
npm install -g node-google-apps-script
```

Please read through and follow the steps in the gapps readme.

Once everything is installed correctly, you can compile your files with
```
grunt inline
```
and upload them to your Google Drive with
```
gapps upload
```
