import { describe, it, expect } from "vitest";
import { createDriverApplication } from "./db";

describe("Driver Application", () => {
  it("should successfully create a driver application with all required fields", async () => {
    const application = {
      fullName: "Test Driver",
      email: "test@example.com",
      phone: "0115 123 4567",
      licenseNumber: "TEST123456",
      yearsExperience: 5,
      vehicleOwner: true,
      vehicleType: "Toyota Prius",
      availability: "fulltime" as const,
      message: "I'm interested in driving for Cloud Cars",
      internalNotes: null,
      assignedTo: null,
    };

    const result = await createDriverApplication(application);
    
    expect(result).toBeDefined();
    expect(result.id).toBeGreaterThan(0);
  });

  it("should create driver application with minimal required fields", async () => {
    const application = {
      fullName: "Minimal Driver",
      email: "minimal@example.com",
      phone: "0115 999 8888",
      licenseNumber: "MIN999",
      yearsExperience: 2,
      vehicleOwner: false,
      vehicleType: null,
      availability: "parttime" as const,
      message: null,
      internalNotes: null,
      assignedTo: null,
    };

    const result = await createDriverApplication(application);
    
    expect(result).toBeDefined();
    expect(result.id).toBeGreaterThan(0);
  });
});
