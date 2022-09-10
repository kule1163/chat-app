/// <reference types="cypress" />

import {
  email,
  fullName,
  password,
  testOneEmail,
  notificationMessage,
  testTwoEmail,
  testTwoFullName,
  testOneFullName,
} from "./veriables";

describe("notifications", () => {
  it("from single user", () => {
    cy.addToChat({ searchValue: testOneEmail, email });
    cy.sendMessage({ message: notificationMessage });
    cy.getByDataTestId("logout").click();
    cy.login({ email: testOneEmail, password });
    cy.get(".MuiBadge-badge").should("have.text", "1");
    cy.get(".ghost-box").trigger("mouseover");
    cy.getByDataTestId(`noti-${fullName}`).click();
    cy.get(".MuiBadge-badge").should("not.be.visible");
    cy.getByDataTestId(notificationMessage).should("be.visible");
  });
  it("from multible user", () => {
    cy.addToChat({ searchValue: testOneEmail, email });
    cy.sendMessage({ message: notificationMessage });
    cy.sendMessage({ message: notificationMessage });
    cy.getByDataTestId("logout").click();
    cy.addToChat({ searchValue: testOneEmail, email: testTwoEmail });
    cy.sendMessage({ message: notificationMessage });
    cy.getByDataTestId("logout").click();
    cy.login({ email: testOneEmail, password });
    cy.get(".MuiBadge-badge").should("have.text", "3");
    cy.get(".ghost-box").trigger("mouseover");
    cy.contains(`New Message From ${fullName} 2`);
    cy.contains(`New Message From ${testTwoFullName} 1`);
    cy.getByDataTestId(`noti-${fullName}`).click();
    cy.get(".MuiBadge-badge").should("have.text", "1");
    cy.getByDataTestId(notificationMessage).should("be.visible");
    cy.getByDataTestId("logout").click();
  });
  it("delete chats", () => {
    cy.clearCreated({ clearName: testOneFullName, email });
    cy.clearCreated({ clearName: testOneFullName, email: testTwoEmail });
    cy.clearCreatedMultible({
      clearNames: [fullName, testTwoFullName],
      email: testOneEmail,
    });
  });
});
