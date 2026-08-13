type StreakDisplayProps = {
	streak: number;
};

export function StreakDisplay({ streak }: StreakDisplayProps) {
	return <div className="streak-count" aria-label={`${streak} day streak`}>🔥 {streak} day streak</div>;
}
