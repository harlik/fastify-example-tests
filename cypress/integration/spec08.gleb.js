// import the fixture JSON data from the file "../fixtures/apple.json"
import { fruit } from '../fixtures/apple.json'

it('imports the fixture from JSON file', () => {
  // print the imported fruit to the Command Log
  cy.log(`fruit: **${fruit}**`)
  // intercept the GET call to /fruit with fixture "apple.json"
  cy.intercept('GET', '/fruit', { fixture: 'apple.json' })
  // visit the site
  cy.visit('/')
  // confirm the fruit from the fixture is shown on the page
  cy.contains('#fruit', fruit)
})