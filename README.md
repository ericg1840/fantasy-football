# Fantasy Football HQ

A self-contained, static web app for drafting and managing a fantasy football team — no build step, no backend, no signup. All data lives in your browser's `localStorage`.

## Running it

Just open `index.html` in a browser, or serve the folder statically:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

It also deploys as-is to any static host (Netlify, GitHub Pages, Vercel, S3, etc.) — there's nothing to build.

## Features

- **Draft Board** — searchable/sortable/filterable player pool (rank, tier, position, team, bye week). Mark players drafted to your team or taken by someone else; undo any pick.
- **My Team** — assign drafted players to your season-long starting lineup (QB/RB/RB/WR/WR/TE/FLEX/DST/K by default, configurable). Unassigned players sit on the bench.
- **Weekly Lineup** — per-week view that starts from your default lineup but can be overridden independently each week. Bye weeks and injury statuses (Healthy/Questionable/Doubtful/Out/IR) are flagged automatically. **Auto-Optimize** swaps any starter who's on bye or hurt for your best healthy bench option at that position, without touching your season default plan.
- **Import/Export** — paste or upload a CSV (`name,pos,team,bye,rank,tier`) to refresh rankings at any time (e.g. from FantasyPros/ESPN/Yahoo exports); draft/injury status is preserved by name+position match. Export your player pool as CSV or the full app state as a JSON backup, and restore from backup.
- **League settings** — customize roster slots (comma-separated, e.g. `QB,RB,RB,WR,WR,WR,TE,FLEX,DST,K`).

## About the seed data

The bundled player list (`data/players.js`) is a general pre-season reference set — approximate ranks, teams, and bye weeks. It **will** drift from reality as news, trades, and depth charts change. Use the Import CSV feature on the Import/Export tab to bring in current rankings whenever you want; it's the recommended way to keep data fresh throughout the season.
