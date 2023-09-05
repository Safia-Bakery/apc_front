import { login } from "cypress/helpers/testHelper.cy";
import { baseUrl, user } from "../helpers";
import { requestApcRetail } from "../fixtures/requestApc";

const postRes = {
  product: "testProduct json",
  description: "test description",
  id: 100082,
  rating: null,
  created_at: "2023-09-04T13:10:20.413943",
  status: 0,
  brigada: null,
  file: [
    {
      url: "files/safia.png",
      status: 0,
    },
  ],
  category: {
    name: "Ремонт оборудования",
    description: "тест ",
    status: 1,
    id: 2,
    urgent: false,
    sub_id: null,
    department: 1,
    sphere_status: 1,
  },
  fillial: {
    id: "b12ae70f-0533-4de3-8b5b-1fe7e1286bce",
    name: "0 Лаборатория Инвентарь",
    origin: 0,
    parentfillial: {
      name: "Учтепа фабрика",
    },
  },
  started_at: null,
  finished_at: null,
  user: {
    id: 64,
    username: "cy",
    full_name: "cypress testing",
    email: null,
    phone_number: "998909520009",
    group: {
      name: "cypress",
      id: 12,
    },
    status: 0,
  },
  user_manager: null,
  is_bot: false,
};

describe("APC retail", { testIsolation: false }, () => {
  beforeEach("login", () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    login();
  });
  it("create request", () => {
    cy.visit(baseUrl + "/requests-apc-retail/add?sphere_status=1");
    cy.get("label")
      .contains("ФИЛИАЛ")
      .siblings()
      .click()
      .get(".list-group-item")
      .first()
      .click();

    cy.get("select[name=category_id]").select("2");
    cy.get("input[name=product]").type("testProduct json");
    cy.get("textarea[name=description]").type("test description");
    cy.get("input[id=fileUploader]").selectFile([
      "public/assets/images/safia.png",
    ]);

    cy.intercept("POST", baseUrl + "/request", postRes);

    cy.get('button[type="submit"]').click();

    cy.intercept(
      "GET",
      "**/request?page=1&size=50&department=1&sphere_status=1",
      requestApcRetail
    );
  });
});

//{"success":true,"message":"everything is saved"}
