/// <reference types="cypress" />
describe('waiting for several network requests to finish', function() {
  it('handles intercepted requests using .then', () => {
    // intercept the GET / call to the server
    // and give it an alias "doc"
    // https://on.cypress.io/intercept
    // intercept the GET /fruit and give it an alias "fruit"
    cy.intercept('GET', '/')
      .as('doc');
    cy.intercept('GET', '/fruit')
      .as('fruit');
    // freeze the application clock so we can fast-forward it later
    // https://on.cypress.io/clock
    cy.clock();
    // visit the page "/"
    // https://on.cypress.io/visit
    cy.visit('/');
    // the visit will trigger a few network requests
    // but we want to cause another /fruit call
    // which we can do by advancing the application clock
    // by 1 minute using https://on.cypress.io/tick
    cy.tick(60_000);
    // wait for 3 network requests to finish
    // using a single https://on.cypress.io/wait command
    // Tip: pass an array of aliases to wait for
    // The aliases should be:
    // 1 - the document request
    // 2, 3 - the fruit requests
    cy.wait(['@doc', '@fruit', '@fruit'])
    // get an array of interceptions in a "then" callback
      .then( interceptions => {
        let interceptedFruits = new Set();
        interceptions.forEach( interception => {
        // confirm some properties of the intercepted responses
        // like the successful status code
          expect(interception.response.statusCode).to.be.within(200, 299);
        // confirm the two intercepted fruits
        // are different from each other
          if (interception.response.body.fruit) {
            interceptedFruits.add(interception.response.body.fruit);
          }
        })
        expect(interceptedFruits.size).equal(2);
      })
  })
  
  it('handles intercepted requests using .spread', () => {
    // intercept the GET / call to the server
    // and give it an alias "doc"
    // https://on.cypress.io/intercept
    // intercept the GET /fruit and give it an alias "fruit"
    cy.intercept('GET', '/')
      .as('doc');
    cy.intercept('GET', '/fruit')
      .as('fruit');
    // freeze the application clock so we can fast-forward it later
    // https://on.cypress.io/clock
    cy.clock();
    // visit the page "/"
    // https://on.cypress.io/visit
    cy.visit('/');
    // the visit will trigger a few network requests
    // but we want to cause another /fruit call
    // which we can do by advancing the application clock
    // by 1 minute using https://on.cypress.io/tick
    cy.tick(60_000);
    // wait for 3 network requests to finish
    // using a single https://on.cypress.io/wait command
    // Tip: pass an array of aliases to wait for
    // The aliases should be:
    // 1 - the document request
    // 2, 3 - the fruit requests
    cy.wait(['@doc', '@fruit', '@fruit'])
    // use cy.spread to get the separate 3 intercepts
    // https://on.cypress.io/spread
      .spread( (doc, fruit1, fruit2) => {
        // confirm some properties of the intercepted responses
        // like the successful status code
          [doc, fruit1, fruit2].forEach( interception => {
            expect(interception.response.statusCode).to.be.within(200, 299)
          })
        // confirm the two intercepted fruits
        // are different from each other
          expect(fruit1.response.body.fruit)
            .not.equal(fruit2.response.body.fruit);
      })
  })  
})
