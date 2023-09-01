import { user } from "../helpers";

describe("Login", () => {
  it("should load the app", () => {
    cy.visit("http://localhost:5173/login");
    cy.get("input[name=username]").type(user.login);
    cy.get("input[name=password]").type(`${user.password}{enter}`);
    cy.get("h4").should("contain", "Добро пожаловать cypress testing");
    cy.get("p").should("contain", "test69");
  });
});
