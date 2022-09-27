const puppeteer = require("puppeteer"); // ^14.3.0

let browser;

const express = require("express");

//googleapis
const { google } = require("googleapis");

//initilize express
const app = express();

//set app view engine
app.set("view engine", "ejs");

app.post("/", async (req, res) => {
  const { request, name } = req.body;
})

const auth = new google.auth.GoogleAuth({
  keyFile: "key.json", //the key file
  //url to spreadsheets API
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const spreadsheetId = "1YkNRbclpT9H4DSfZHEHiJkMoSrAsAgpT9XBTFfgq9k8";

const port = 3000;


app.listen(port, async () => {
  console.log(`server started on ${port}`)
  const authClientObject = await auth.getClient();
  const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });
  const readData = await googleSheetsInstance.spreadsheets.values.get({
    auth, //auth object
    spreadsheetId, // spreadsheet id
    range: "asd!B2:B",
  })


  let myList = readData['data']['values'];

  for (let a = 0; a < myList.length; a++) {
    await myFunction(myList[a], a);
  }





  async function myFunction(value, index) {

    var prices = await callforPrice('https://www.amazon.de/dp/' + value.toString());
    console.log(prices);
    let values = [


    ];

    values.push([prices]);

    const resource = {
      values
    }

    var cellNo = index + 2;
    var cell = 'C' + cellNo;
    var range = 'asd!' + cell + ':C';

    console.log(range)

    await googleSheetsInstance.spreadsheets.values.update({
      auth, //auth object
      spreadsheetId, // spreadsheet id
      range: range,
      resource: resource,
      valueInputOption: 'USER_ENTERED'
    })
  }





});

let previousUrl = '';
let previousPrice = 0;

async function callforPrice(url) {

  let finalprice = 0;
 


  if (previousUrl==url) {
    console.log("Same URL So Same Price");
  } else {
    console.log("Calling Price For -- > " + url);
    browser = await puppeteer.launch({
      executablePath: 'C:\\Users\\ashir.muhammad\\AppData\\Local\\Google\\Chrome SxS\\Application\\chrome.exe',
      headless: true,
      args: ['--user-data-dir=C:\\Users\\ashir.muhammad\\AppData\\Local\\Google\\Chrome SxS\\User Data',
      ]

    });
    const [page] = await browser.pages();
    try {
      await page.goto(url, { waitUntil: "domcontentloaded" });
      const el = await page.$("#twister-plus-price-data-price");
      previousPrice = await el.evaluate(el => el.getAttribute("value"));
    } catch (e) {
      console.log(e);
    }
    browser.close();
    console.log("Price Found -- > " + previousPrice);
  }


  previousUrl = url;
  finalprice = previousPrice;
  return finalprice;
}







