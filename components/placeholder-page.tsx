type PlaceholderPageProps = {
  title: string;
  description: string;
  returnHref: "/";
};

export function PlaceholderPage({ title, description, returnHref }: PlaceholderPageProps) {
  return (
    <main className="placeholder-page">
      <section className="placeholder-page__content" aria-labelledby="placeholder-title">
        <p className="placeholder-page__label">NIGHTSHIFT / demo access</p>
        <h1 id="placeholder-title">{title}</h1>
        <p className="placeholder-page__description">{description}</p>
        <a className="button button--primary" href={returnHref}>
          Back to NIGHTSHIFT
        </a>
      </section>
    </main>
  );
}
