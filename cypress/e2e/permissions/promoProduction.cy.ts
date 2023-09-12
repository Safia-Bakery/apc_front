import { Sphere, baseUrl } from "cypress/helpers";
import {
  checkInput,
  createRequest,
  login,
  loginDevelop,
} from "cypress/helpers/testHelper.cy";

describe("Promo Production Marketing", () => {
  beforeEach("login", () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    login();
  });

  it("Promo Production requests", () => {
    cy.visit(baseUrl + "/roles/14");
    checkInput({ values: [33, 34, 45], check: false });
    checkInput({ values: [35, 36, 43], check: true });
    cy.get("#save_permission").click();
    cy.get("div").should("contain", "successfully updated").should("exist");
    cy.get("#logout_btn").click();

    loginDevelop();
    createRequest({
      url: "/marketing-promo_production/add?add=43&edit=36&sub_id=3",
      sphere: Sphere.marketing,
    });

    cy.url().should("contain", "marketing-promo_production");
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
