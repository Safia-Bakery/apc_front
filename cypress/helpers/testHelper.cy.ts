import { Sphere, baseUrl, developer, user } from ".";

export const login = () => {
  cy.visit(baseUrl + "/login");
  cy.get("input[name=username]").type(user.login);
  cy.get("input[name=password]").type(`${user.password}{enter}`);
  cy.get("h4").should("contain", "Добро пожаловать cypress testing");
  cy.get("p").should("contain", "cypress");
};

export const loginDevelop = () => {
  cy.visit(baseUrl + "/login");
  cy.get("input[name=username]").type(developer.login);
  cy.get("input[name=password]").type(`${developer.password}{enter}`);
  cy.get("h4").should("contain", "Добро пожаловать Nurmuhammad");
  cy.get("p").should("contain", "test");
};

export const createRequest = ({
  url,
  sphere,
}: {
  url: string;
  sphere?: Sphere;
}) => {
  cy.visit(baseUrl + url);
  cy.get("label")
    .contains("ФИЛИАЛ")
    .siblings()
    .click()
    .get(".list-group-item")
    .first()
    .click();

  cy.get("select[name=category_id]").select(1);
  {
    sphere === Sphere.apc && cy.get("input[name=product]").type("testProduct");
  }
  cy.get("textarea[name=description]").type(
    "test description This is a 60-character message123456789 0123456789 0123456789012 3456789012 34567890"
  );
  cy.get("input[id=fileUploader]").selectFile([
    "public/assets/images/safia.png",
    "public/assets/images/bg.JPG",
  ]);

  cy.get('button[type="submit"]').click();
};

export const checkInput = ({
  values,
  check,
}: {
  values: number[];
  check: boolean;
}) => {
  values.map((item) => {
    if (check) cy.get(`input[value=${item}]`).check();
    else cy.get(`input[value=${item}]`).uncheck();
  });
};
