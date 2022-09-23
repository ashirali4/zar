const puppeteer = require("puppeteer"); // ^14.3.0



let browser;


async function callforPrice(url) {
  console.log("Calling Price For -- > " + url);
  browser = await puppeteer.launch({ headless: true });
  const [page] = await browser.pages();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const el = await page.$("#twister-plus-price-data-price");
  const price = await el.evaluate(el => el.getAttribute("value"));
  console.log("Price Found -- > " + price);
  return price;
}



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
    range: "Worksheet!B2:B",
  })



 
  readData['data']['values'].forEach(myFunction);
  async function myFunction(value,index) {
    var prices = await callforPrice('https://www.amazon.com/dp/' + value.toString());
    console.log(prices);
    let values = [


    ];
  
    values.push([prices]);

    const resource = {
      values
    }

    var cellNo = index+2 ;
    var cell = 'C'+cellNo;
    var range = 'Worksheet!'+cell+':C';

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

