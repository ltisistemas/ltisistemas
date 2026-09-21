import { describe, it, expect, vi, beforeEach } from "vitest";
import { compressImageToBase64 } from "@/lib/utils/image-compression";

describe("lib/utils/image-compression full", () => {
  it("should compress image using canvas and return base64 payload", async () => {
    // Mock canvas context
    const mockContext = {
      drawImage: vi.fn(),
    };
    const mockToDataURL = vi.fn().mockReturnValue("data:image/png;base64,compressedOutputBase64");

    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") {
        return {
          getContext: () => mockContext,
          toDataURL: mockToDataURL,
          width: 0,
          height: 0,
        } as any;
      }
      return document.createElement(tag);
    });

    // Mock FileReader
    class MockFileReader {
      onload: any = null;
      readAsDataURL(file: any) {
        setTimeout(() => {
          this.onload({ target: { result: "data:image/png;base64,originalRawBase64" } });
        }, 10);
      }
    }
    (globalThis as any).FileReader = MockFileReader;

    // Mock Image
    class MockImage {
      src = "";
      width = 2400;
      height = 1600;
      onload: any = null;
      set ["src"](val: string) {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 10);
      }
    }
    (globalThis as any).Image = MockImage;

    const file = new File(["dummy png data"], "screenshot.png", { type: "image/png" });
    const result = await compressImageToBase64(file, 1200, 1200, 0.85);

    expect(result.fileName).toBe("screenshot.png");
    expect(result.mimeType).toBe("image/png");
    expect(result.base64Data).toBe("data:image/png;base64,compressedOutputBase64");
  });
});
