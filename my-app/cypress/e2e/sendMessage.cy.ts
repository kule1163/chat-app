/// <reference types="cypress" />
import {
  chatMd,
  deleteMessageOne,
  deleteMessageThree,
  deleteMessageTwo,
  email,
  fullName,
  height,
  password,
  testDeleteEmail,
  testDeleteFullName,
  testOneEmail,
  testOneFullName,
  testTwoEmail,
  testTwoFullName,
} from "./veriables";

describe("send message", () => {
  it("succesfully send message from search", () => {
    cy.addToChat({ searchValue: testOneFullName, email });
    cy.getByInputName("message").type("test message 1");
    cy.get(".form").submit();
    cy.getByInputName("message").should("have.value", "");
    cy.getByDataTestId("logout").click();
  });
  it("succesfully send message < md", () => {
    cy.viewport(chatMd, height);
    cy.addToChat({ searchValue: testTwoFullName, email });
    cy.sendMessage({ fullName: testTwoFullName });
    cy.getByDataTestId("back-icon").click();
    cy.sendMessage({ fullName: testOneFullName });
    cy.getByDataTestId("logout").click();
  });
  it("succesfully send message > md and latest message", () => {
    cy.viewport(1200, height);
    cy.login({ email, password });
    cy.sendMessage({ fullName: testOneFullName });
    cy.getByDataTestId("logout").click();
    cy.login({ email: testOneEmail, password });
    cy.getByDataTestId("test message 1").should("be.visible");
    cy.getByDataTestId("logout").click();
  });
  it("delete chat", () => {
    //add to chat (admin)
    cy.viewport(1200, height);
    cy.addToChat({ email, searchValue: testDeleteEmail });
    cy.sendMessage({ message: deleteMessageOne });
    cy.getByDataTestId("logout").click();
    cy.login({ email: testDeleteEmail, password });
    cy.sendMessage({ fullName, message: deleteMessageTwo });
    cy.deleteChat(fullName);
    cy.addToChat({ searchValue: email });
    cy.getByDataTestId("latest-message").should("not.exist");
    /* cy.deleteChat(fullName); */
    cy.getByDataTestId("logout").click();
    //
    cy.login({ email, password });
    cy.sendMessage({
      fullName: testDeleteFullName,
      message: deleteMessageThree,
    });
    cy.getByDataTestId(deleteMessageTwo).should("be.visible");
    /* cy.deleteChat(testDeleteFullName); */
    cy.getByDataTestId("logout").click();
    cy.login({ email: testDeleteEmail, password });
    cy.contains(fullName).click();
    cy.getByDataTestId(deleteMessageOne).should("not.exist");
    /*  cy.deleteChat(fullName); */
    cy.getByDataTestId("logout").click();
  });
  /* it("features box", () => {
    cy.addToChat({ searchValue: testOneEmail, email });
    cy.getByDataTestId("features-icon").click();
    cy.contains(testOneFullName).should("be.visible");
    cy.getByDataTestId("close").click();
    cy.getByDataTestId("logout").click();
  }); */
  it("all edit group test successfully time to delete", () => {
    cy.clearCreated({ clearName: fullName, email: testOneEmail });
    cy.clearCreated({ clearName: fullName, email: testTwoEmail });
    cy.clearCreated({ clearName: fullName, email: testDeleteEmail });
    cy.clearCreatedMultible({
      clearNames: [testOneFullName, testTwoFullName, testDeleteFullName],
      email,
    });
  });
});
