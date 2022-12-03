/// <reference types="cypress" />

it('reloads the page until it shows Bananas', () => {
  cy.intercept('GET', '/fruit')
    .as('fruit');
    
  function findBanana() {
    cy.visit('/');
    cy.wait('@fruit');
    cy.get('#fruit')
      .should('not.contain.text', 'loading')
      .invoke('text')
      .as('fruitText')
      .then(fruitText => {
        cy.log(fruitText);
        if (fruitText === 'Bananas') 
          expect(fruitText).to.be.equal('Bananas');
        else
          findBanana();
      })
  }

  findBanana();
})
