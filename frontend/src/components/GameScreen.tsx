import type { GuessResponse, PlayerStatus, TodayPuzzle } from "../types/game";
import { GuessForm } from "./GuessForm";
import { PuzzleCard } from "./PuzzleCard";
import { ResultMessage } from "./ResultMessage";
import { StreakDisplay } from "./StreakDisplay";

type GameScreenProps = {
	username: string;
	player: PlayerStatus;
	puzzle: TodayPuzzle;
	onChangeUsername: () => void;
	result: GuessResponse | null;
	alreadyPlayed: boolean;
	onSubmitGuess: (guess: string) => Promise<string | null>;
};

function formatPuzzleDate(date: string): string {
	return new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(`${date}T00:00:00.000Z`));
}

export function GameScreen({ username, player, puzzle, onChangeUsername, result, alreadyPlayed, onSubmitGuess }: GameScreenProps) {
	return (
		<main className="page-shell">
			<section className="card game-card" aria-labelledby="game-title">
				<header className="game-header">
					<div>
						<p className="eyebrow">DAILY MYSTERY WORD</p>
						<h1 id="game-title">STREAK</h1>
					</div>
					<button className="text-button" type="button" onClick={onChangeUsername}>Change username</button>
				</header>
				<p className="welcome">Playing as <strong>{username}</strong></p>
				<StreakDisplay streak={player.currentStreak} />
				{player.lastPlayedDate && <p className="last-played">Last played: {formatPuzzleDate(player.lastPlayedDate)}</p>}
				<PuzzleCard puzzle={puzzle} />
				{result || alreadyPlayed
					? <ResultMessage result={result ?? undefined} alreadyPlayed={alreadyPlayed && !result} />
					: <GuessForm onSubmit={onSubmitGuess} />}
			</section>
		</main>
	);
}
