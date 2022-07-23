describe('program guide ', () => {
  it('displays', () => {
    // without the user-agent header, test would not be allowed
    // to access the website (403) at all
    cy.visit(Cypress.env().meetingsBaseUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
      }
    });
    // in the real test, i am also cy.wait()ing on a graphql request,
    // but the result is the same: a blank page
    cy.get('[data-cy="sessionType"]')
  });
})