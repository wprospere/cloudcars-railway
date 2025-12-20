import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  createBooking: vi.fn().mockResolvedValue({ id: 1 }),
  createDriverApplication: vi.fn().mockResolvedValue({ id: 1 }),
  createCorporateInquiry: vi.fn().mockResolvedValue({ id: 1 }),
  createContactMessage: vi.fn().mockResolvedValue({ id: 1 }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("booking.getQuote", () => {
  it("calculates standard service quote correctly", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.booking.getQuote({
      serviceType: "standard",
      estimatedMiles: 10,
    });

    // Base: 350 pence + (10 miles * 180 pence/mile) = 350 + 1800 = 2150 pence = £21.50
    expect(result.estimatedPrice).toBe(2150);
    expect(result.formattedPrice).toBe("£21.50");
    expect(result.serviceType).toBe("standard");
  });

  it("calculates executive service quote correctly", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.booking.getQuote({
      serviceType: "executive",
      estimatedMiles: 10,
    });

    // Base: 550 pence + (10 miles * 280 pence/mile) = 550 + 2800 = 3350 pence = £33.50
    expect(result.estimatedPrice).toBe(3350);
    expect(result.formattedPrice).toBe("£33.50");
    expect(result.serviceType).toBe("executive");
  });

  it("calculates airport service quote correctly", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.booking.getQuote({
      serviceType: "airport",
      estimatedMiles: 0,
    });

    // Airport: Fixed base price of 3500 pence (£35.00) with 0 per-mile rate
    expect(result.estimatedPrice).toBe(3500);
    expect(result.formattedPrice).toBe("£35.00");
    expect(result.serviceType).toBe("airport");
  });
});

describe("booking.create", () => {
  it("creates a booking successfully", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.booking.create({
      customerName: "John Smith",
      customerEmail: "john@example.com",
      customerPhone: "07123456789",
      serviceType: "standard",
      pickupAddress: "Nottingham Train Station",
      destinationAddress: "Old Market Square",
      pickupDate: "2024-12-15",
      pickupTime: "14:00",
      passengers: 2,
    });

    expect(result.success).toBe(true);
    expect(result.bookingId).toBe(1);
  });
});

describe("driver.submit", () => {
  it("submits a driver application successfully", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.driver.submitApplication({
      fullName: "James Wilson",
      email: "james@example.com",
      phone: "07987654321",
      licenseNumber: "WILSO123456JW9AB",
      yearsExperience: 5,
      vehicleOwner: true,
      vehicleType: "Toyota Prius 2022",
      availability: "fulltime",
    });

    expect(result.success).toBe(true);
    expect(result.applicationId).toBe(1);
  });
});

describe("corporate.inquire", () => {
  it("submits a corporate inquiry successfully", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.corporate.inquire({
      companyName: "Acme Corp",
      contactName: "Sarah Johnson",
      email: "sarah@acmecorp.com",
      phone: "0115 123 4567",
      estimatedMonthlyTrips: "50-100",
      requirements: "Airport transfers and client meetings",
    });

    expect(result.success).toBe(true);
    expect(result.inquiryId).toBe(1);
  });
});

describe("contact.send", () => {
  it("sends a contact message successfully", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.send({
      name: "Emily Brown",
      email: "emily@example.com",
      phone: "0115 987 6543",
      subject: "General Enquiry",
      message: "I would like to know more about your services.",
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBe(1);
  });
});
