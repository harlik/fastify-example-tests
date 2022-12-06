/// <reference types="cypress" />
import { fruit } from '../fixtures/apple.json';

describe('makes GET /fruit requests every minute', function() {
  it('stubbed with apple', () => {
    // spy on the GET /fruit endpoint
    cy.intercept('GET', '/fruit', { fixture: 'apple.json' })
      .as('getFruit');
  
    // use the cy.clock command to freeze the timers in the app
    // https://on.cypress.io/clock
    cy.clock();
    // visit the page
    cy.visit('/');
    // wait for the first request to finish and confirm the fruit
    cy.wait('@getFruit');
    cy.get('#fruit')
      .should('have.text', fruit);
    // advance the clock by one minute using cy.tick command
    // https://on.cypress.io/tick
    cy.tick(60000);
    // wait for the second request to finish and confirm the fruit
    cy.wait('@getFruit');
    cy.get('#fruit')
      .should('have.text', fruit);
    // advance the clock by one minute one more time
    cy.tick(60000);
    // wait for the network call and confirm the fruit
    cy.wait('@getFruit');
    cy.get('#fruit')
      .should('have.text', fruit);
  })
  
  it('random fruit + not loading', () => {
    // spy on the GET /fruit endpoint
    cy.intercept('GET', '/fruit')
      .as('getFruit');
    // use the cy.clock command to freeze the timers in the app
    // https://on.cypress.io/clock
    cy.clock();
    // visit the page
    cy.visit('/');
    // wait for the first request to finish and confirm the fruit
    cy.wait('@getFruit');
    cy.get('#fruit')
      .should('not.contain.text', 'loading');
    // advance the clock by one minute using cy.tick command
    // https://on.cypress.io/tick
    cy.tick(60000);
    // wait for the second request to finish and confirm the fruit
    cy.wait('@getFruit');
    cy.get('#fruit')
      .should('not.contain.text', 'loading');
    // advance the clock by one minute one more time
    cy.tick(60000);
    // wait for the network call and confirm the fruit
    cy.wait('@getFruit');
    cy.get('#fruit')
      .should('not.contain.text', 'loading');
  })
  
  it(`BE fruit, Gleb's idea`, () => {
    // spy on the GET /fruit endpoint
    cy.intercept('GET', '/fruit')
      .as('getFruit');
    // use the cy.clock command to freeze the timers in the app
    // https://on.cypress.io/clock
    cy.clock();
    // visit the page
    cy.visit('/');
    // wait for the first request to finish and confirm the fruit
    cy.wait('@getFruit')
      .its('response.body.fruit')
      .then(fruit => {
        cy.get('#fruit')
          .should('have.text', fruit);
      })
    // advance the clock by one minute using cy.tick command
    // https://on.cypress.io/tick
    cy.tick(60_000);
    // wait for the second request to finish and confirm the fruit
    cy.wait('@getFruit')
      .its('response.body.fruit')
      .then(fruit => {
        cy.contains('#fruit', fruit);
      })
    // advance the clock by one minute one more time
    cy.tick(60_000);
    // wait for the network call and confirm the fruit
    cy.wait('@getFruit')
      .its('response.body.fruit')
      .then(fruit => {
        cy.contains('#fruit', fruit)
          .should('be.visible');
      })
  })  
})
