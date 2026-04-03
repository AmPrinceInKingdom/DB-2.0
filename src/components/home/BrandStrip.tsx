/**
 * Brand strip section.
 * Keeps the homepage visually balanced and gives a simple premium feel.
 */
export default function BrandStrip() {
  const items = [
    "Trusted Checkout",
    "Verified Reviews",
    "Seller Friendly",
    "Admin Ready",
    "Mobile First",
  ];

  return (
    <section className="db-container pb-10 md:pb-14">
      <div className="db-card flex flex-wrap items-center justify-center gap-3 p-4 md:gap-4 md:p-5">
        {items.map((item) => (
          <span key={item} className="db-badge db-badge-muted">
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}