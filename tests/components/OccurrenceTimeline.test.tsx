import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { OccurrenceTimeline } from "@/components/suporte/OccurrenceTimeline";
import { TicketOccurrenceItem } from "@/lib/actions/ticket-actions";
import { IncidentOrigin } from "@prisma/client";

describe("components/suporte/OccurrenceTimeline", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const sampleOccurrences: TicketOccurrenceItem[] = [
    {
      id: "occ_1",
      origin: IncidentOrigin.BACK,
      occurredAt: new Date("2026-09-21T14:30:00Z"),
      sourceUrl: "https://api.empresa.com/checkout",
      targetUrl: "https://db.empresa.com",
      stackTrace: "Error: DB Connection Failed\n  at pg.connect()",
      payload: '{\n  "cartId": 123,\n  "password": "[REDACTED]"\n}',
      headers: null,
      createdAt: new Date("2026-09-21T14:30:00Z"),
    },
    {
      id: "occ_2",
      origin: IncidentOrigin.FRONT,
      occurredAt: new Date("2026-09-21T14:00:00Z"),
      sourceUrl: "https://app.empresa.com/login",
      targetUrl: null,
      stackTrace: "TypeError: undefined is not a function",
      payload: null,
      headers: null,
      createdAt: new Date("2026-09-21T14:00:00Z"),
    },
  ];

  it("should render placeholder when occurrences list is empty", () => {
    render(<OccurrenceTimeline occurrences={[]} />);
    expect(
      screen.getByText(/Nenhum registro detalhado de ocorrência/i)
    ).toBeInTheDocument();
  });

  it("should render list of occurrences, origin badges and details", () => {
    render(<OccurrenceTimeline occurrences={sampleOccurrences} />);

    expect(screen.getByText(/Histórico de Ocorrências & Telemetria \(2\)/i)).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Última Ocorrência")).toBeInTheDocument();

    expect(screen.getByText("https://api.empresa.com/checkout")).toBeInTheDocument();
    expect(screen.getByText(/Error: DB Connection Failed/i)).toBeInTheDocument();
  });

  it("should toggle expand and collapse of occurrence details", () => {
    render(<OccurrenceTimeline occurrences={sampleOccurrences} />);

    // occ_1 is expanded by default
    expect(screen.getByText(/Log de Erro \/ Stack-Trace/i)).toBeInTheDocument();

    const toggleButtons = screen.getAllByRole("button", { name: /Detalhes|Telemetria/i });
    fireEvent.click(toggleButtons[0]);

    // Now collapsed
    expect(screen.queryByText(/Log de Erro \/ Stack-Trace/i)).toBeNull();
  });

  it("should copy stack trace and payload to clipboard when clicking copy buttons", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<OccurrenceTimeline occurrences={sampleOccurrences} />);

    const copyLogBtn = screen.getByText("Copiar Log");
    await act(async () => {
      fireEvent.click(copyLogBtn);
    });

    expect(writeTextMock).toHaveBeenCalledWith(
      "Error: DB Connection Failed\n  at pg.connect()"
    );

    const copyJsonBtn = screen.getByText("Copiar JSON");
    await act(async () => {
      fireEvent.click(copyJsonBtn);
    });

    expect(writeTextMock).toHaveBeenCalledWith(
      '{\n  "cartId": 123,\n  "password": "[REDACTED]"\n}'
    );
  });
});
