import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";

vi.mock("../src/services/auth.services", () => ({
  signupService: vi.fn(),
  loginService: vi.fn(),
  getCurrentUserService: vi.fn(),
}));
vi.mock("../src/services/addiction.services", () => ({
  createAddictionService: vi.fn(),
  fetchAllAddictionsService: vi.fn(),
  fetchAllPartneredAddictionsService: vi.fn(),
  deleteAddictionService: vi.fn(),
  updateAddictionService: vi.fn(),
}));
vi.mock("../src/services/journal.services", () => ({
  addJournalEntryService: vi.fn(),
  updateJournalEntryService: vi.fn(),
  getAllJournalEntriesService: vi.fn(),
  getAllPartneredJournalEntriesService: vi.fn(),
  getJournalEntryByDateService: vi.fn(),
  getPartneredJournalEntryByDateService: vi.fn(),
  deleteJournalEntryService: vi.fn(),
}));
vi.mock("../src/services/invitation.services", () => ({
  createInvitationService: vi.fn(),
  fetchSentInvitationsService: vi.fn(),
  fetchReceivedInvitationsService: vi.fn(),
  acceptInvitationService: vi.fn(),
  deleteInvitationService: vi.fn(),
}));
vi.mock("../src/util/logger", () => ({
  default: { error: vi.fn(), info: vi.fn() },
}));

import app from "../src/app";
import * as auth from "../src/services/auth.services";
import * as addictions from "../src/services/addiction.services";
import * as journals from "../src/services/journal.services";
import * as invitations from "../src/services/invitation.services";
import { AppError } from "../src/util/error";

const userId = "11111111-1111-4111-8111-111111111111";
const id = "22222222-2222-4222-8222-222222222222";
const entryId = "33333333-3333-4333-8333-333333333333";
const user = { id: userId, username: "tester", email: "test@example.com" };
const credentials = { email: user.email, password: "secret123" };
const journal = {
  addictionId: id,
  succeeded: true,
  content: "Today went well",
  targetDate: "2026-01-15",
};
const cookie = `token=${jwt.sign({ userId, username: user.username }, process.env.JWT_SECRET!, { expiresIn: "1h" })}`;
const mocks = [
  ...Object.values(auth),
  ...Object.values(addictions),
  ...Object.values(journals),
  ...Object.values(invitations),
].map((fn) => vi.mocked(fn));

