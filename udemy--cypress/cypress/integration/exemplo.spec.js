/// <reference types="Cypress" />

describe("Central de Atendimento ao Cliente TAT", function () {
  // roda antes de cada teste
  beforeEach(function () {
    cy.visit("./src/index.html");
  });

  it("faz uma requisição HTTP", function () {
    cy.request(
      "https://cac-tat.s3.eu-central-1.amazonaws.com/index.html"
    ).should(function (response) {
      const { status, statusText, body } = response;
      expect(status).to.equal(501);
      expect(statusText).to.equal("OK");
      expect(body).include("CAC TAT");
    });
  });
});
