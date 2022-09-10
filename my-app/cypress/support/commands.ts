/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import {
  email,
  password,
  testCreateGroupName,
  testEditedGroupName,
  testGroupUsers,
  testOneEmail,
  testTwoEmail,
} from "../e2e/veriables";
import { User } from "../../../my-app/src/features/types";

interface SendMessageProps {
  fullName?: string;
  message?: string;
}

interface LoginProps {
  email: string;
  password: string;
}

interface RegisterProps extends LoginProps {
  fullName: string;
}

interface CreateGroupProps {
  users: string[];
  groupName?: string | null;
}

interface EditGroupProps {
  users?: string[];
  groupName?: string;
}

interface AddToChatProps {
  searchValue: string;
  email?: string;
}

interface ClearCreatedProps {
  clearName: string;
  email: string;
}

interface ClearCreatedMultibleProps {
  clearNames: string[];
  email: string;
}

declare global {
  namespace Cypress {
    interface Chainable {
      getSubmitButton(): Chainable;
      getByInputName(name: string): Chainable<any>;
      login({ email, password }: LoginProps): Chainable<void>;
      register({ email, password, fullName }: RegisterProps): Chainable<any>;
      sendMessage({ fullName, message }: SendMessageProps): Chainable<any>;
      sendMessageIn(message: string | undefined): Chainable<any>;
      getByDataTestId(dataTestId: string): Chainable<any>;
      addToChat({ searchValue, email }: AddToChatProps): Chainable<any>;
      addToGroup(email: string): Chainable<any>;
      createGroup({ groupName, users }: CreateGroupProps): Chainable<any>;
      editGroup({ groupName, users }: EditGroupProps): Chainable<any>;
      deleteChat(groupName: string): Chainable<any>;
      clearCreated({ clearName, email }: ClearCreatedProps): Chainable<any>;
      clearCreatedMultible({
        clearNames,
        email,
      }: ClearCreatedMultibleProps): Chainable<any>;
    }
  }
}

Cypress.Commands.add("getSubmitButton", () => {
  return cy.get("button[type=submit]");
});

Cypress.Commands.add("getByInputName", (name: string) => {
  return cy.get(`input[name="${name}"]`);
});

Cypress.Commands.add("login", ({ email, password }: LoginProps) => {
  cy.visit("/login");
  cy.getByInputName("email").type(`${email}`);
  cy.getByInputName("password").type(`${password}`);
  cy.getSubmitButton().click();
  cy.url().should("contain", "/chat");
});

Cypress.Commands.add(
  "register",
  ({ email, password, fullName }: RegisterProps) => {
    cy.visit("/");
    cy.getByInputName("fullName").type(`${fullName}`);
    cy.getByInputName("email").type(`${email}`);
    cy.getByInputName("password").type(`${password}`);
    cy.getByInputName("password2").type(`${password}`);
    cy.getSubmitButton().click();
  }
);

Cypress.Commands.add(
  "sendMessage",
  ({ fullName, message }: SendMessageProps) => {
    fullName && cy.contains(`${fullName}`).click({ force: true });
    cy.getByInputName("message").type(message ? message : "test message 1");
    cy.get(".form").submit();
    cy.getByInputName("message").should("have.value", "");
  }
);

Cypress.Commands.add("sendMessageIn", (message: string | undefined) => {
  cy.getByInputName("message").type(message ? message : "test message 1");
  cy.get(".form").submit();
  cy.getByInputName("message").should("have.value", "");
});

Cypress.Commands.add("getByDataTestId", (dataTestId: string) => {
  cy.get(`[data-testid="${dataTestId}"]`);
});

Cypress.Commands.add("addToChat", ({ searchValue, email }: AddToChatProps) => {
  email && cy.login({ email, password });
  cy.getByDataTestId("search-box").click();
  cy.getByInputName("search").type(searchValue);
  cy.getSubmitButton().click();
  cy.contains(searchValue).click({ force: true });
});

Cypress.Commands.add("addToGroup", (email: string) => {
  cy.getByInputName("add-user").type(email);
  cy.contains(email).click();
});

Cypress.Commands.add(
  "createGroup",
  ({ groupName, users }: CreateGroupProps) => {
    cy.login({ email, password });
    cy.getByDataTestId("new-group-chat").click();
    groupName && cy.getByInputName("chatName").type(groupName);
    cy.wrap(users).each((user: string) => {
      cy.addToGroup(user);
    });
    cy.getSubmitButton().click();
  }
);

Cypress.Commands.add("editGroup", ({ groupName, users }: EditGroupProps) => {
  cy.createGroup({
    users: testGroupUsers,
    groupName: testCreateGroupName,
  });
  cy.contains(`${testCreateGroupName}`).click();
  cy.getByDataTestId("features-icon").click();
  if (groupName) {
    cy.getByInputName("chatName").type(groupName);
    cy.getSubmitButton().click();
  }
  users &&
    cy.wrap(users).each((user: string) => {
      cy.addToGroup(user);
      cy.getByDataTestId("add-user-button").click();
    });
});

Cypress.Commands.add("deleteChat", (groupName: string) => {
  cy.getByDataTestId("delete-icon").click();
  cy.contains(groupName).should("not.exist");
});

Cypress.Commands.add(
  "clearCreated",
  ({ clearName, email }: ClearCreatedProps) => {
    cy.login({ email, password });
    cy.contains(clearName).click();
    cy.deleteChat(clearName);
    cy.getByDataTestId("logout").click();
  }
);

Cypress.Commands.add(
  "clearCreatedMultible",
  ({ clearNames, email }: ClearCreatedMultibleProps) => {
    cy.login({ email, password });
    cy.wrap(clearNames).each((clearName: string) => {
      cy.contains(clearName).click();
      cy.deleteChat(clearName);
    });
    cy.getByDataTestId("logout").click();
  }
);
