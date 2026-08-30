import { PageShell, PolicySection } from "@/components/shop/PageShell";

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms and conditions"
      description="The basics of shopping with La Gracia."
      narrow
    >
      <div className="space-y-8">
        <PolicySection title="Orders">
          <p>
            By placing an order, you agree to provide accurate information and
            pay the listed price including applicable shipping.
          </p>
        </PolicySection>
        <PolicySection title="Products">
          <p>
            Product photos and descriptions are as accurate as possible. Slight
            variations in color and texture can occur with natural materials.
          </p>
        </PolicySection>
        <PolicySection title="Site use">
          <p>
            You agree not to misuse the site, attempt unauthorized access, or
            interfere with other customers’ experience.
          </p>
        </PolicySection>
        <PolicySection title="Updates">
          <p>
            We may update these terms as the store evolves. Continued use of the
            site means you accept the latest version.
          </p>
        </PolicySection>
      </div>
    </PageShell>
  );
}
