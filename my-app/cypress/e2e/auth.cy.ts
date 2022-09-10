/// <reference types="cypress" />
import { chat, email, fullName, password } from "./veriables";

describe("auth", () => {
  describe("test register", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.getByInputName("fullName").type(fullName);
      cy.getByInputName("email").type(email);
      cy.getByInputName("password").type(password);
      cy.getByInputName("password2").type(password);
      cy.getSubmitButton().click();
    });

    it("succesfully register", () => {
      cy.url().should("include", chat);
    });

    it("user already taken", () => {
      cy.contains("user already exist").should("be.visible");
    });
  });

  describe("login", () => {
    it("succesfully login", () => {
      cy.login({ email, password });
      cy.url().should("include", chat);
    });

    it("invalid user", () => {
      cy.visit("/login");
      cy.getByInputName("email").type(`${email}`);
      cy.getByInputName("password").type("1998");
      cy.getSubmitButton().click();
      cy.contains("invalid user").should("be.visible");
    });
  });

  describe("logout", () => {
    it("succesfully logout", () => {
      cy.login({ email, password });
      cy.getByDataTestId("logout").click();
      cy.url().should("include", "/login");
    });
  });
});
