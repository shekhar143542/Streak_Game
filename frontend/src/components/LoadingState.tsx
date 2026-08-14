export function LoadingState() {
	return (
		<main className="page-shell">
			<section className="card status-card" aria-live="polite">
				<p className="eyebrow gold-eyebrow">STREAK</p>
				<h1 className="brand-title">Loading…</h1>
				<p className="subtitle">Retrieving player data and today’s challenge.</p>
				<div className="loading-spinner" aria-hidden="true" />
			</section>
		</main>
	);
}
