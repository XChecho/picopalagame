import { generateUuidV4 } from "@core/utils/uuid";

describe("generateUuidV4", () => {
  it("matches the RFC 4122 v4 format", () => {
    expect(generateUuidV4()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it("does not repeat across many calls", () => {
    const ids = new Set(Array.from({ length: 1000 }, generateUuidV4));
    expect(ids.size).toBe(1000);
  });
});
