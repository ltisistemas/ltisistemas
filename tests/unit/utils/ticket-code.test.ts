import { describe, it, expect } from "vitest";
import { formatTicketCode } from "@/lib/utils/ticket-code";

describe("lib/utils/ticket-code", () => {
  it("should generate standard LTI-BUG-XXXXXX-YYYY-MM-DD-HH-MM from id and createdAt", () => {
    const fixedDate = new Date(2026, 8, 21, 15, 30); // 2026-09-21 15:30
    const code = formatTicketCode({
      id: "cm123456abcdef",
      ticketNumber: 4,
      createdAt: fixedDate,
    });

    expect(code).toBe("LTI-BUG-ABCDEF-2026-09-21-15-30");
  });

  it("should fallback to ticketNumber if id is short or missing", () => {
    const fixedDate = new Date(2026, 0, 5, 9, 5); // 2026-01-05 09:05
    const code = formatTicketCode({
      ticketNumber: 42,
      createdAt: fixedDate,
    });

    expect(code).toBe("LTI-BUG-000042-2026-01-05-09-05");
  });

  it("should handle empty object safely with current date", () => {
    const code = formatTicketCode({});
    expect(code).toMatch(/^LTI-BUG-[0-9A-Z]{6}-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}$/);
  });
});
