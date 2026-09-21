/**
 * Utility to format and generate incident hash codes in the standard:
 * LTI-BUG-XXXXXX-YYYY-MM-DD-HH-MM
 */
export function formatTicketCode(ticket: {
  id?: string;
  ticketNumber?: number;
  createdAt?: Date | string;
}): string {
  const date = ticket.createdAt ? new Date(ticket.createdAt) : new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  let hash = "000000";
  if (ticket.id) {
    const clean = ticket.id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (clean.length >= 6) {
      hash = clean.slice(-6);
    } else if (clean.length > 0) {
      hash = clean.padStart(6, "0");
    }
  } else if (ticket.ticketNumber !== undefined) {
    hash = String(ticket.ticketNumber).padStart(6, "0");
  }

  return `LTI-BUG-${hash}-${year}-${month}-${day}-${hours}-${minutes}`;
}
