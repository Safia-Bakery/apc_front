import { Sphere, baseUrl } from "cypress/helpers";
import {
  checkInput,
  createRequest,
  login,
  loginDevelop,
} from "cypress/helpers/testHelper.cy";

describe("Marketing Designers", () => {
  beforeEach("login", () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    login();
  });

  it("marketing designers requests", () => {
    cy.visit(baseUrl + "/roles/10");
    checkInput({ values: [12, 24, 25, 26, 27, 28, 46, 47, 48], check: false });
    checkInput({ values: [31, 32, 44, 29, 6, 20, 21], check: true });
    cy.get("#save_permission").click();
    cy.get("div").should("contain", "successfully updated").should("exist");
    cy.get("#logout_btn").click();

    loginDevelop();

    createRequest({
      url: "/marketing-designers/add?sub_id=1&add=44&edit=32",
      sphere: Sphere.marketing,
    });

    cy.url().should("contain", "marketing-designers");
    cy.get("td")
      .contains("Nurmuhammad")
      .parent()
      .siblings("td")
      .should("contain", "Новый")
      .siblings("td")
      .children("#request_id")
      .first()
      .click();
    cy.get("#recieve_request").click();
    cy.get("p").should("contain", "Статус: Принят");
    cy.get("#finish_request").click();
    cy.get("p").should("contain", "Статус: Закончен");

    cy.visit(baseUrl + "/categories-marketing");
    cy.get("#add_category").click();
    cy.get("select[name=sub_id]").select(1);
    cy.get("input[name=name]").type("cypress designers");
    cy.get("input[name=urgent]").check();
    cy.get("input[name=status]").check();
    cy.get("button[type=submit]").click();
    cy.url().should("equal", baseUrl + "/categories-marketing");
  });
});
