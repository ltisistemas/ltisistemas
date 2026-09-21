import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock Next.js router & navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/suporte/chamados",
  useSearchParams: () => new URLSearchParams(),
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

// Mock Next.js headers
vi.mock("next/headers", () => {
  const cookieMap = new Map<string, any>();
  return {
    cookies: async () => ({
      get: (name: string) => cookieMap.get(name),
      set: (name: string, value: string, options?: any) => {
        cookieMap.set(name, { name, value, ...options });
      },
      delete: (name: string) => {
        cookieMap.delete(name);
      },
    }),
  };
});
