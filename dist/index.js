// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/db.ts
import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";
var teamMembers = mysqlTable("team_members", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  role: varchar("role", { length: 100 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 32 }).notNull(),
  serviceType: mysqlEnum("serviceType", ["standard", "courier", "airport", "executive"]).notNull(),
  pickupAddress: text("pickupAddress").notNull(),
  destinationAddress: text("destinationAddress").notNull(),
  pickupDate: varchar("pickupDate", { length: 32 }).notNull(),
  pickupTime: varchar("pickupTime", { length: 16 }).notNull(),
  passengers: int("passengers").default(1).notNull(),
  specialRequests: text("specialRequests"),
  estimatedPrice: int("estimatedPrice"),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var driverApplications = mysqlTable("driver_applications", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  licenseNumber: varchar("licenseNumber", { length: 64 }).notNull(),
  yearsExperience: int("yearsExperience").notNull(),
  vehicleOwner: boolean("vehicleOwner").default(false).notNull(),
  vehicleType: varchar("vehicleType", { length: 128 }),
  availability: mysqlEnum("availability", ["fulltime", "parttime", "weekends"]).notNull(),
  message: text("message"),
  internalNotes: text("internalNotes"),
  assignedTo: varchar("assignedTo", { length: 255 }),
  status: mysqlEnum("status", ["pending", "reviewing", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var corporateInquiries = mysqlTable("corporate_inquiries", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  estimatedMonthlyTrips: varchar("estimatedMonthlyTrips", { length: 64 }),
  requirements: text("requirements"),
  internalNotes: text("internalNotes"),
  assignedTo: varchar("assignedTo", { length: 255 }),
  status: mysqlEnum("status", ["pending", "contacted", "converted", "declined"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  internalNotes: text("internalNotes"),
  assignedTo: varchar("assignedTo", { length: 255 }),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var siteContent = mysqlTable("site_content", {
  id: int("id").autoincrement().primaryKey(),
  sectionKey: varchar("sectionKey", { length: 128 }).notNull().unique(),
  title: text("title"),
  subtitle: text("subtitle"),
  description: text("description"),
  buttonText: varchar("buttonText", { length: 128 }),
  buttonLink: varchar("buttonLink", { length: 255 }),
  extraData: text("extraData"),
  // JSON string for additional flexible content
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var siteImages = mysqlTable("site_images", {
  id: int("id").autoincrement().primaryKey(),
  imageKey: varchar("imageKey", { length: 128 }).notNull().unique(),
  url: text("url").notNull(),
  altText: varchar("altText", { length: 255 }),
  caption: text("caption"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/db.ts
var _db = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createBooking(booking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(bookings).values(booking);
  return { id: result[0].insertId };
}
async function createDriverApplication(application) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(driverApplications).values(application);
  return { id: result[0].insertId };
}
async function createCorporateInquiry(inquiry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(corporateInquiries).values(inquiry);
  return { id: result[0].insertId };
}
async function createContactMessage(message) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contactMessages).values(message);
  return { id: result[0].insertId };
}
async function getSiteContent(sectionKey) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(siteContent).where(eq(siteContent.sectionKey, sectionKey)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAllSiteContent() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(siteContent);
}
async function upsertSiteContent(content) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(siteContent).values(content).onDuplicateKeyUpdate({
    set: {
      title: content.title,
      subtitle: content.subtitle,
      description: content.description,
      buttonText: content.buttonText,
      buttonLink: content.buttonLink,
      extraData: content.extraData
    }
  });
}
async function getSiteImage(imageKey) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(siteImages).where(eq(siteImages.imageKey, imageKey)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAllSiteImages() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(siteImages);
}
async function upsertSiteImage(image) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(siteImages).values(image).onDuplicateKeyUpdate({
    set: {
      url: image.url,
      altText: image.altText,
      caption: image.caption
    }
  });
}
async function deleteSiteImage(imageKey) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(siteImages).where(eq(siteImages.imageKey, imageKey));
}
async function getAllDriverApplications() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(driverApplications).orderBy(desc(driverApplications.createdAt));
}
async function updateDriverApplicationStatus(id, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(driverApplications).set({ status }).where(eq(driverApplications.id, id));
}
async function updateDriverApplicationNotes(id, notes) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(driverApplications).set({ internalNotes: notes }).where(eq(driverApplications.id, id));
}
async function updateDriverApplicationAssignment(id, assignedTo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(driverApplications).set({ assignedTo }).where(eq(driverApplications.id, id));
}
async function getAllCorporateInquiries() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(corporateInquiries).orderBy(desc(corporateInquiries.createdAt));
}
async function updateCorporateInquiryStatus(id, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(corporateInquiries).set({ status }).where(eq(corporateInquiries.id, id));
}
async function updateCorporateInquiryNotes(id, notes) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(corporateInquiries).set({ internalNotes: notes }).where(eq(corporateInquiries.id, id));
}
async function updateCorporateInquiryAssignment(id, assignedTo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(corporateInquiries).set({ assignedTo }).where(eq(corporateInquiries.id, id));
}
async function getAllContactMessages() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}
async function markContactMessageAsRead(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, id));
}
async function updateContactMessageNotes(id, notes) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contactMessages).set({ internalNotes: notes }).where(eq(contactMessages.id, id));
}
async function updateContactMessageAssignment(id, assignedTo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contactMessages).set({ assignedTo }).where(eq(contactMessages.id, id));
}
async function getAllTeamMembers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teamMembers).where(eq(teamMembers.isActive, true)).orderBy(teamMembers.name);
}
async function createTeamMember(name, email, role) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [member] = await db.insert(teamMembers).values({ name, email, role }).$returningId();
  return member;
}
async function updateTeamMember(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(teamMembers).set(data).where(eq(teamMembers.id, id));
}
async function deleteTeamMember(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(teamMembers).set({ isActive: false }).where(eq(teamMembers.id, id));
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { z as z2 } from "zod";
import { TRPCError as TRPCError3 } from "@trpc/server";

// server/storage.ts
function getStorageConfig() {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}
function buildUploadUrl(baseUrl, relKey) {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}
function ensureTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
function toFormData(data, contentType, fileName) {
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  const form = new FormData();
  form.append("file", blob, fileName || "file");
  return form;
}
function buildAuthHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}` };
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const formData2 = toFormData(data, contentType, key.split("/").pop() ?? key);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: buildAuthHeaders(apiKey),
    body: formData2
  });
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}

// server/routers.ts
import { nanoid } from "nanoid";

// server/_core/emailService.ts
import formData from "form-data";
import Mailgun from "mailgun.js";
async function sendEmail(options) {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const baseUrl = process.env.MAILGUN_API_BASE_URL || "https://api.mailgun.net";
  if (!apiKey || !domain) {
    console.warn("[Email] Mailgun not configured. Set MAILGUN_API_KEY and MAILGUN_DOMAIN environment variables.");
    return false;
  }
  try {
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: "api",
      key: apiKey,
      url: baseUrl
      // Support EU region
    });
    const emailData = {
      from: `Cloud Cars <noreply@${domain}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      ...options.html && { html: options.html }
    };
    await mg.messages.create(domain, emailData);
    console.log(`[Email] Sent to ${options.to}: ${options.subject}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return false;
  }
}

// server/emailTemplates.ts
var emailTemplates = {
  driverApproved: {
    subject: "Welcome to Cloud Cars - Application Approved",
    body: `Dear {name},

Congratulations! We're pleased to inform you that your driver application has been approved.

Welcome to the Cloud Cars team! We're excited to have you join us as we continue to provide exceptional taxi services across Nottingham.

Next Steps:
1. Complete your onboarding paperwork
2. Schedule your vehicle inspection
3. Attend the driver orientation session

Please call us at 0115 8 244 244 to schedule your onboarding appointment.

Best regards,
Cloud Cars Team
www.cloudcarsltd.com`
  },
  driverInterview: {
    subject: "Cloud Cars - Interview Invitation",
    body: `Dear {name},

Thank you for your interest in joining Cloud Cars as a driver.

We would like to invite you for an interview to discuss your application further.

Please contact us at {phone} to schedule a convenient time for your interview.

We look forward to meeting you!

Best regards,
Cloud Cars Team
www.cloudcarsltd.com`
  },
  driverMoreInfo: {
    subject: "Cloud Cars - Additional Information Required",
    body: `Dear {name},

Thank you for submitting your driver application to Cloud Cars.

We need some additional information to process your application. Please reply to this email with:

- A copy of your valid driving licence
- Proof of vehicle ownership (if applicable)
- References from previous employers

Once we receive this information, we'll be able to move forward with your application.

Best regards,
Cloud Cars Team
www.cloudcarsltd.com`
  },
  corporateQuote: {
    subject: "Cloud Cars - Corporate Account Quote",
    body: `Dear {name},

Thank you for your interest in establishing a corporate account with Cloud Cars.

We're delighted to provide tailored transportation solutions for {company}. Our corporate accounts offer:

- Priority booking and dedicated account management
- Flexible payment terms (monthly invoicing)
- Competitive rates for regular business travel
- Professional, DBS-checked drivers
- Hybrid and eco-friendly vehicle options

I'll prepare a customized quote based on your estimated monthly requirements and send it to you shortly.

In the meantime, if you have any questions, please don't hesitate to contact us at 0115 8 244 244.

Best regards,
Cloud Cars Corporate Team
www.cloudcarsltd.com`
  },
  corporateWelcome: {
    subject: "Welcome to Cloud Cars Corporate Services",
    body: `Dear {name},

Welcome to Cloud Cars! We're thrilled to have {company} as a corporate partner.

Your corporate account is now active. You can start booking rides through our business portal at:
https://book.cloudcarsltd.com/portal/#/account/select-type

Account Benefits:
- Priority booking and dispatch
- Monthly consolidated invoicing
- Dedicated account manager
- 24/7 availability
- Real-time booking confirmations

If you need any assistance or have questions about your account, please contact us at 0115 8 244 244.

We look forward to serving your transportation needs!

Best regards,
Cloud Cars Corporate Team
www.cloudcarsltd.com`
  },
  corporateFollowup: {
    subject: "Following Up - Cloud Cars Corporate Account",
    body: `Dear {name},

I wanted to follow up on our recent conversation about establishing a corporate account for {company} with Cloud Cars.

Have you had a chance to review our proposal? I'd be happy to answer any questions or discuss how we can tailor our services to meet your specific needs.

Our corporate accounts offer:
- Flexible payment terms
- Competitive rates
- Priority service
- Professional drivers

Please let me know if you'd like to schedule a call to discuss further.

Best regards,
Cloud Cars Corporate Team
www.cloudcarsltd.com
0115 8 244 244`
  },
  generalThankYou: {
    subject: "Thank You for Contacting Cloud Cars",
    body: `Dear {name},

Thank you for getting in touch with Cloud Cars.

We've received your message and one of our team members will respond to you shortly.

If your inquiry is urgent, please don't hesitate to call us at 0115 8 244 244.

Best regards,
Cloud Cars Team
www.cloudcarsltd.com`
  },
  generalResolved: {
    subject: "Your Inquiry - Cloud Cars",
    body: `Dear {name},

Thank you for contacting Cloud Cars.

We're pleased to confirm that your inquiry has been resolved. If you have any further questions or need additional assistance, please don't hesitate to reach out.

We appreciate your business and look forward to serving you again soon!

Best regards,
Cloud Cars Team
www.cloudcarsltd.com
0115 8 244 244`
  }
};

// server/routers.ts
var adminProcedure2 = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError3({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});
function calculateQuote(serviceType, distance) {
  const baseRates = {
    standard: 350,
    courier: 500,
    airport: 3500,
    executive: 550
  };
  const perMileRates = {
    standard: 180,
    courier: 150,
    airport: 0,
    executive: 280
  };
  const base = baseRates[serviceType] || 350;
  const perMile = perMileRates[serviceType] || 180;
  return base + Math.round(distance * perMile);
}
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  // Booking procedures
  booking: router({
    create: publicProcedure.input(z2.object({
      customerName: z2.string().min(1),
      customerEmail: z2.string().email(),
      customerPhone: z2.string().min(1),
      serviceType: z2.enum(["standard", "courier", "airport", "executive"]),
      pickupAddress: z2.string().min(1),
      destinationAddress: z2.string().min(1),
      pickupDate: z2.string().min(1),
      pickupTime: z2.string().min(1),
      passengers: z2.number().min(1).max(8).default(1),
      specialRequests: z2.string().optional(),
      estimatedPrice: z2.number().optional()
    })).mutation(async ({ input }) => {
      const result = await createBooking({
        ...input,
        specialRequests: input.specialRequests || null,
        estimatedPrice: input.estimatedPrice || null
      });
      return { success: true, bookingId: result.id };
    }),
    getQuote: publicProcedure.input(z2.object({
      serviceType: z2.enum(["standard", "courier", "airport", "executive"]),
      estimatedMiles: z2.number().min(0)
    })).query(({ input }) => {
      const quote = calculateQuote(input.serviceType, input.estimatedMiles);
      return {
        estimatedPrice: quote,
        formattedPrice: `\xA3${(quote / 100).toFixed(2)}`,
        serviceType: input.serviceType
      };
    })
  }),
  // Driver application procedures
  driver: router({
    submitApplication: publicProcedure.input(z2.object({
      fullName: z2.string().min(1),
      email: z2.string().email(),
      phone: z2.string().min(1),
      licenseNumber: z2.string().min(1),
      yearsExperience: z2.number().min(0),
      vehicleOwner: z2.boolean().default(false),
      vehicleType: z2.string().optional(),
      availability: z2.enum(["fulltime", "parttime", "weekends"]),
      message: z2.string().optional()
    })).mutation(async ({ input }) => {
      const result = await createDriverApplication({
        ...input,
        vehicleType: input.vehicleType || null,
        message: input.message || null,
        internalNotes: null,
        assignedTo: null
      });
      await notifyOwner({
        title: "New Driver Application",
        content: `${input.fullName} applied to be a driver. ${input.yearsExperience} years experience. Phone: ${input.phone}`
      });
      return { success: true, applicationId: result.id };
    })
  }),
  // Corporate inquiry procedures
  corporate: router({
    inquire: publicProcedure.input(z2.object({
      companyName: z2.string().min(1),
      contactName: z2.string().min(1),
      email: z2.string().email(),
      phone: z2.string().min(1),
      estimatedMonthlyTrips: z2.string().optional(),
      requirements: z2.string().optional()
    })).mutation(async ({ input }) => {
      const result = await createCorporateInquiry({
        ...input,
        estimatedMonthlyTrips: input.estimatedMonthlyTrips || null,
        requirements: input.requirements || null,
        internalNotes: null,
        assignedTo: null
      });
      await notifyOwner({
        title: "New Corporate Inquiry",
        content: `${input.companyName} (${input.contactName}) inquired about corporate accounts. Email: ${input.email}`
      });
      return { success: true, inquiryId: result.id };
    })
  }),
  // Contact procedures
  contact: router({
    send: publicProcedure.input(z2.object({
      name: z2.string().min(1),
      email: z2.string().email(),
      phone: z2.string().optional(),
      subject: z2.string().min(1),
      message: z2.string().min(1)
    })).mutation(async ({ input }) => {
      const result = await createContactMessage({
        ...input,
        phone: input.phone || null,
        internalNotes: null,
        assignedTo: null
      });
      await notifyOwner({
        title: "New Contact Message",
        content: `${input.name} sent a message: ${input.subject}. Email: ${input.email}`
      });
      return { success: true, messageId: result.id };
    })
  }),
  // CMS procedures - public read, admin write
  cms: router({
    // Public: Get content for a section
    getContent: publicProcedure.input(z2.object({ sectionKey: z2.string() })).query(async ({ input }) => {
      const content = await getSiteContent(input.sectionKey);
      return content || {
        sectionKey: input.sectionKey,
        title: null,
        subtitle: null,
        description: null,
        buttonText: null,
        buttonLink: null,
        extraData: null
      };
    }),
    // Public: Get all content (for frontend hydration)
    getAllContent: publicProcedure.query(async () => {
      return await getAllSiteContent();
    }),
    // Public: Get a single image
    getImage: publicProcedure.input(z2.object({ imageKey: z2.string() })).query(async ({ input }) => {
      const image = await getSiteImage(input.imageKey);
      return image || {
        imageKey: input.imageKey,
        url: null,
        altText: null,
        caption: null
      };
    }),
    // Public: Get all images
    getAllImages: publicProcedure.query(async () => {
      return await getAllSiteImages();
    }),
    // Admin: Update content
    updateContent: adminProcedure2.input(z2.object({
      sectionKey: z2.string().min(1),
      title: z2.string().optional(),
      subtitle: z2.string().optional(),
      description: z2.string().optional(),
      buttonText: z2.string().optional(),
      buttonLink: z2.string().optional(),
      extraData: z2.string().optional()
    })).mutation(async ({ input }) => {
      await upsertSiteContent({
        sectionKey: input.sectionKey,
        title: input.title || null,
        subtitle: input.subtitle || null,
        description: input.description || null,
        buttonText: input.buttonText || null,
        buttonLink: input.buttonLink || null,
        extraData: input.extraData || null
      });
      return { success: true };
    }),
    // Admin: Upload image
    uploadImage: adminProcedure2.input(z2.object({
      imageKey: z2.string().min(1),
      base64Data: z2.string().min(1),
      mimeType: z2.string().default("image/png"),
      altText: z2.string().optional(),
      caption: z2.string().optional()
    })).mutation(async ({ input }) => {
      const buffer = Buffer.from(input.base64Data, "base64");
      const extension = input.mimeType.split("/")[1] || "png";
      const filename = `cms/${input.imageKey}-${nanoid(8)}.${extension}`;
      const { url } = await storagePut(filename, buffer, input.mimeType);
      await upsertSiteImage({
        imageKey: input.imageKey,
        url,
        altText: input.altText || null,
        caption: input.caption || null
      });
      return { success: true, url };
    }),
    // Admin: Delete image
    deleteImage: adminProcedure2.input(z2.object({ imageKey: z2.string().min(1) })).mutation(async ({ input }) => {
      await deleteSiteImage(input.imageKey);
      return { success: true };
    })
  }),
  // Admin inquiry management procedures
  admin: router({
    // Get all driver applications
    getDriverApplications: adminProcedure2.query(async () => {
      return await getAllDriverApplications();
    }),
    // Update driver application status
    updateDriverStatus: adminProcedure2.input(z2.object({
      id: z2.number(),
      status: z2.enum(["pending", "reviewing", "approved", "rejected"])
    })).mutation(async ({ input }) => {
      await updateDriverApplicationStatus(input.id, input.status);
      return { success: true };
    }),
    // Update driver application notes
    updateDriverNotes: adminProcedure2.input(z2.object({
      id: z2.number(),
      notes: z2.string()
    })).mutation(async ({ input }) => {
      await updateDriverApplicationNotes(input.id, input.notes);
      return { success: true };
    }),
    // Update driver application assignment
    updateDriverAssignment: adminProcedure2.input(z2.object({
      id: z2.number(),
      assignedTo: z2.string().nullable()
    })).mutation(async ({ input }) => {
      await updateDriverApplicationAssignment(input.id, input.assignedTo);
      return { success: true };
    }),
    // Get all corporate inquiries
    getCorporateInquiries: adminProcedure2.query(async () => {
      return await getAllCorporateInquiries();
    }),
    // Update corporate inquiry status
    updateCorporateStatus: adminProcedure2.input(z2.object({
      id: z2.number(),
      status: z2.enum(["pending", "contacted", "converted", "declined"])
    })).mutation(async ({ input }) => {
      await updateCorporateInquiryStatus(input.id, input.status);
      return { success: true };
    }),
    // Update corporate inquiry notes
    updateCorporateNotes: adminProcedure2.input(z2.object({
      id: z2.number(),
      notes: z2.string()
    })).mutation(async ({ input }) => {
      await updateCorporateInquiryNotes(input.id, input.notes);
      return { success: true };
    }),
    // Update corporate inquiry assignment
    updateCorporateAssignment: adminProcedure2.input(z2.object({
      id: z2.number(),
      assignedTo: z2.string().nullable()
    })).mutation(async ({ input }) => {
      await updateCorporateInquiryAssignment(input.id, input.assignedTo);
      return { success: true };
    }),
    // Get all contact messages
    getContactMessages: adminProcedure2.query(async () => {
      return await getAllContactMessages();
    }),
    // Mark contact message as read
    markContactRead: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      await markContactMessageAsRead(input.id);
      return { success: true };
    }),
    // Update contact message notes
    updateContactNotes: adminProcedure2.input(z2.object({
      id: z2.number(),
      notes: z2.string()
    })).mutation(async ({ input }) => {
      await updateContactMessageNotes(input.id, input.notes);
      return { success: true };
    }),
    // Update contact message assignment
    updateContactAssignment: adminProcedure2.input(z2.object({
      id: z2.number(),
      assignedTo: z2.string().nullable()
    })).mutation(async ({ input }) => {
      await updateContactMessageAssignment(input.id, input.assignedTo);
      return { success: true };
    }),
    // Send email from dashboard
    sendEmail: adminProcedure2.input(z2.object({
      to: z2.string().email(),
      subject: z2.string().min(1),
      message: z2.string().min(1)
    })).mutation(async ({ input }) => {
      const success = await sendEmail({
        to: input.to,
        subject: input.subject,
        text: input.message
      });
      return { success };
    }),
    // Send email with template
    sendTemplateEmail: adminProcedure2.input(z2.object({
      to: z2.string().email(),
      templateType: z2.string(),
      variables: z2.record(z2.string(), z2.string())
    })).mutation(async ({ input }) => {
      const template = emailTemplates[input.templateType];
      if (!template) {
        throw new Error("Invalid template type");
      }
      let subject = template.subject;
      let body = template.body;
      Object.entries(input.variables).forEach(([key, value]) => {
        const stringValue = String(value);
        subject = subject.replace(new RegExp(`\\{${key}\\}`, "g"), stringValue);
        body = body.replace(new RegExp(`\\{${key}\\}`, "g"), stringValue);
      });
      const success = await sendEmail({
        to: input.to,
        subject,
        text: body
      });
      return { success };
    }),
    // Team members management
    getTeamMembers: adminProcedure2.query(async () => {
      return await getAllTeamMembers();
    }),
    createTeamMember: adminProcedure2.input(z2.object({
      name: z2.string().min(1),
      email: z2.string().email().optional(),
      role: z2.string().optional()
    })).mutation(async ({ input }) => {
      return await createTeamMember(input.name, input.email, input.role);
    }),
    updateTeamMember: adminProcedure2.input(z2.object({
      id: z2.number(),
      name: z2.string().min(1).optional(),
      email: z2.string().email().optional(),
      role: z2.string().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateTeamMember(id, data);
      return { success: true };
    }),
    deleteTeamMember: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      await deleteTeamMember(input.id);
      return { success: true };
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs from "fs";
import { nanoid as nanoid2 } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid2()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
