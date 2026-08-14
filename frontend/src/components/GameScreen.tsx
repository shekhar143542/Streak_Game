import type { GuessResponse, PlayerStatus, TodayPuzzle } from "../types/game";
import { GuessForm } from "./GuessForm";
import { PuzzleCard } from "./PuzzleCard";
import { ResultMessage } from "./ResultMessage";
import { StreakCalendar } from "./StreakCalendar";
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

export function GameScreen({
	username,
	player,
	puzzle,
	onChangeUsername,
	result,
	alreadyPlayed,
	onSubmitGuess,
}: GameScreenProps) {
	const isFrozen = Boolean(result || alreadyPlayed);

	return (
		<main className="page-shell">
			<div className="game-container">
				{/* Top Branding Header */}
				<header className="brand-header">
					<div className="brand-titles">
						<h1 className="brand-title">STREAK</h1>
						<p className="brand-subtitle">One puzzle. One guess. Every day.</p>
					</div>
					<div className="user-badge-bar">
						<span className="user-badge">Playing as <strong>{username}</strong></span>
						<button className="text-button" type="button" onClick={onChangeUsername}>
							Change username
						</button>
					</div>
				</header>

				{/* 2-Column Responsive Layout */}
				<div className="game-layout">
					{/* Main Column: Gameplay Flow */}
					<div className="game-main-column">
						{/* 1. Streak Card */}
						<StreakDisplay streak={player.currentStreak} />

						{/* 2. Today's Puzzle Card */}
						<PuzzleCard puzzle={puzzle} />

						{/* 3. Your Guess Card */}
						<GuessForm onSubmit={onSubmitGuess} disabled={isFrozen} />

						{/* 4. Result / Celebration Card */}
						{(result || alreadyPlayed) && (
							<ResultMessage result={result} alreadyPlayed={alreadyPlayed && !result} />
						)}
					</div>

					{/* Sidebar Column: Streak Calendar */}
					<aside className="game-sidebar-column">
						<StreakCalendar puzzleDate={puzzle.date} hasPlayedToday={alreadyPlayed} />
					</aside>
				</div>
			</div>
		</main>
	);
}