type Endpoint = {
  method: string;
  path: string;
  service?: (...args: any[]) => any;
  args?: unknown[];
  body?: unknown;
  status: number;
  message: string;
  result?: unknown;
  data?: unknown;
  public?: boolean;
};
const endpoints: Endpoint[] = [
  {
    method: "POST",
    path: "/auth/signup",
    service: auth.signupService,
    args: [user.username, user.email, credentials.password],
    body: { username: user.username, ...credentials },
    status: 201,
    message: "User signed up successfully",
    result: user,
    data: { user },
    public: true,
  },
  {
    method: "POST",
    path: "/auth/login",
    service: auth.loginService,
    args: [user.email, credentials.password],
    body: credentials,
    status: 200,
    message: "User logged in successfully",
    result: user,
    data: { user },
    public: true,
  },
  {
    method: "GET",
    path: "/auth/me",
    service: auth.getCurrentUserService,
    args: [userId],
    status: 200,
    message: "User fetched successfully",
    result: user,
    data: { user },
  },
  {
    method: "POST",
    path: "/auth/logout",
    status: 200,
    message: "User logged out successfully",
  },
  {
    method: "POST",
    path: "/addictions",
    service: addictions.createAddictionService,
    args: ["Smoking", userId],
    body: { name: "Smoking" },
    status: 201,
    message: "Addiction created successfully",
    result: { id, name: "Smoking" },
    data: { id, name: "Smoking" },
  },
  {
    method: "GET",
    path: "/addictions?page=2&limit=5",
    service: addictions.fetchAllAddictionsService,
    args: [userId, 2, 5],
    status: 200,
    message: "Addictions fetched successfully",
    result: [],
    data: [],
  },
  {
    method: "GET",
    path: "/addictions/partnered?page=2&limit=5",
    service: addictions.fetchAllPartneredAddictionsService,
    args: [userId, 2, 5],
    status: 200,
    message: "Partnered addictions fetched successfully",
    result: [],
    data: [],
  },
  {
    method: "PATCH",
    path: `/addictions/${id}`,
    service: addictions.updateAddictionService,
    args: [id, "New name", userId],
    body: { name: "New name" },
    status: 200,
    message: "Addiction updated successfully",
  },
  {
    method: "DELETE",
    path: `/addictions/${id}`,
    service: addictions.deleteAddictionService,
    args: [id, userId],
    status: 200,
    message: "Addiction deleted successfully",
  },
  {
    method: "POST",
    path: "/journals",
    service: journals.addJournalEntryService,
    args: [userId, id, true, journal.content, journal.targetDate],
    body: journal,
    status: 201,
    message: "Entry created successfully",
    result: { id: entryId, ...journal },
    data: { id: entryId, ...journal },
  },
  {
    method: "PATCH",
    path: `/journals/${entryId}`,
    service: journals.updateJournalEntryService,
    args: [userId, entryId, id, true, journal.content, journal.targetDate],
    body: journal,
    status: 200,
    message: "Journal updated successfully",
  },
  {
    method: "GET",
    path: `/journals/${id}`,
    service: journals.getAllJournalEntriesService,
    args: [userId, id],
    status: 200,
    message: "Journals fetched successfully",
    result: [],
    data: [],
  },
  {
    method: "GET",
    path: `/journals/${id}/partnered`,
    service: journals.getAllPartneredJournalEntriesService,
    args: [userId, id],
    status: 200,
    message: "Journals fetched successfully",
    result: [],
    data: [],
  },
  {
    method: "GET",
    path: `/journals/${id}/date?date=2026-01-15`,
    service: journals.getJournalEntryByDateService,
    args: [userId, id, journal.targetDate],
    status: 200,
    message: "Journal entry fetched successfully",
    result: null,
    data: null,
  },
  {
    method: "GET",
    path: `/journals/${id}/date/partnered?date=2026-01-15`,
    service: journals.getPartneredJournalEntryByDateService,
    args: [userId, id, journal.targetDate],
    status: 200,
    message: "Journal entry fetched successfully",
    result: null,
    data: null,
  },
  {
    method: "DELETE",
    path: `/journals/addictions/${id}/entries/${entryId}`,
    service: journals.deleteJournalEntryService,
    args: [userId, entryId, id],
    status: 204,
    message: "",
  },
  {
    method: "GET",
    path: "/invitations/sent?status=pending&page=2&pageSize=5",
    service: invitations.fetchSentInvitationsService,
    args: [userId, "pending", 2, 5],
    status: 202,
    message: "Invitations fetched successfully.",
    result: [],
    data: [],
  },
  {
    method: "GET",
    path: "/invitations/received?status=accepted",
    service: invitations.fetchReceivedInvitationsService,
    args: [userId, "accepted", 1, 10],
    status: 202,
    message: "Invitations fetched successfully.",
    result: [],
    data: [],
  },
  {
    method: "POST",
    path: "/invitations",
    service: invitations.createInvitationService,
    args: [userId, id],
    body: { addictionId: id },
    status: 201,
    message: "Invitation created successfully",
    result: {
      newInvitation: { id },
      invitationLink: "http://localhost:5173/invite/token",
    },
    data: {
      newInvitation: { id },
      invitationLink: "http://localhost:5173/invite/token",
    },
  },
  {
    method: "PATCH",
    path: `/invitations/${id}/accept`,
    service: invitations.acceptInvitationService,
    args: [userId, id],
    status: 202,
    message: "Invitation accepted successfully",
  },
  {
    method: "DELETE",
    path: `/invitations/${id}`,
    service: invitations.deleteInvitationService,
    args: [userId, id],
    status: 204,
    message: "",
  },
];

