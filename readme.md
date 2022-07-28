well, now there are two bugs in this repo!
1. [the test that fails in headless chrome](#the-test-that-fails-in-headless-chrome)
2. [the "terribly wrong" error](#the-terribly-wrong-error)

# the test that fails in headless chrome
... but succeeds otherwise.

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
* updated to add partial debug logs for [headless](https://pastebin.com/HSJJjxDi) and [headed](https://pastebin.com/HnAiRbqf) runs (`DEBUG=cypress:http*`). it seems that headless requests possibly use a different host than headed requests, but not sure if that matters.
* updated to further add full debug logs; find them in `headlesstest` and `headedtest`.
* the meetings page "redirect": never happens when the test fails. is it failing because it's getting stuck on the redirect, or is it failing even before that? (i don't think it's a true 301 redirect, if that matters.)
* the graphql request: i haven't included it here, but the original version of this test intercepts and waits on the request that fetches the page data. that request is definitely not being fired. is the test failing before it gets the chance to send this?
* `modifyObstructiveCode` and `chromeWebSecurity`: if i set these to false in `cypress.config.js` in this repo, they don't seem to have any effect. i have to place them in `config/prod.env.config.js` for them to do anything. in the original file, which contained two tests, the *first* test in every run using the test runner would fail with this same blank page issue, and print a MIME-related error to the browser console. setting `modifyObstructiveCode: false` did seem to resolve that error when running in the test runner, but has had no effect on headless chrome runs.
* `User-Agent`: i have a user-agent header included in `cy.visit()`, because in headless chrome, the test is forbidden from even accessing the url. setting realistic-looking user-agent seems to have resolved that, but at what cost?

# the "terribly wrong" error

## replicating the issue
1. clone this repo
2. `npm install`
3. in the terminal, enter the following
```
npm run cy:open:prod
```
4. after the test runner launches chrome, open the chrome dev tools console
5. click `intercept-graphql.cy.js` in the list of specs

## expected results
it should just work, with no concerning messages in the console.

## observed results
the test does appear to pass, but in the console the following error is printed:
```
Uncaught Error: Something went terribly wrong and we cannot proceed. We expected to find the global Cypress in the parent window but it is missing. This should never happen and likely is a bug. Please open an issue.
    at ./injection/main.js (VM69 authorize:3:1090)
    at n (VM69 authorize:3:179)
    at 0 (VM69 authorize:3:2416)
    at n (VM69 authorize:3:179)
    at VM69 authorize:3:971
    at VM69 authorize:3:980
```

## what the heck?
this test uses `config/prod.env.config.js`, which contains
```
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
```
if i instead move these to `cypress.config.js`, the same test runs into a cross-origin security error, suggesting that these flags only work if used in `prod.env.config.js`. but there may be some funny business here, perhaps due to the fact that there are two "config" files. or perhaps the funny business is operating out of the website and its iframes(?).