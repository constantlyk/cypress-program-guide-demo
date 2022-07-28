const { defineConfig } = require("cypress");

module.exports = defineConfig({
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
  env: {
    type: "PROD",
    meetingsBaseUrl: "https://meetings.asco.org",
    },

  e2e: {
    setupNodeEvents (on, config) {
     
    },
  },
});
