import { describe, it, expect, vi, beforeEach } from "vitest";
import { compressImageToBase64 } from "@/lib/utils/image-compression";

describe("lib/utils/image-compression full branches", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should compress tall image (height > width) with canvas", async () => {
    const mockContext = { drawImage: vi.fn() };
    const mockToDataURL = vi.fn().mockReturnValue("data:image/jpeg;base64,tallCompressed");

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

    class MockFileReader {
      onload: any = null;
      readAsDataURL() {
        setTimeout(() => {
          this.onload({ target: { result: "data:image/jpeg;base64,raw" } });
        }, 10);
      }
    }
    (globalThis as any).FileReader = MockFileReader;

    class MockTallImage {
      width = 800;
      height = 2000;
      onload: any = null;
      set ["src"](val: string) {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 10);
      }
    }
    (globalThis as any).Image = MockTallImage;

    const file = new File(["dummy jpg"], "tall.jpg", { type: "image/jpeg" });
    const result = await compressImageToBase64(file, 1200, 1200, 0.85);

    expect(result.fileName).toBe("tall.jpg");
    expect(result.mimeType).toBe("image/jpeg");
    expect(result.base64Data).toBe("data:image/jpeg;base64,tallCompressed");
  });

  it("should fallback to raw base64 if getContext is null", async () => {
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") {
        return {
          getContext: () => null,
          width: 0,
          height: 0,
        } as any;
      }
      return document.createElement(tag);
    });

    class MockFileReader {
      onload: any = null;
      readAsDataURL() {
        setTimeout(() => {
          this.onload({ target: { result: "data:image/png;base64,fallbackRaw" } });
        }, 10);
      }
    }
    (globalThis as any).FileReader = MockFileReader;

    class MockImage {
      width = 500;
      height = 500;
      onload: any = null;
      set ["src"](val: string) {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 10);
      }
    }
    (globalThis as any).Image = MockImage;

    const file = new File(["dummy png"], "raw.png", { type: "image/png" });
    const result = await compressImageToBase64(file);

    expect(result.base64Data).toBe("data:image/png;base64,fallbackRaw");
  });

  it("should reject when FileReader errors", async () => {
    class FailingFileReader {
      onerror: any = null;
      readAsDataURL() {
        setTimeout(() => {
          if (this.onerror) this.onerror(new Error("Disk error"));
        }, 10);
      }
    }
    (globalThis as any).FileReader = FailingFileReader;

    const file = new File(["data"], "err.png", { type: "image/png" });
    await expect(compressImageToBase64(file)).rejects.toThrow("Erro ao ler o arquivo");
  });

  it("should reject when Image loading errors", async () => {
    class MockFileReader {
      onload: any = null;
      readAsDataURL() {
        setTimeout(() => {
          this.onload({ target: { result: "data:image/png;base64,corrupted" } });
        }, 10);
      }
    }
    (globalThis as any).FileReader = MockFileReader;

    class FailingImage {
      onerror: any = null;
      set ["src"](val: string) {
        setTimeout(() => {
          if (this.onerror) this.onerror(new Error("Corrupted"));
        }, 10);
      }
    }
    (globalThis as any).Image = FailingImage;

    const file = new File(["corrupted"], "bad.png", { type: "image/png" });
    await expect(compressImageToBase64(file)).rejects.toThrow("Falha ao carregar a imagem");
  });
});
