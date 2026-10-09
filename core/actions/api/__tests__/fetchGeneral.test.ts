import { fetchGeneral } from "@core/actions/api/fetchGeneral";
import { memoryStore } from "@core/__tests__/memoryStorage";

jest.mock("@core/adapters/secure-storage.adapter", () =>
  jest.requireActual("@core/__tests__/memoryStorage").createAdapterMock(),
);

const fetchMock = jest.fn();

const jsonResponse = (status: number, body: unknown = {}) =>
  ({
    status,
    ok: status >= 200 && status < 300,
    json: jest.fn().mockResolvedValue(body),
  }) as unknown as Response;

beforeEach(() => {
  memoryStore.clear();
  fetchMock.mockReset();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

describe("fetchGeneral", () => {
  it("sends a JSON GET with the bearer token when one is stored", async () => {
    memoryStore.set("token", "abc");
    fetchMock.mockResolvedValue(jsonResponse(200, { ok: true }));

    const result = await fetchGeneral<{ ok: boolean }>("/player/me");

    expect(result).toEqual({ ok: true });
    const [url, config] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/player\/me$/);
    expect(config.method).toBe("GET");
    expect(config.headers).toMatchObject({
      Authorization: "Bearer abc",
      "Content-Type": "application/json",
    });
    expect(config.body).toBeUndefined();
  });

  it("omits Authorization without a token and serializes the body", async () => {
    fetchMock.mockResolvedValue(jsonResponse(201, { id: 1 }));

    await fetchGeneral("/room/private", { method: "POST", body: { maxTurns: 20 } });

    const [, config] = fetchMock.mock.calls[0];
    expect(config.headers).not.toHaveProperty("Authorization");
    expect(config.body).toBe(JSON.stringify({ maxTurns: 20 }));
  });

  it("keeps FormData untouched and does not force a content type", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200));
    const form = new FormData();

    await fetchGeneral("/player/avatar", { method: "POST", body: form, isFormData: true });

    const [, config] = fetchMock.mock.calls[0];
    expect(config.body).toBe(form);
    expect(config.headers).not.toHaveProperty("Content-Type");
  });

  it("clears stored tokens and throws on 401", async () => {
    memoryStore.set("token", "abc");
    memoryStore.set("refreshToken", "def");
    fetchMock.mockResolvedValue(jsonResponse(401));

    await expect(fetchGeneral("/player/me")).rejects.toThrow("Unauthorized");
    expect(memoryStore.has("token")).toBe(false);
    expect(memoryStore.has("refreshToken")).toBe(false);
  });

  it("throws the API message on other errors", async () => {
    fetchMock.mockResolvedValue(jsonResponse(403, { message: "Not your turn" }));
    await expect(fetchGeneral("/match/x/move")).rejects.toThrow("Not your turn");
  });

  it("falls back to the HTTP status when the error body is not JSON", async () => {
    const response = jsonResponse(500);
    (response.json as jest.Mock).mockRejectedValue(new Error("bad json"));
    fetchMock.mockResolvedValue(response);

    await expect(fetchGeneral("/boom")).rejects.toThrow("HTTP 500");
  });

  it("returns an empty object on 204", async () => {
    fetchMock.mockResolvedValue(jsonResponse(204));
    await expect(fetchGeneral("/room/private/ABCD", { method: "DELETE" })).resolves.toEqual({});
  });
});
