/// <reference types="cypress" />
import apple from "../fixtures/apple.json";

it('clearly shows the loading element - random fruit', () => {
  cy.intercept('GET', '/fruit', (req) => {
      req.on('response', (res) => {
        res.setDelay(2000);
      })
    }
  )
    .as('getFruit');
  cy.visit('/');
  cy.get('#fruit')
    .should('contain.text', 'loading');
  cy.wait('@getFruit');
  cy.get('#fruit')
    .should('not.contain.text', 'loading', { timeout: 3000 });
})

it('clearly shows the loading element - stubbed fruit', () => {
  cy.intercept('GET', '/fruit', (req) => {
      req.on('response', (res) => {
        res.setDelay(2000);
        res.body = apple;
      })
    }
  )
    .as('getFruit');
  cy.visit('/');
  cy.get('#fruit')
    .should('contain.text', 'loading');
  cy.wait('@getFruit');
  cy.get('#fruit')
    .should('have.text', apple.fruit, { timeout: 3000 });
})

// bonus - instead of stubbing the request, just delay it
it.only('slows down the /fruit request without stubbing it', () => {
  cy.intercept('GET', '/fruit')    
  .as('getFruit');
  cy.visit('/');
  cy.get('#fruit')
  .should('have.text', 'loading...');
  cy.wait('@getFruit')
    .then(() => {
      return new Cypress.Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('foo')
        }, 2000)    })
    });
  cy.get('#fruit')
    .should('not.have.text', 'loading...', { timeout: 3000 });
})
