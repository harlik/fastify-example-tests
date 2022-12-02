/// <reference types="cypress" />
import apple from "../fixtures/apple.json";

it('harlik: imports the fixture from JSON file', () => {
  cy.log(`**apple from fixture: ${JSON.stringify(apple)}**`);
  cy.intercept('GET', '/fruit', apple)
    .as('fruit');
  cy.visit('/');
  cy.get('#fruit')
    .should('have.text', apple.fruit);
})