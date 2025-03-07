/// <reference types="cypress" />

// Bonus 1: the server implements the /fruits endpoint
// which can return zero, one, or many fruits
// The page fruits.html shows the returned fruits.
// and should handle any number of returned results.
//
// How do we test this? The chances of returning zero fruits
// are slim... but we want to make sure the page doesn't crash

// this test should check whatever the server returns
// by spying on the network call
it('shows zero or more fruits', () => {
  // spy on GET /fruits call and give it an alias
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  //
    cy.intercept('GET', '/fruits')
      .as('getFruits');
  // visit the page /fruits.html
  // https://on.cypress.io/visit
  //
    cy.visit('/fruits.html');
  // the page loads one or more fruits
  // BUT
  // it might get no fruits back from the server
  // wait for the network call to finish
  // https://on.cypress.io/wait
  // from the server response, get the list of fruits
  // and depending on the number of fruits,
  // check the page to confirm
  //
    cy.wait('@getFruits')
      .its('response.body')
      .then( fruits => {
        // if there are no fruits, confirm that
        // the page contains the text "No fruits"
        // https://on.cypress.io/contains
        cy.log(`fruits.length = ${fruits.length}`);
        if (fruits.length === 0) {
                cy.contains('#fruits', 'No fruits');
              }
        // else
        //   confirm each fruit returned by the server is shown
        // TIP: you can also verify that all fruits are unique
        else {
          for (const fruit of fruits) {
            cy.contains(fruit)
              .should('have.length', 1);
          } 
        }
      });
})

it('shows zero fruits', () => {
  // instead of reloading the page and sometimes (very rarely)
  // getting zero fruits returned
  // let's stub the response from the server
  // https://on.cypress.io/intercept
  cy.intercept('GET', '/fruits', { body: [] })
    .as('getFruits');
  // then visit the page /fruits.html
  // https://on.cypress.io/visit
  cy.visit('/fruits.html');
  // confirm there are no fruits
  // https://on.cypress.io/contains
  cy.wait('@getFruits');
  cy.contains('#fruits', 'No fruits');
})

it('shows two fruits', () => {
  // let's stub the response from the server
  // and return two fruits: apples and kiwi
  // https://on.cypress.io/intercept
  cy.intercept('GET', '/fruits', { body: ['Mango', 'Guava'] })
    .as('getFruits');
  // then visit the page /fruits.html
  // https://on.cypress.io/visit
  cy.visit('/fruits.html');
  // confirm there are two fruits
  // https://on.cypress.io/contains
  cy.wait('@getFruits');
  cy.get('#fruits li')
    .should('have.length', 2);
})
