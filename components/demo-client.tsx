"use client";
import { CSSProperties, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSession, type SessionUser } from "./session-client";
type User = SessionUser;
export function AccountForm({ mode }: { mode: "login" | "signup" }) { const { user, setUser } = useSession(); const [message, setMessage] = useState(""); async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); try { const f = new FormData(e.currentTarget); const r = await fetch(`/api/auth/${mode === "signup" ? "register" : "login"}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: f.get("username"), password: f.get("password") }) }); const b = await r.json(); if (!r.ok) return setMessage(b.error || "Unable to sign in."); setUser(b.user); setMessage(`Welcome, ${b.user.username}. Balance: ${b.user.balance} chips.`); } catch { setMessage("Network error. Please try again."); } } return <section className="app-panel"><h1>{mode === "signup" ? "Create your demo account" : "Sign in"}</h1>{user ? <p>{message || `Signed in as ${user.username}.`}</p> : <form onSubmit={submit}><label>Username<input name="username" minLength={3} required /></label><label>Password<input name="password" type="password" minLength={6} required /></label><button className="button button--primary">{mode === "signup" ? "Create account" : "Sign in"}</button></form>}<p role="status">{message}</p><Link href="/">Back to NIGHTSHIFT</Link></section>; }
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const SLOT_STOP_MS = [1700, 2000, 2300] as const;
const SLOT_LANDING_MS = 450;
const REEL_SYMBOLS = ["✦", "7", "BAR", "♦", "$"];
type ReelPhase = "spinning" | "landing" | "settled";
// Audio assets can be connected here without changing the animation lifecycle.
const playSpinSound = () => undefined;
const playStopSound = () => undefined;
const reelSymbols = (visible: string, result: string) => [visible, ...REEL_SYMBOLS, ...REEL_SYMBOLS, result];
const slotStopTimes = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? [0, 0, 0] as const : SLOT_STOP_MS;

export function GameClient({ game }: { game: "slot" | "baccarat" }) {
  const { user, setUser } = useSession();
  const [bet, setBet] = useState(25);
  const [betType, setBetType] = useState("player");
  const [result, setResult] = useState("");
  const [playing, setPlaying] = useState(false);
  const [dealing, setDealing] = useState(false);
  const [symbols, setSymbols] = useState(["7", "BAR", "✦"]);
  const [slotOutcome, setSlotOutcome] = useState(["7", "BAR", "✦"]);
  const [reelPhases, setReelPhases] = useState<ReelPhase[]>(["settled", "settled", "settled"]);
  const [cards, setCards] = useState({ player: ["?", "?"], banker: ["?", "?"] });

  function runSlotTimeline(outcome: string[]) {
    const stopTimes = slotStopTimes();
    setSlotOutcome(outcome);
    if (stopTimes[2] === 0) {
      setSymbols(outcome);
      setReelPhases(["settled", "settled", "settled"]);
      return Promise.resolve();
    }
    setReelPhases(["spinning", "spinning", "spinning"]);
    playSpinSound();
    stopTimes.forEach((stopAt, index) => {
      window.setTimeout(() => setReelPhases((phases) => phases.map((phase, reelIndex) => reelIndex === index ? "landing" : phase)), stopAt - SLOT_LANDING_MS);
      window.setTimeout(() => {
        setReelPhases((phases) => phases.map((phase, reelIndex) => reelIndex === index ? "settled" : phase));
        setSymbols((reels) => reels.map((symbol, reelIndex) => reelIndex === index ? outcome[index] : symbol));
        playStopSound();
      }, stopAt);
    });
    return delay(stopTimes[2]);
  }

  async function play() {
    if (playing) return;
    if (!user) {
      setResult("");
      setPlaying(true);
      if (game === "baccarat") {
        setCards({ player: ["A♠", "7♦"], banker: ["K♥", "3♣"] });
        setDealing(true);
        await delay(900);
        setDealing(false);
      } else {
        const previewOutcome = ["♦", "$", "7"];
        await runSlotTimeline(previewOutcome);
      }
      setPlaying(false);
      return setResult("Create an account or sign in to play with demo chips.");
    }

    setPlaying(true);
    setResult("");
    const request = fetch(game === "slot" ? "/api/slot/spin" : "/api/baccarat/deal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(game === "slot" ? { betAmount: bet } : { betType, betAmount: bet }),
    });
    const response = await request;
    if (game === "baccarat") await delay(350);
    const body = await response.json();

    if (!response.ok) {
      setPlaying(false);
      return setResult(body.error);
    }

    if (game === "slot") {
      const finalSymbols = body.symbols.map((symbol: string) => symbol.toUpperCase());
      await runSlotTimeline(finalSymbols);
      setUser(body.user);
      setPlaying(false);
      return setResult(`${body.symbols.join(" · ")} — payout ${body.payout} chips`);
    }

    setUser(body.user);
    setCards({ player: body.player, banker: body.banker });
    setDealing(true);
    await delay(900);
    setDealing(false);
    setPlaying(false);
    setResult(`Player ${body.playerScore} / Banker ${body.bankerScore} — ${body.outcome}; payout ${body.payout}`);
  }

  const stage = game === "slot" ? (
    <div className={playing ? "slot-machine slot-machine--spinning" : "slot-machine"} aria-label="Slot reels">
      {symbols.map((symbol, index) => (
        <div className={`slot-reel slot-reel--${reelPhases[index]}`} key={index}>
          <div className="slot-reel__viewport">
            <div className="slot-reel__strip" style={{ "--reel-duration": `${SLOT_STOP_MS[index]}ms`, "--reel-distance": "-99rem" } as CSSProperties}>
              {reelSymbols(symbol, slotOutcome[index]).map((reelSymbol, reelIndex) => <span className="slot-reel__symbol" key={`${reelSymbol}-${reelIndex}`}>{reelSymbol}</span>)}
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="baccarat-table" aria-label="Baccarat table">
      {["Player", "Banker"].map((side, sideIndex) => (
        <div key={side}><small>{side}</small><div className="card-row">
          {cards[side.toLowerCase() as "player" | "banker"].map((card, index) => <span className={`playing-card${dealing ? " playing-card--dealing" : ""}`} style={{ animationDelay: `${(index + sideIndex * 2) * 150}ms` }} key={`${side}-${index}-${card}`}>{card}</span>)}
        </div></div>
      ))}
    </div>
  );

  return <section className="app-panel"><a className="back-link" href="/">← Back to home</a><h1>{game === "slot" ? "Slot machine" : "Baccarat table"}</h1><p>Balance: <strong>{user?.balance ?? 0} chips</strong></p>{stage}{game === "baccarat" && <label>Bet on<select value={betType} onChange={(e) => setBetType(e.target.value)}><option value="player">Player</option><option value="banker">Banker</option><option value="tie">Tie</option></select></label>}<label>Bet amount<input type="number" min="1" value={bet} disabled={playing} onChange={(e) => setBet(Number(e.target.value))} /></label><button className="button button--primary" disabled={playing} onClick={play}>{playing ? game === "slot" ? "Spinning…" : "Dealing…" : game === "slot" ? "Spin" : "Deal"}</button><p role="status">{result}</p></section>;
}
type History = { stats: { wagered: number; won: number; net: number; winRate: number }; transactions: Array<{ game_type: string; bet_amount: number; result: string; payout: number; created_at: string }> };
export function TopUp() { const { user, setUser } = useSession(); const [amount, setAmount] = useState(500); const [message, setMessage] = useState(""); const [history, setHistory] = useState<History | null>(null); async function load() { if (!user) return; try { const r = await fetch("/api/user/history"); if (r.ok) setHistory(await r.json()); } catch { setMessage("Unable to load account activity."); } } useEffect(() => { void load(); }, [user?.id]); async function add() { if (!user) return setMessage("Sign in first."); try { const r = await fetch("/api/user/topup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount }) }); const b = await r.json(); if (!r.ok) return setMessage(b.error || "Unable to add chips."); setUser(b.user); setMessage(`Added ${amount} demo chips.`); await load(); } catch { setMessage("Network error. Please try again."); } } if (!user) return <section className="app-panel"><h1>Account</h1><p>Sign in to view your demo balance and transaction history.</p><Link href="/login">Sign in</Link></section>; return <section className="app-panel"><h1>Account dashboard</h1><p>Balance: <strong>{user.balance} chips</strong></p><label>Top-up amount<input type="number" min="1" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></label><button className="button button--primary" onClick={add}>Add demo chips</button><p role="status">{message}</p>{history && <><div className="stats"><p>Wagered: {history.stats.wagered}</p><p>Won: {history.stats.won}</p><p>Net: {history.stats.net}</p><p>Win rate: {history.stats.winRate}%</p></div><h2>Recent activity</h2><ul className="history">{history.transactions.length ? history.transactions.map((item, index) => <li key={`${item.created_at}-${index}`}>{item.game_type} · {item.result} · bet {item.bet_amount} · payout {item.payout}</li>) : <li>No activity yet. Start with a demo top-up.</li>}</ul></>}</section>; }
