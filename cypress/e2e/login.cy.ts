/// <reference types="cypress" />
import { baseUrl, user } from "../helpers";

describe("Login", () => {
  it("should load the app", () => {
    cy.visit(baseUrl + "/login");
    cy.get("input[name=username]").type(user.login);
    cy.get("input[name=password]").type(`${user.password}{enter}`);
    cy.get("h4").should("contain", "Добро пожаловать cypress testing");
    cy.get("p").should("contain", "cypress");
  });

  it("should show an error message with invalid credentials", () => {
    // Visit the login page or route
    cy.visit(baseUrl + "/login"); // Replace with the actual route

    // Interact with login form elements and submit with invalid credentials
    cy.get('input[name="username"]').type("invalid-username");
    cy.get('input[name="password"]').type("invalid-password");
    cy.get('button[type="submit"]').click();

    // Assert that an error message is displayed
    cy.get("p").should("contain", "Неправильное имя пользователя или пароль.");
  });
});
