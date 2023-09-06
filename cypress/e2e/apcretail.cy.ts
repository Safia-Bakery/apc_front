import { Sphere, baseUrl } from "cypress/helpers";
import { createRequest, login } from "../helpers/testHelper.cy";

describe("APC retail", () => {
  beforeEach("login", () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    login();
  });
  it("attach to brigada", () => {
    createRequest({
      url: "/requests-apc-retail/add?sphere_status=1",
      sphere: Sphere.apc,
    });
    cy.visit(baseUrl + "/requests-apc-retail?sphere_status=1&addExp=28");
    cy.get("td")
      .should("contain", "cypress testing")
      .siblings("td")
      .should("contain", "Новый")
      .siblings("td")
      .children("#request_id")
      .first()
      .click();
    cy.get("#assign").click();
    cy.contains("h6", "cypress brigade").siblings("button").click();
    cy.get("p").should("contain", "Статус: Принят");
    cy.get("input[id=fileUploader]").selectFile([
      "public/assets/images/safia.png",
    ]);
    cy.get("#save_report").click();
    cy.get("#photo_report").siblings("td").children().should("exist");
    cy.get("#add_expenditure").click();
    cy.get("#choose_product").click();
    cy.get("#expenditure_list").children("li").should("exist");
    cy.get("#fixed").click({ force: true });
    cy.get("p").should("contain", "Статус: Закончен");
  });
});
