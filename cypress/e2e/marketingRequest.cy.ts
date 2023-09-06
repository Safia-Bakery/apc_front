import { Sphere, baseUrl } from "cypress/helpers";
import { createRequest, login } from "../helpers/testHelper.cy";

describe("APC retail", () => {
  beforeEach("login", () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    login();
  });
  it("create designers request", () => {
    createRequest({
      url: "/marketing-designers/add?sub_id=1&add=44&edit=32",
      sphere: Sphere.marketing,
    });

    cy.visit(baseUrl + "/marketing-designers?add=44&edit=32&sub_id=1");
    cy.get("td")
      .should("contain", "cypress testing")
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
