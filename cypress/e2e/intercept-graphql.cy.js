import { aliasQuery } from "./utils/graphql.utils";

describe('program guide ', () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://api.asco.org/graphql', (req) => {
      aliasQuery(req, 'getMeetingData')
    });
  });
  it('displays', () => {
    cy.visit(Cypress.env().meetingsBaseUrl);
    cy.wait('@gqlgetMeetingDataQuery');
    cy.get('[data-cy="sessionType"]')
  });
})