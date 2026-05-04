import { PageStub } from "@/components/layout/page-stub";

export default function CertificatesPage() {
  return (
    <PageStub
      title="Certificates"
      description="Auto-issued upon completion. Beautiful, verifiable, shareable."
      features={[
        "Self-Paced track: certificate at 80%+ lessons complete",
        "Fellowship track: 80% lessons + all assignments + Demo Day participation",
        "Elegant HTML/CSS → PDF certificate (Puppeteer)",
        "Student name in Playfair Display, gold seal, instructor signature",
        "Unique verification hash + QR code linking to /verify/[hash]",
        "Public verification page (no login required)",
        "LinkedIn 'Add to Profile' deep link",
      ]}
    />
  );
}
