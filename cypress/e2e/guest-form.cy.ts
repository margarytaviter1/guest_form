describe("Guest Preferences Form", () => {
  it("shows invalid link message without booking id", () => {
    cy.visit("/");
    cy.contains("Невірне посилання").should("be.visible");
  });

  it("renders the form with a valid booking id", () => {
    cy.visit("/?id=test-booking-123");
    cy.contains("Зберегти побажання").should("be.visible");
    cy.get("#arrivalTime").should("exist");
    cy.get("#mealPlan").should("exist");
  });

  it("hides meal guests field when mealPlan is none", () => {
    cy.visit("/?id=test-booking-123");
    cy.get("#mealPlan").select("none");
    cy.get("#mealGuests").should("not.exist");
  });

  it("shows meal guests field when mealPlan is breakfast", () => {
    cy.visit("/?id=test-booking-123");
    cy.get("#mealPlan").select("breakfast");
    cy.get("#mealGuests").should("exist");
  });

  it("can toggle activity checkboxes", () => {
    cy.visit("/?id=test-booking-123");
    cy.get('input[name="activeBicycle"]').check({ force: true }).should("be.checked");
    cy.get('input[name="activeSup"]').check({ force: true }).should("be.checked");
    cy.get('input[name="activeGarden"]').check({ force: true }).should("be.checked");
  });

  it("can uncheck hygiene items", () => {
    cy.visit("/?id=test-booking-123");
    cy.get('input[name="hygieneSlippers"]').should("be.checked");
    cy.get('input[name="hygieneSlippers"]').uncheck({ force: true }).should("not.be.checked");
  });

  it("submits form successfully and shows thank-you message", () => {
    cy.intercept("POST", "/api/guests", {
      statusCode: 201,
      body: { success: true, id: 1 },
    }).as("submitForm");

    cy.visit("/?id=test-booking-123");
    cy.get("#arrivalTime").select("15:00");
    cy.get("#mealPlan").select("breakfast");
    cy.get("#mealGuests").clear().type("3");
    cy.get('input[name="needBabyCot"]').check({ force: true });
    cy.get("#comments").type("Алергія на горіхи");
    cy.contains("Зберегти побажання").click();

    cy.wait("@submitForm").its("request.body").should((body) => {
      expect(body.bookingId).to.eq("test-booking-123");
      expect(body.arrivalTime).to.eq("15:00");
      expect(body.mealPlan).to.eq("breakfast");
      expect(body.mealGuests).to.eq(3);
      expect(body.needBabyCot).to.eq(true);
      expect(body.comments).to.eq("Алергія на горіхи");
    });

    cy.contains("Дякуємо!").should("be.visible");
  });

  it("shows error alert on server failure", () => {
    cy.intercept("POST", "/api/guests", {
      statusCode: 500,
      body: { success: false, error: "Internal server error" },
    }).as("submitFail");

    cy.visit("/?id=test-booking-123");

    const alertStub = cy.stub();
    cy.on("window:alert", alertStub);

    cy.contains("Зберегти побажання").click();

    cy.wait("@submitFail").then(() => {
      expect(alertStub).to.have.been.calledWithMatch(/Internal server error/);
    });
  });
});
