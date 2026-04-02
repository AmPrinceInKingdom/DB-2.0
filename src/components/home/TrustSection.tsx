import SectionShell from "@/components/shared/SectionShell";

/**
 * Trust section for the homepage.
 * Shows simple reasons why users can trust the platform.
 */
export default function TrustSection() {
  const items = [
    {
      title: "Secure checkout",
      description: "Built with clean order, shipping, and payment flows.",
    },
    {
      title: "Verified reviews",
      description: "Real buyers can share feedback and ratings safely.",
    },
    {
      title: "Seller support",
      description: "Sellers can manage products, orders, and earnings easily.",
    },
    {
      title: "Admin control",
      description: "Full management for users, products, payments, and settings.",
    },
  ];

  return (
    <SectionShell
      title="Why shop with us?"
      subtitle="Simple reasons that make Deal Bazaar reliable and easy to use."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="db-panel p-5">
            <h3 className="text-base font-bold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}