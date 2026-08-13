import type { TodayPuzzle } from "../types/game";

type PuzzleCardProps = {
	puzzle: TodayPuzzle;
};

function formatPuzzleDate(date: string): string {
	return new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(`${date}T00:00:00.000Z`));
}

export function PuzzleCard({ puzzle }: PuzzleCardProps) {
	return (
		<section className="puzzle" aria-labelledby="puzzle-title">
			<p className="eyebrow">TODAY’S PUZZLE</p>
			<h2 id="puzzle-title">{puzzle.question}</h2>
			<p className="puzzle-date">Date: {formatPuzzleDate(puzzle.date)}</p>
		</section>
	);
}
