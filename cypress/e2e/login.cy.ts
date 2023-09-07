import { baseUrl } from "cypress/helpers";
import { login } from "cypress/helpers/testHelper.cy";

describe("Login", () => {
  it("should load the app", () => {
    login();
  });

  it("should show an error message with invalid credentials", () => {
    cy.visit("/login");

    cy.get('input[name="username"]').type("invalid-username");
    cy.get('input[name="password"]').type("invalid-password");
    cy.get('button[type="submit"]').click();
    cy.get("p").should("contain", "Неправильное имя пользователя или пароль.");
  });
});
