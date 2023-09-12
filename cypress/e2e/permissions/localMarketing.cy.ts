import { Sphere, baseUrl } from "cypress/helpers";
import {
  checkInput,
  createRequest,
  login,
  loginDevelop,
} from "cypress/helpers/testHelper.cy";

describe("Local Marketing", () => {
  beforeEach("login", () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    login();
  });

  it("marketing designers requests", () => {
    cy.visit(baseUrl + "/roles/14");
    checkInput({ values: [31, 32, 44], check: false });
    checkInput({ values: [33, 34, 45], check: true });
    cy.get("#save_permission").click();
    cy.get("div").should("contain", "successfully updated").should("exist");
    cy.get("#logout_btn").click();

    loginDevelop();
    createRequest({
      url: "/marketing-local_marketing/add?add=45&edit=34&sub_id=2",
      sphere: Sphere.marketing,
    });

    cy.url().should("contain", "marketing-local_marketing");
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
  });
});
