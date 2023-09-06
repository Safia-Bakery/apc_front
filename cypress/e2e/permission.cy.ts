import { baseUrl } from "cypress/helpers";
import { checkInput, login, loginDevelop } from "cypress/helpers/testHelper.cy";

describe("Login", () => {
  beforeEach("login", () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    login();
  });

  //   it("fillial permissions", () => {
  //     cy.visit(baseUrl + "/roles/10");
  //     checkInput({ values: [9, 22, 23, 29], check: true });
  //     cy.get("#save_permission").click();
  //     cy.get("div").should("contain", "successfully updated").should("exist");
  //     cy.get("#logout_btn").click();
  //     loginDevelop();
  //     cy.visit(baseUrl + "/branches");
  //     cy.get("#branch_body").should("exist");
  //     cy.get("#add_branch").click();
  //     cy.get("h2").should("contain", "Добавить");
  //     cy.visit(baseUrl + "/branches");
  //     cy.get("#edit_item").click();
  //     cy.get("h2").should("contain", "Изменить филиал");
  //   });

  //   it("request APC retail permissions", () => {
  //     cy.visit(baseUrl + "/roles/10");
  //     checkInput({ values: [9, 22, 23, 29], check: false });
  //     checkInput({ values: [12, 24, 25, 26, 27, 28, 46, 47, 48], check: true });
  //     cy.get("#save_permission").click();
  //     cy.get("div").should("contain", "successfully updated").should("exist");
  //     cy.get("#logout_btn").click();

  //     loginDevelop();
  //     cy.visit(baseUrl + "/requests-apc-retail?sphere_status=1&addExp=28");
  //     cy.get("#requests_body").should("exist");
  //     cy.get("#add_request").click();
  //     cy.get("h2").should("contain", "Создать заказ");
  //     cy.url().should("include", "requests-apc-retail");
  //     cy.visit(baseUrl + "/requests-apc-retail?sphere_status=1&addExp=28");
  //     cy.get("#request_id").first().click();
  //     cy.get("h2").should("contain", "Заказ №");
  //     cy.get("#assign").should("exist").click();
  //     cy.get("#attach_to_bridaga").should("exist");

  //     cy.visit(baseUrl + "/categories-apc-retail");
  //     cy.get("#add_category").click();
  //     cy.get("h2").should("contain", "Добавить");
  //     cy.url().should("include", "categories-apc-retail");
  //     cy.visit(baseUrl + "/categories-apc-retail");
  //     cy.get("#edit_item").first().click();
  //     cy.get("h2").should("contain", "Изменить категорие №");
  //   });

  //   it("marketing designers requests", () => {
  //     cy.visit(baseUrl + "/roles/10");
  //     checkInput({ values: [12, 24, 25, 26, 27, 28, 46, 47, 48], check: false });
  //     checkInput({ values: [31, 32, 44], check: true });
  //     cy.get("#save_permission").click();
  //     cy.get("div").should("contain", "successfully updated").should("exist");
  //     cy.get("#logout_btn").click();

  //     loginDevelop();
  //     cy.visit(baseUrl + "/marketing-designers?add=44&edit=32&sub_id=1");
  //     // cy.get("#requests_body").should("exist");
  //     cy.get("#add_request").click();
  //     cy.get("h2").should("contain", "Создать заказ");
  //     cy.url().should("include", "marketing-designers/add?sub_id=1");
  //     cy.visit(baseUrl + "/marketing-designers?add=44&edit=32&sub_id=1");
  //     cy.get("#request_id").first().click();
  //     cy.get("h2").should("contain", "Заказ №");
  //   });

  //   it("local marketing requests", () => {
  //     cy.visit(baseUrl + "/roles/10");

  //     checkInput({ values: [31, 32, 44], check: false });
  //     checkInput({ values: [33, 34, 45], check: true });
  //     cy.get("#save_permission").click();
  //     cy.get("div").should("contain", "successfully updated").should("exist");
  //     cy.get("#logout_btn").click();

  //     loginDevelop();
  //     cy.visit(baseUrl + "/marketing-local_marketing?add=45&edit=34&sub_id=2");
  //     cy.get("#add_request").click();
  //     cy.get("h2").should("contain", "Создать заказ");
  //     cy.url().should("include", "/marketing-local_marketing");
  //     cy.visit(baseUrl + "/marketing-local_marketing?add=45&edit=34&sub_id=2");
  //     cy.get("#request_id").first().click();
  //     cy.get("h2").should("contain", "Заказ №");
  //   });
  //   it("Promo production requests", () => {
  //     cy.visit(baseUrl + "/roles/10");
  //     checkInput({ values: [33, 34, 45], check: false });
  //     checkInput({ values: [35, 36, 43], check: true });
  //     cy.get("#save_permission").click();
  //     cy.get("div").should("contain", "successfully updated").should("exist");
  //     cy.get("#logout_btn").click();

  //     loginDevelop();
  //     cy.visit(baseUrl + "/marketing-promo_production?add=43&edit=36&sub_id=3");
  //     cy.get("#add_request").click();
  //     cy.get("h2").should("contain", "Создать заказ");
  //     cy.url().should("include", "marketing-promo_production");
  //     cy.visit(baseUrl + "/marketing-promo_production?add=43&edit=36&sub_id=3");
  //     cy.get("#request_id").first().click();
  //     cy.get("h2").should("contain", "Заказ №");
  //   });
  //   it("Pos materials requests", () => {
  //     cy.visit(baseUrl + "/roles/10");
  //     checkInput({ values: [35, 36, 43], check: false });
  //     checkInput({ values: [37, 38, 42], check: true });
  //     cy.get("#save_permission").click();
  //     cy.get("div").should("contain", "successfully updated").should("exist");
  //     cy.get("#logout_btn").click();

  //     loginDevelop();
  //     cy.visit(baseUrl + "/marketing-pos?add=42&edit=38&sub_id=4");
  //     cy.get("#add_request").click();
  //     cy.get("h2").should("contain", "Создать заказ");
  //     cy.url().should("include", "marketing-pos");
  //     cy.visit(baseUrl + "/marketing-pos?add=42&edit=38&sub_id=4");
  //     cy.get("#request_id").first().click();
  //     cy.get("h2").should("contain", "Заказ №");
  //   });
  //   it("Pos materials requests", () => {
  //     cy.visit(baseUrl + "/roles/10");
  //     checkInput({ values: [37, 38, 42], check: false });
  //     checkInput({ values: [39, 40, 41], check: true });
  //     cy.get("#save_permission").click();
  //     cy.get("div").should("contain", "successfully updated").should("exist");
  //     cy.get("#logout_btn").click();

  //     loginDevelop();
  //     cy.visit(baseUrl + "/marketing-complects?add=41&edit=40&sub_id=5");
  //     cy.get("#add_request").click();
  //     cy.get("h2").should("contain", "Создать заказ");
  //     cy.url().should("include", "marketing-complects");
  //     cy.visit(baseUrl + "/marketing-complects?add=41&edit=40&sub_id=5");
  //     cy.get("#request_id").first().click();
  //     cy.get("h2").should("contain", "Заказ №");
  //   });

  //   it("comments permission", () => {
  //     cy.visit(baseUrl + "/roles/10");
  //     checkInput({ values: [39, 40, 41], check: false });
  //     checkInput({ values: [1], check: true });
  //     cy.get("#save_permission").click();
  //     cy.get("div").should("contain", "successfully updated").should("exist");
  //     cy.get("#logout_btn").click();

  //     loginDevelop();
  //     cy.visit(baseUrl + "/comments");
  //     cy.get("h2").should("contain", "Отзывы");
  //   });

  it("Brigades permisions", () => {
    //brigades?sphere_status=1
    cy.visit(baseUrl + "/roles/10");
    checkInput({ values: [1], check: false });
    checkInput({ values: [3, 16, 17], check: true });
    cy.get("#save_permission").click();
    cy.get("div").should("contain", "successfully updated").should("exist");
    cy.get("#logout_btn").click();

    loginDevelop();
    cy.visit(baseUrl + "/brigades?sphere_status=1");
    cy.get("#add_master").click();
    cy.get("h2").should("contain", "Добавить");
    cy.url().should("include", "brigades/add?sphere_status=1");
    cy.visit(baseUrl + "/brigades?sphere_status=1");
    cy.get("#edit_item").first().click();
    cy.get("h2").should("contain", "Изменить бригада №");

    cy.get("label")
      .contains("Выберите бригадира")
      .siblings("select")
      .find("option")
      .each(($option) => {
        const value = $option.val();
        expect(value).exist;
      });
  });
});
