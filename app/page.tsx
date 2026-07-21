import { GameEntry } from "../components/game-entry";
import { Navigation } from "../components/navigation";
import { OrbitConsole } from "../components/orbit-console";
import { SignalField } from "../components/signal-field";

export default function HomePage() {
  return (
    <main>
      <SignalField />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navigation />

      <section className="hero" id="main-content" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="hero__label">Virtual-chip casino</p>
          <h1 id="hero-title">Control the night. Play with virtual chips.</h1>
          <p className="hero__lede">Precision-built Slot and Baccarat for focused demo play.</p>
          <div className="hero__actions">
            <a className="button button--primary" href="/signup">
              Create demo account
            </a>
            <a className="button button--quiet" href="#games">
              Explore games
            </a>
          </div>
        </div>
        <OrbitConsole />
      </section>

      <section className="games" id="games" aria-labelledby="games-title">
        <div className="games__heading">
          <p className="section-label">Two modes. One clean signal.</p>
          <h2 id="games-title">Choose your table.</h2>
        </div>
        <div className="games__grid">
          <GameEntry title="Slot" href="/slot" description="Three reels. Pure momentum." />
          <GameEntry
            title="Baccarat"
            href="/baccarat"
            description="Player, banker, and disciplined odds."
          />
        </div>
      </section>

      <aside className="notice" aria-label="Demo currency notice">
        NIGHTSHIFT uses virtual chips only. No real-money play or prizes.
      </aside>
    </main>
  );
}
