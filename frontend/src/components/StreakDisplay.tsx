type StreakDisplayProps = {
	streak: number;
};

export function StreakDisplay({ streak }: StreakDisplayProps) {
	const subtext = streak > 0 ? "Keep the streak alive." : "Start your streak today.";

	return (
		<section className="card streak-card" aria-label={`Current streak: ${streak} days`}>
			<div className="streak-icon-wrap" aria-hidden="true">
				<span className="streak-flame">🔥</span>
			</div>
			<div className="streak-number">{streak}</div>
			<div className="streak-label">DAY STREAK</div>
			<p className="streak-subtext">{subtext}</p>
		</section>
	);
}
