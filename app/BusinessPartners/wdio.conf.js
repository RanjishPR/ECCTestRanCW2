require("dotenv").config({path : "../../.env"})
const endPoint = require("../../tests/util/config").bp_app
exports.config = {

  // wdi5 Configuration
  wdi5: {
    logLevel: "verbose", 
    waitForUI5Timeout: 80000
  },

  // Specify Test Files
  specs: ["../../tests/ui/specs/*.js"],

  // Capabilities
  maxInstances: 10,

  capabilities: [
    {
        maxInstances: 5,
        browserName: "chrome",
        acceptInsecureCerts: true,
        'goog:chromeOptions': {
          args: [ '--headless', '--disable-dev-shm-usage', '--disable-gpu', '--no-sandbox', '--window-size=1920,1080'], 
        },
        "wdi5:authentication": {
          provider: "BTP"
        }
    },
  ],

  // automationProtocol: "devtools",

  // Test Configurations
  logLevel: "error",
  
  bail: 0,

  baseUrl: endPoint.home,

  waitforTimeout: 100000,

  connectionRetryTimeout: 120000,

  connectionRetryCount: 3,
  
  // Test runner services
  services: ["ui5"],

  // Framework you want to run your specs with.
  framework: "mocha",
 
  reporters: ["spec"],


  mochaOpts: {
    ui: "bdd",
    timeout: 80000,
  },

  //Login into the app and get to the main page
  before: async function (capabilities, specs, browser) {

      await browser.waitUntil(async() => {
          return((await browser.getUrl()) === endPoint.auth)
      })
      await (await $("=Default Identity Provider")).click();

      console.log("Logging in...")    

      await browser.waitUntil(async() => {
          return((await browser.getUrl()) === endPoint.home)
      })

      console.log("Log in successful")

      const tile = await $("span=Business Partner Validation");
      if(await tile.waitForDisplayed({ timeout: 5000 }) && await tile.waitForClickable({ timeout: 5000 })){
        
        console.log("Navigating from Home Page")  
        await tile.click();

        if(await browser.getUrl() === endPoint.main){
            console.log("Navigated to the main page ")
          }
      }

      if (await browser.getUrl() !== endPoint.main){
        console.log("Required page not loaded");
        browser.closeWindow();
        process.exit();
      }
  }
};