let server: Server;
let baseUrl: string;
beforeAll(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/v1`;
});
afterAll(async () => {
  server.closeAllConnections();
  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
});
beforeEach(() => {
  mocks.forEach((mock) => mock.mockReset());
});

async function request(
  endpoint: Pick<Endpoint, "method" | "path" | "body">,
  token: string | null = cookie,
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Cookie = token;
  const response = await fetch(baseUrl + endpoint.path, {
    method: endpoint.method,
    headers,
    ...(endpoint.body === undefined
      ? {}
      : { body: JSON.stringify(endpoint.body) }),
  });
  const text = await response.text();
  return {
    status: response.status,
    headers: response.headers,
    body: text ? JSON.parse(text) : undefined,
  };
}

describe.each(endpoints)("$method $path", (endpoint) => {
  it("returns the expected response and calls only the intended service with authenticated arguments", async () => {
    if (endpoint.service)
      vi.mocked(endpoint.service).mockResolvedValue(endpoint.result);
    const response = await request(endpoint, endpoint.public ? null : cookie);
    expect(response.status).toBe(endpoint.status);
    expect(response.body).toEqual(
      endpoint.status === 204
        ? undefined
        : {
            message: endpoint.message,
            ...(endpoint.data === undefined ? {} : { data: endpoint.data }),
          },
    );
    if (endpoint.service)
      expect(endpoint.service).toHaveBeenCalledExactlyOnceWith(
        ...endpoint.args!,
      );
    for (const mock of mocks)
      if (mock !== endpoint.service) expect(mock).not.toHaveBeenCalled();
    if (endpoint.path === "/auth/signup" || endpoint.path === "/auth/login") {
      const setCookie = response.headers.get("set-cookie")!;
      expect(setCookie).toContain("HttpOnly");
      expect(setCookie).toContain("SameSite=Strict");
      expect(setCookie).toContain("Path=/");
      expect(setCookie).toContain("Max-Age=3600");
      const token = setCookie.match(/^token=([^;]+)/)![1]!;
      expect(jwt.verify(token, process.env.JWT_SECRET!)).toMatchObject({
        userId,
        username: user.username,
      });
    }
    if (endpoint.path === "/auth/logout")
      expect(response.headers.get("set-cookie")).toContain(
        "token=; Path=/; Expires=Thu, 01 Jan 1970",
      );
  });

  if (!endpoint.public) {
    it.each([
      ["missing", null, "Token required"],
      ["malformed", "token=invalid", "Invalid or expired token"],
      [
        "expired",
        `token=${jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: -1 })}`,
        "Invalid or expired token",
      ],
      [
        "wrong signature",
        `token=${jwt.sign({ userId }, "wrong-secret")}`,
        "Invalid or expired token",
      ],
    ])(
      "rejects a %s token before calling services",
      async (_label, token, message) => {
        const response = await request(endpoint, token);
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message });
        mocks.forEach((mock) => expect(mock).not.toHaveBeenCalled());
      },
    );
  }

  if (endpoint.service) {
    it.each([401, 403, 404, 409])(
      "serializes service errors with status %s",
      async (status) => {
        vi.mocked(endpoint.service!).mockRejectedValue(
          new AppError("Service failure", status),
        );
        const response = await request(endpoint);
        expect(response.status).toBe(status);
        expect(response.body).toEqual({ message: "Service failure" });
      },
    );
    it("returns a safe JSON response for unexpected failures", async () => {
      vi.mocked(endpoint.service!).mockRejectedValue(
        new Error("private database details"),
      );
      const response = await request(endpoint);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal server error" });
    });
  }
});

describe("request validation", () => {
  const invalidRequests = [
    ...["signup", "login"].flatMap((route) => [
      {
        method: "POST",
        path: `/auth/${route}`,
        body: { username: user.username, ...credentials, email: "bad" },
        field: "email",
      },
      {
        method: "POST",
        path: `/auth/${route}`,
        body: { username: user.username, ...credentials, password: "short" },
        field: "password",
      },
    ]),
    {
      method: "POST",
      path: "/auth/signup",
      body: { ...credentials, username: "short" },
      field: "username",
    },
    ...["", "a".repeat(256), 123].flatMap((name) => [
      { method: "POST", path: "/addictions", body: { name }, field: "name" },
      {
        method: "PATCH",
        path: `/addictions/${id}`,
        body: { name },
        field: "name",
      },
    ]),
    ...["POST", "PATCH"].flatMap((method) => [
      {
        method,
        path: method === "POST" ? "/journals" : `/journals/${entryId}`,
        body: { ...journal, addictionId: undefined },
        field: "addictionId",
      },
      {
        method,
        path: method === "POST" ? "/journals" : `/journals/${entryId}`,
        body: { ...journal, succeeded: "true" },
        field: "succeeded",
      },
      {
        method,
        path: method === "POST" ? "/journals" : `/journals/${entryId}`,
        body: { ...journal, content: "a".repeat(1001) },
        field: "content",
      },
      {
        method,
        path: method === "POST" ? "/journals" : `/journals/${entryId}`,
        body: { ...journal, targetDate: "invalid" },
        field: "targetDate",
      },
    ]),
    {
      method: "POST",
      path: "/invitations",
      body: { addictionId: "bad" },
      field: "addictionId",
    },
    ...endpoints
      .filter((e) => e.path.includes(id) || e.path.includes(entryId))
      .map((e) => ({
        ...e,
        path: e.path.replaceAll(id, "bad").replaceAll(entryId, "bad"),
        field: e.path.startsWith("/invitations")
          ? e.method === "DELETE"
            ? "invitationId"
            : "token"
          : e.path === `/journals/${entryId}`
            ? "entryId"
            : "addictionId",
      })),
    ...["", "?date=bad", "?date=2026-02-30"].flatMap((query) => [
      { method: "GET", path: `/journals/${id}/date${query}`, field: "date" },
      {
        method: "GET",
        path: `/journals/${id}/date/partnered${query}`,
        field: "date",
      },
    ]),
    ...["", "?status=unknown"].map((query) => ({
      method: "GET",
      path: `/invitations/received${query}`,
      field: "status",
    })),
  ];
  it.each(invalidRequests)(
    "rejects invalid $field on $method $path",
    async (endpoint) => {
      const response = await request(endpoint);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid data");
      expect(response.body.errors[endpoint.field]).toEqual(
        expect.arrayContaining([expect.any(String)]),
      );
      mocks.forEach((mock) => expect(mock).not.toHaveBeenCalled());
    },
  );
  it("returns 404 for an unknown route", async () => {
    const response = await fetch(baseUrl + "/unknown");
    expect(response.status).toBe(404);
  });
});
