import { describe, it, expect } from "vitest";
import {
  inspectCertificate,
  signDpsXml,
  canonicalizeXml,
} from "@/lib/services/nfse/nfse-signer";

describe("nfse-signer", () => {
  it("should inspect certificate and validate structure", () => {
    const fakeCert = Buffer.from("FAKE_CERT_DATA_FOR_TESTING");
    const details = inspectCertificate(fakeCert);

    expect(details.isValid).toBe(true);
    expect(details.isExpired).toBe(false);
    expect(details.subject).toContain("LTI SISTEMAS");
    expect(details.fingerprint).toBeDefined();
  });

  it("should handle empty or broken certificate buffer", () => {
    const broken = inspectCertificate(Buffer.from(""));
    expect(broken.isValid).toBe(false);
    expect(broken.error).toBeDefined();
  });

  it("should canonicalize XML snippets properly", () => {
    const raw = `
      <DPS>
        <infDPS>   </infDPS>
      </DPS>
    `;
    const c14n = canonicalizeXml(raw);
    expect(c14n).not.toContain("\r\n");
    expect(c14n).toContain("<DPS><infDPS></infDPS></DPS>");
  });

  it("should generate Enveloped XML Signature with Digest and SignatureValue", () => {
    const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<DPS xmlns="http://www.sped.fazenda.gov.br/nfse" versao="1.00">
  <infDPS id="DPS26116062000000000000105">
    <tpAmb>2</tpAmb>
    <prest><CNPJ>08527847000107</CNPJ></prest>
  </infDPS>
</DPS>`;

    const res = signDpsXml({
      xml: sampleXml,
      isSimulator: true,
    });

    expect(res.signedXml).toContain("<Signature xmlns=\"http://www.w3.org/2000/09/xmldsig#\">");
    expect(res.signedXml).toContain("<SignedInfo");
    expect(res.signedXml).toContain("<SignatureValue>");
    expect(res.signedXml).toContain("<DigestValue>");
    expect(res.digestValue).toBeDefined();
    expect(res.signatureValue).toBeDefined();
    expect(res.signedXml).toContain("</DPS>");
  });
});
