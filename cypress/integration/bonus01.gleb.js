// cypress/integration/bonus01.js

// this test should check whatever the server returns
// by spying on the network call
it('shows zero or more fruits', () => {
  // spy on GET /fruits call and give it an alias
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept('GET', '/fruits').as('getFruits')
  //
  // visit the page /fruits.html
  // https://on.cypress.io/visit
  cy.visit('/fruits.html')
  // the page loads one or more fruits
  // BUT
  // it might get no fruits back from the server
  // wait for the network call to finish
  // https://on.cypress.io/wait
  // from the server response, get the list of fruits
  // and depending on the number of fruits,
  // check the page to confirm
  cy.wait('@getFruits')
    .its('response.body')
    .then((fruits) => {
      if (fruits.length === 0) {
        // if there are no fruits, confirm that
        // the page contains the text "No fruits"
        // https://on.cypress.io/contains
        cy.contains('#fruits', 'No fruits')
      } else {
        // else
        //   confirm each fruit returned by the server is shown
        cy.log('Looking for fruits')
        cy.log(fruits.join(', '))
        cy.get('#fruits li').should(
          'have.length',
          fruits.length,
        )
        fruits.forEach((fruit) => {
          cy.contains('#fruits li', fruit)
        })
        
        // TIP: you can also verify that all fruits are unique
        const unique = Cypress._.uniq(fruits)
        expect(
          unique.length,
          'all fruits are unique',
        ).to.equal(fruits.length)
      }
    })
})

it('shows zero fruits', () => {
  // instead of reloading the page and sometimes (very rarely)
  // getting zero fruits returned
  // let's stub the response from the server
  // https://on.cypress.io/intercept
  cy.intercept('GET', '/fruits', [])
  // then visit the page /fruits.html
  // https://on.cypress.io/visit
  cy.visit('/fruits.html')
  // confirm there are no fruits
  // https://on.cypress.io/contains
  cy.contains('#fruits', 'No fruits')
})

it('shows two fruits', () => {
  // let's stub the response from the server
  // and return two fruits: apples and kiwi
  // https://on.cypress.io/intercept
  cy.intercept('GET', '/fruits', ['apples', 'kiwi'])
  // then visit the page /fruits.html
  // https://on.cypress.io/visit
  cy.visit('/fruits.html')
  // confirm there are two fruits
  cy.get('#fruits li').should('have.length', 2)
  // https://on.cypress.io/contains
  cy.contains('#fruits', 'apples')
  cy.contains('#fruits', 'kiwi')
})