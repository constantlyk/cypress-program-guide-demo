for debugging a test that fails in headless chrome, but succeeds otherwise.

## replicating the issue
1. clone this repo
2. `npm install`
3. in the terminal, enter the following
```
npx cypress run --e2e --browser=chrome -C cypress/config/prod.env.config.js --spec cypress/e2e/program-guide.cy.js
```

### expected result
`meetings.asco.org` opens, redirects to `meetings.asco.org/meetings/2022-best-of-asco-new-orleans/290/program-guide/scheduled-sessions`, and page contents load. and this should work headed and headlessly, in chrome and electron.

### observed result
when running headlessly with chrome, `meetings.asco.org` opens, but no redirect occurs, and page contents do not load. the graphql request that should return the page data is never sent. strangely, the cookie policy popup *does* load and display.

the test *does* succeed when run headlessly with electron, and also succeeds when run headed with chrome, and when run with chrome using the test runner.

## possible suspects and other clues
* the meetings page redirect: never happens when the test fails. is it failing because it's getting stuck on the redirect, or is it failing even before that?
* the graphql request: i haven't included it here, but the original version of this test intercepts and waits on the request that fetches the page data. that request is definitely not being fired. is the test failing before it gets the chance to send this?
* `modifyObstructiveCode` and `chromeWebSecurity`: if i set these to false in `cypress.config.js` in this repo, they don't seem to have any effect. (i haven't included them right now for simplicity.) in the original file, which contained two tests, the *first* test in every run using the test runner would fail with this same blank page issue, and print a MIME-related error to the browser console. setting `modifyObstructiveCode: false` did seem to resolve that error when running in the test runner, but has had no effect on headless chrome runs.
* `User-Agent`: i have a user-agent header included in `cy.visit()`, because in headless chrome, the test is forbidden from even accessing the url. setting realistic-looking user-agent seems to have resolved that, but at what cost?