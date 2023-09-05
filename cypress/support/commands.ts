import { baseUrl, user } from "cypress/helpers";

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): void;
    }
  }
}

Cypress.Commands.add(`${baseUrl}/login"`, () => {
  cy.visit("/login");
  cy.get("input[name=username]").type(user.login);
  cy.get("input[name=password]").type(`${user.password}{enter}`);
  cy.get("button[type='submit']").click();
});
