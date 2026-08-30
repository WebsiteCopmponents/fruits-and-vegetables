import { PageShell, PolicySection } from "@/components/shop/PageShell";

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy policy"
      description="How La Gracia collects and uses your information."
      narrow
    >
      <div className="space-y-8">
        <PolicySection title="What we collect">
          <p>
            We collect information you provide at checkout or account creation —
            such as name, email, shipping address, and order details.
          </p>
        </PolicySection>
        <PolicySection title="How we use it">
          <p>
            We use your information to fulfill orders, provide support, and
            improve the site. We do not sell personal data.
          </p>
        </PolicySection>
        <PolicySection title="Cookies">
          <p>
            We use essential cookies for cart and session functionality, and
            optional analytics to understand site usage. You can accept all,
            keep essential cookies only, or reject optional cookies via the
            cookie banner.
          </p>
        </PolicySection>
        <PolicySection title="Contact">
          <p>
            Questions about privacy? Email hello@lagracia.com or use our Contact
            page.
          </p>
        </PolicySection>
      </div>
    </PageShell>
  );
}
