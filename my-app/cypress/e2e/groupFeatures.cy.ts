/// <reference types="cypress"/>

import {
  height,
  password,
  testCreateGroupName,
  testEditedGroupName,
  testGroupUsers,
  testOneEmail,
  testThereeEmail,
  testThereeFullName,
  testTwoEmail,
  email,
  width,
  firstGroupMessage,
  secondGroupMessage,
  testTwoFullName,
} from "./veriables";

describe("group features", () => {
  beforeEach(() => {
    cy.viewport(width, height);
  });
  describe("create new group", () => {
    it("absent user", () => {
      cy.createGroup({
        groupName: testCreateGroupName,
        users: [testOneEmail],
      });
      cy.contains("* more than 1 users required to group chat").should(
        "be.visible"
      );
    });
    it("absent title", () => {
      cy.createGroup({
        groupName: null,
        users: testGroupUsers,
      });
      cy.contains("*chatName is a required field").should("be.visible");
    });
    it("succesfully created group", () => {
      cy.createGroup({
        groupName: testCreateGroupName,
        users: testGroupUsers,
      });
      cy.contains(testCreateGroupName).should("be.visible");
      cy.contains(testCreateGroupName).click();
      cy.getByDataTestId("features-icon").click();
      cy.contains(`${email}-remove`).should("not.exist");
      cy.getByDataTestId("close-box-icon").click();
    });
    it("send group message", () => {
      cy.sendMessage({
        fullName: testCreateGroupName,
        message: firstGroupMessage,
      });
    });
    it("admin skills", () => {
      //chechk for admin
      cy.getByDataTestId("features-icon").click();
      cy.get(".admin-skills-box").should("be.visible");
      cy.getByDataTestId(`${testOneEmail}-remove`).should("be.visible");
      cy.getByDataTestId("logout").click();
      //chechk for member
      cy.login({ email: testOneEmail, password });
      cy.contains(testCreateGroupName).click();
      cy.getByDataTestId("features-icon").click();
      cy.get(".admin-skills-box").should("not.exist");
      cy.getByDataTestId(`${email}-remove`).should("not.exist");
      cy.getByDataTestId("logout").click();
    });
    it("all create new group test successfully time to delete", () => {
      cy.clearCreated({ clearName: testCreateGroupName, email });
      cy.clearCreated({ clearName: testCreateGroupName, email: testOneEmail });
      cy.clearCreated({ clearName: testCreateGroupName, email: testTwoEmail });
    });
  });
  describe("edit group chat", () => {
    it("change group title", () => {
      cy.editGroup({ groupName: testEditedGroupName });
      cy.contains(testEditedGroupName).should("be.visible");
    });
    it("add user", () => {
      cy.addToGroup(testThereeEmail);
      cy.getByDataTestId("add-user-button").click();
      cy.getByDataTestId("close-box-icon").click();
      cy.sendMessage({
        fullName: testEditedGroupName,
        message: firstGroupMessage,
      });
      cy.getByDataTestId("logout").click();
      //check add user (testTheree)
      cy.login({ email: testThereeEmail, password });
      cy.get(".MuiBadge-badge").should("have.text", "1");
      cy.contains(testEditedGroupName).click();
      cy.get(".MuiBadge-badge").should("not.be.visible");
      cy.contains(firstGroupMessage).should("be.visible");
      cy.getByInputName("message").should("be.visible");
      cy.getByDataTestId(firstGroupMessage).should("be.visible");
      cy.getByDataTestId("logout").click();
    });
    it("remove user from group", () => {
      //remove from group (admin)
      cy.login({ email, password });
      cy.contains(testEditedGroupName).click();
      cy.getByDataTestId("features-icon").click();
      cy.getByDataTestId(`${testThereeEmail}-remove`).click();
      cy.getByDataTestId(`${testOneEmail}-remove`).should("not.exist");
      cy.getByDataTestId("close-box-icon").click();
      cy.getByInputName("message").type(secondGroupMessage);
      cy.get(".form").submit();
      cy.getByDataTestId("logout").click();
      //after removed from group (testTheree)
      cy.login({ email: testThereeEmail, password });
      cy.get(".MuiBadge-badge").should("not.be.visible");
      cy.contains(testEditedGroupName).click();
      cy.contains(firstGroupMessage).should("be.visible");
      cy.getByDataTestId("features-icon").should("not.exist");
      cy.contains(secondGroupMessage).should("not.exist");
      cy.getByDataTestId(secondGroupMessage).should("not.exist");
      cy.getByInputName("message").should("not.exist");
      cy.getByDataTestId("logout").click();
    });
    it("leave from chat", () => {
      cy.login({ email: testOneEmail, password });
      cy.contains(testEditedGroupName).click();
      cy.getByDataTestId("features-icon").click();
      cy.getByDataTestId("leave-button").click();
      cy.getByDataTestId(`${testOneEmail}-remove`).should("not.exist");
      cy.getByDataTestId("logout").click();
    });
    it("all edit group test successfully time to delete", () => {
      cy.clearCreated({ clearName: testEditedGroupName, email });
      cy.clearCreated({ clearName: testEditedGroupName, email: testOneEmail });
      cy.clearCreated({ clearName: testEditedGroupName, email: testTwoEmail });
      cy.clearCreated({
        clearName: testEditedGroupName,
        email: testThereeEmail,
      });
    });
  });
});
