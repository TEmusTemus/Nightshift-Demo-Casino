type GameEntryProps = {
  title: string;
  href: "/slot" | "/baccarat";
  description: string;
};

export function GameEntry({ title, href, description }: GameEntryProps) {
  return (
    <article className="game-entry">
      <p className="game-entry__signal" aria-hidden="true">
        0{title === "Slot" ? "1" : "2"}
      </p>
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={href}>Play {title}</a>
    </article>
  );
}
