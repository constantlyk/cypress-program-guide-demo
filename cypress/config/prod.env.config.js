const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    type: "PROD",
    meetingsBaseUrl: "https://meetings.asco.org",
    },

  e2e: {
    setupNodeEvents (on, config) {
     
    },
  },
});
