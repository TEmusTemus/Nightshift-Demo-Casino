"use client";
import { CSSProperties, FormEvent, useEffect, useState } from "react";
type User = { id: number; username: string; balance: number };
const current = () => JSON.parse(localStorage.getItem("nightshift-user") || "null") as User | null;
const save = (user: User) => { localStorage.setItem("nightshift-user", JSON.stringify(user)); window.dispatchEvent(new Event("nightshift-user")); };
export function AccountForm({ mode }: { mode: "login" | "signup" }) { const [user, setUser] = useState<User | null>(null); const [message, setMessage] = useState(""); useEffect(() => setUser(current()), []); async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const f = new FormData(e.currentTarget); const r = await fetch(`/api/auth/${mode === "signup" ? "register" : "login"}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: f.get("username"), password: f.get("password") }) }); const b = await r.json(); if (!r.ok) return setMessage(b.error); save(b.user); setUser(b.user); setMessage(`Welcome, ${b.user.username}. Balance: ${b.user.balance} chips.`); } return <section className="app-panel"><h1>{mode === "signup" ? "Create your demo account" : "Sign in"}</h1>{user ? <p>{message}</p> : <form onSubmit={submit}><label>Username<input name="username" minLength={3} required /></label><label>Password<input name="password" type="password" minLength={6} required /></label><button className="button button--primary">{mode === "signup" ? "Create account" : "Sign in"}</button></form>}<p role="status">{message}</p><a href="/">Back to NIGHTSHIFT</a></section>; }
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const reelSymbols = (result: string) => [result, "✦", "7", "BAR", "♦", "$", result];

export function GameClient({ game }: { game: "slot" | "baccarat" }) {
  const [user, setUser] = useState<User | null>(null);
  const [bet, setBet] = useState(25);
  const [betType, setBetType] = useState("player");
  const [result, setResult] = useState("");
  const [playing, setPlaying] = useState(false);
  const [dealing, setDealing] = useState(false);
  const [symbols, setSymbols] = useState(["7", "BAR", "✦"]);
  const [cards, setCards] = useState({ player: ["?", "?"], banker: ["?", "?"] });

  useEffect(() => setUser(current()), []);

  async function play() {
    if (!user || playing) return setResult("Create an account or sign in before playing.");

    setPlaying(true);
    setResult("");
    const request = fetch(game === "slot" ? "/api/slot/spin" : "/api/baccarat/deal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(game === "slot" ? { userId: user.id, betAmount: bet } : { userId: user.id, betType, betAmount: bet }),
    });
    const [response] = await Promise.all([request, delay(game === "slot" ? 1600 : 350)]);
    const body = await response.json();

    if (!response.ok) {
      setPlaying(false);
      return setResult(body.error);
    }

    setUser(body.user);
    save(body.user);
    if (game === "slot") {
      setSymbols(body.symbols.map((symbol: string) => symbol.toUpperCase()));
      setPlaying(false);
      return setResult(`${body.symbols.join(" · ")} — payout ${body.payout} chips`);
    }

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
        <div className="slot-reel" key={index}>
          <div className="slot-reel__viewport">
            <div className="slot-reel__strip" style={{ "--reel-delay": `${index * -90}ms` } as CSSProperties}>
              {reelSymbols(symbol).map((reelSymbol, reelIndex) => <span className="slot-reel__symbol" key={`${reelSymbol}-${reelIndex}`}>{reelSymbol}</span>)}
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

  return <section className="app-panel"><a className="back-link" href="/">← Back to home</a><h1>{game === "slot" ? "Slot machine" : "Baccarat table"}</h1><p>Balance: <strong>{user?.balance ?? 0} chips</strong></p>{stage}{game === "baccarat" && <label>Bet on<select value={betType} onChange={(e) => setBetType(e.target.value)}><option value="player">Player</option><option value="banker">Banker</option><option value="tie">Tie</option></select></label>}<label>Bet amount<input type="number" min="1" value={bet} onChange={(e) => setBet(Number(e.target.value))} /></label><button className="button button--primary" disabled={playing} onClick={play}>{playing ? game === "slot" ? "Spinning…" : "Dealing…" : game === "slot" ? "Spin" : "Deal"}</button><p role="status">{result}</p></section>;
}
type History = { stats: { wagered: number; won: number; net: number; winRate: number }; transactions: Array<{ game_type: string; bet_amount: number; result: string; payout: number; created_at: string }> };
export function TopUp() { const [user, setUser] = useState<User | null>(null); const [amount, setAmount] = useState(500); const [message, setMessage] = useState(""); const [history, setHistory] = useState<History | null>(null); useEffect(() => setUser(current()), []); async function load() { if (!user) return; const r = await fetch(`/api/user/history?userId=${user.id}`); if (r.ok) setHistory(await r.json()); } useEffect(() => { void load(); }, [user?.id]); async function add() { if (!user) return setMessage("Sign in first."); const r = await fetch("/api/user/topup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, amount }) }); const b = await r.json(); if (!r.ok) return setMessage(b.error); setUser(b.user); save(b.user); setMessage(`Added ${amount} demo chips.`); } if (!user) return <section className="app-panel"><h1>Account</h1><p>Sign in to view your demo balance and transaction history.</p><a href="/login">Sign in</a></section>; return <section className="app-panel"><h1>Account dashboard</h1><p>Balance: <strong>{user.balance} chips</strong></p><label>Top-up amount<input type="number" min="1" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></label><button className="button button--primary" onClick={add}>Add demo chips</button><p role="status">{message}</p>{history && <><div className="stats"><p>Wagered: {history.stats.wagered}</p><p>Won: {history.stats.won}</p><p>Net: {history.stats.net}</p><p>Win rate: {history.stats.winRate}%</p></div><h2>Recent activity</h2><ul className="history">{history.transactions.length ? history.transactions.map((item, index) => <li key={`${item.created_at}-${index}`}>{item.game_type} · {item.result} · bet {item.bet_amount} · payout {item.payout}</li>) : <li>No activity yet. Start with a demo top-up.</li>}</ul></>}</section>; }
