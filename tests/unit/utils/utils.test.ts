import { describe, it, expect, vi, beforeEach } from "vitest";
import { trackEvent } from "@/lib/analytics";
import { compressImageToBase64 } from "@/lib/utils/image-compression";

describe("lib/analytics", () => {
  beforeEach(() => {
    delete (window as any).gtag;
    delete (window as any).fbq;
    delete (window as any).lintrk;
  });

  it("should dispatch to gtag if available on window", () => {
    const gtagMock = vi.fn();
    (window as any).gtag = gtagMock;

    trackEvent("whatsapp_click", { location: "navbar" });
    expect(gtagMock).toHaveBeenCalledWith("event", "whatsapp_click", { location: "navbar" });
  });

  it("should dispatch to fbq if available on window", () => {
    const fbqMock = vi.fn();
    (window as any).fbq = fbqMock;

    trackEvent("proposal_submit", { value: 100 });
    expect(fbqMock).toHaveBeenCalledWith("trackCustom", "proposal_submit", { value: 100 });
  });

  it("should dispatch to lintrk if available on window", () => {
    const lintrkMock = vi.fn();
    (window as any).lintrk = lintrkMock;

    trackEvent("linkedin_click");
    expect(lintrkMock).toHaveBeenCalledWith("track", { conversion_id: "linkedin_click" });
  });

  it("should handle missing window tracking functions gracefully without errors", () => {
    expect(() => trackEvent("contact_copy")).not.toThrow();
  });
});

describe("lib/utils/image-compression", () => {
  it("should reject non-image file types", async () => {
    const fakeTextFile = new File(["dummy text content"], "document.pdf", {
      type: "application/pdf",
    });

    await expect(compressImageToBase64(fakeTextFile)).rejects.toThrow(
      "não é uma imagem válida"
    );
  });
});
