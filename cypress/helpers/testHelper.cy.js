import { baseUrl, user } from ".";

export const login = () => {
  cy.visit(baseUrl + "/login");
  cy.get("input[name=username]").type(user.login);
  cy.get("input[name=password]").type(`${user.password}{enter}`);
  cy.get("h4").should("contain", "Добро пожаловать cypress testing");
  cy.get("p").should("contain", "cypress");
};
