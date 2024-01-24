Cypress.Commands.add("fillMandatoryFieldsAndSubmit", function () {
  cy.get("#firstName").type("João Vitor");
  cy.get("#lastName").type("Guimarães");
  cy.get("#email").type("contato@joaoguimaraes.com.br");
  cy.get("#open-text-area").type("Teste");
  cy.get('button[type="submit"]').click();
});
