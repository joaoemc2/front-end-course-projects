/// <reference types="Cypress" />

describe("Central de Atendimento ao Cliente TAT", function () {
  // roda antes de cada teste
  beforeEach(function () {
    cy.visit("./src/index.html");
  });

  it.only("verifica o título da aplicação", function () {
    // resultado esperado
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });

  it("preenche os campos obrigatórios e envia o formulário", function () {
    const lorenIpsum =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam pellentesque ut ante at tempus. Etiam hendrerit ac neque ac efficitur. Sed scelerisque metus quis enim vehicula finibus. Nullam ac dolor semper ex suscipit egestas. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam dignissim massa dolor. Pellentesque purus libero, cursus lobortis est quis, malesuada aliquet lectus. Nullam in vestibulum ligula, nec vehicula leo. Morbi dictum dui tincidunt erat feugiat, at eleifend tortor accumsan. Morbi nulla neque, bibendum ac interdum ac, maximus cursus tortor. Morbi leo eros, scelerisque elementum vulputate at, imperdiet at elit. Donec ultrices.";

    cy.get("#firstName").type("João Vitor");
    cy.get("#lastName").type("Guimarães");
    cy.get("#email").type("contato@joaoguimaraes.com.br");
    cy.get("#open-text-area").type(lorenIpsum, { delay: 0 });
    cy.get('button[type="submit"]').click();
    // resultado esperado
    cy.get(".success").should("be.visible");
  });

  it("exibe mensagem de erro ao submeter o formulário com um email invalido", function () {
    cy.get("#firstName").type("João Vitor");
    cy.get("#lastName").type("Guimarães");
    cy.get("#email").type("contato@joaoguimaraes,com,br");
    cy.get("#open-text-area").type("Teste");
    cy.get('button[type="submit"]').click();
    // resultado esperado
    cy.get(".error").should("be.visible");
  });

  it("campo de telefone continua vazio quando preenchido com valor não-numérico", () => {
    cy.get("#phone").type("asd").should("have.value", "");
  });

  it("exibe mensagem de erro quando o telefone se torna obrigatório mais não é preenchido", () => {
    cy.get("#firstName").type("João Vitor");
    cy.get("#lastName").type("Guimarães");
    cy.get("#email").type("contato@joaoguimaraes.com.br");
    cy.get("#phone-checkbox").check();
    cy.get("#open-text-area").type("Teste");
    cy.get('button[type="submit"]').click();
    // resultado esperado
    cy.get(".error").should("be.visible");
  });

  it("preenche e limpa os campos nome, sobrenome, email e telefone", () => {
    cy.get("#firstName")
      .type("João Vitor")
      .should("have.value", "João Vitor")
      .clear()
      .should("have.value", "");
    cy.get("#lastName")
      .type("Guimarães")
      .should("have.value", "Guimarães")
      .clear()
      .should("have.value", "");
    cy.get("#email")
      .type("contato@joaoguimaraes.com.br")
      .should("have.value", "contato@joaoguimaraes.com.br")
      .clear()
      .should("have.value", "");
    cy.get("#open-text-area")
      .type("Teste")
      .should("have.value", "Teste")
      .clear()
      .should("have.value", "");
  });

  it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", function () {
    cy.get('button[type="submit"]').click();
    cy.get(".error").should("be.visible");
  });

  it("envia o formulário com sucesso usando um comando customizado", () => {
    cy.fillMandatoryFieldsAndSubmit();
    // resultado esperado
    cy.get(".success").should("be.visible");
  });

  it("envia o formulário utilizando o cy.contains", () => {
    cy.get("#firstName").type("João Vitor");
    cy.get("#lastName").type("Guimarães");
    cy.get("#email").type("contato@joaoguimaraes.com.br");
    cy.get("#open-text-area").type("Teste");
    cy.contains("button", "Enviar").click();
    // resultado esperado
    cy.get(".success").should("be.visible");
  });

  // INPUTS DE LISTA FLUTUANTE

  it("seleciona um produto (YouTube) por seu texto", function () {
    cy.get("#product").select("YouTube").should("have.value", "youtube");
  });

  it("seleciona um produto (Mentoria) por seu valor (value)", function () {
    cy.get("#product").select("mentoria").should("have.value", "mentoria");
  });

  it("seleciona um produto (Blog) por seu índice", function () {
    cy.get("#product").select(1).should("have.value", "blog");
  });

  it("marca o tipo de atendimento 'Feedback'", () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should("have.value", "feedback");
  });

  it("marca cada tipo de atendimento", () => {
    cy.get('input[type="radio"]')
      .should("have.length", 3)
      .each(($radio) => {
        cy.wrap($radio).check();
        cy.wrap($radio).should("be.checked");
      });
  });

  it("marca ambos checkboxes, depois desmarca o ultimo", () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should("be.checked")
      .last()
      .uncheck()
      .should("not.be.checked");
  });

  //UPLOAD DE ARQUIVOS COM O CYPRESS

  it("seleciona um arquivo das pasta fixtures", () => {
    cy.get("#file-upload")
      .should("not.have.value")
      .selectFile("./cypress/fixtures/example.json")
      .should(($input) => {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo das pasta fixtures 2", () => {
    cy.get("#file-upload")
      .should("not.have.value")
      .selectFile("./cypress/fixtures/example.json", { action: "drag-drop" })
      .should(($input) => {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", function () {
    cy.fixture("example.json").as("exempleFile");
    cy.get("#file-upload")
      .selectFile("@exempleFile")
      .should(($input) => {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  //LINKS EXTERNOS

  it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", () => {
    cy.get("#privacy a").should("have.attr", "target", "_blank");
  });

  it("acessa a pagina de politica de privacidade removendo o target e então clica no link", () => {
    cy.get("#privacy a").invoke("removeAttr", "target").click();
    cy.contains("Talking About Testing").should("be.visible");
  });

  it("testa a página da política de privacidade de forma independente", () => {
    cy.visit("./src/privacy.html");
    cy.contains("Talking About Testing").should("be.visible");
  });

  it("faz uma requisição HTTP", function () {
    cy.request(
      "https://cac-tat.s3.eu-central-1.amazonaws.com/index.html"
    ).should(function (response) {
      const { status, statusText, body } = response;
      expect(status).to.equal(200);
      expect(statusText).to.equal("OK");
      expect(body).include("CAC TAT");
    });
  });

  it("encontrando o gato", function () {
    cy.get("#cat").invoke("show").should("be.visible");
    cy.get("#title").invoke("text", "CAT TAT");
  });
});
