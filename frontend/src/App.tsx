import { useEffect, useState } from "react";

import { ApiError } from "./api/client";
import { getTodayPuzzle, submitGuess } from "./api/gameApi";
import { getPlayer } from "./api/playerApi";
import { GameScreen } from "./components/GameScreen";
import { LoadingState } from "./components/LoadingState";
import { Toast } from "./components/Toast";
import { UsernameForm } from "./components/UsernameForm";
import type { GuessResponse, PlayerStatus, TodayPuzzle } from "./types/game";

const USERNAME_STORAGE_KEY = "streak_username";
const MAX_USERNAME_LENGTH = 50;

function getStoredUsername(): string | null {
	const username = localStorage.getItem(USERNAME_STORAGE_KEY)?.trim();
	if (!username || username.length > MAX_USERNAME_LENGTH) {
		localStorage.removeItem(USERNAME_STORAGE_KEY);
		return null;
	}

	return username;
}

type ErrorStateProps = {
	message: string;
	onRetry: () => void;
};

function ErrorState({ message, onRetry }: ErrorStateProps) {
	return (
		<main className="page-shell">
			<section className="card status-card" role="alert">
				<p className="eyebrow">STREAK</p>
				<h1>We couldn’t load your game.</h1>
				<p className="subtitle">{message}</p>
				<button type="button" onClick={onRetry}>Try again</button>
			</section>
		</main>
	);
}

export function App() {
	const [username, setUsername] = useState<string | null>(getStoredUsername);
	const [player, setPlayer] = useState<PlayerStatus | null>(null);
	const [puzzle, setPuzzle] = useState<TodayPuzzle | null>(null);
	const [isLoading, setIsLoading] = useState(Boolean(username));
	const [hasError, setHasError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [reloadKey, setReloadKey] = useState(0);
	const [guessResult, setGuessResult] = useState<GuessResponse | null>(null);
	const [toastMessage, setToastMessage] = useState<string | null>(null);

	useEffect(() => {
		if (!username) {
			return;
		}

		let isCurrent = true;
		setIsLoading(true);
		setHasError(false);
		setErrorMessage("");
		setGuessResult(null);
		setToastMessage(null);

		void Promise.all([getPlayer(username), getTodayPuzzle()])
			.then(([storedPlayer, todayPuzzle]) => {
				if (!isCurrent) {
					return;
				}

				setPlayer(storedPlayer ?? {
					username,
					currentStreak: 0,
					lastPlayedDate: null,
					hasPlayedToday: false,
				});
				setPuzzle(todayPuzzle);
			})
			.catch((error: unknown) => {
				if (!isCurrent) {
					return;
				}

				setHasError(true);
				setErrorMessage(
					error instanceof ApiError && error.status === 404
						? "Today’s puzzle is not available yet. Please try again later."
						: "Unable to connect to the game server. Please try again.",
				);
			})
			.finally(() => {
				if (isCurrent) {
					setIsLoading(false);
				}
			});

		return () => {
			isCurrent = false;
		};
	}, [username, reloadKey]);

	function handleUsernameSubmit(nextUsername: string): void {
		localStorage.setItem(USERNAME_STORAGE_KEY, nextUsername);
		setIsLoading(true);
		setHasError(false);
		setUsername(nextUsername);
	}

	function handleChangeUsername(): void {
		localStorage.removeItem(USERNAME_STORAGE_KEY);
		setUsername(null);
		setPlayer(null);
		setPuzzle(null);
		setHasError(false);
		setErrorMessage("");
		setGuessResult(null);
		setToastMessage(null);
	}

	function handleRetry(): void {
		const storedUsername = getStoredUsername();
		if (!storedUsername) {
			setUsername(null);
			return;
		}

		setUsername(storedUsername);
		setReloadKey((value) => value + 1);
	}

	async function handleGuessSubmit(guess: string): Promise<string | null> {
		if (!username || !puzzle) {
			return "Unable to connect to the game server. Please try again.";
		}

		try {
			const result = await submitGuess(username, guess);
			setGuessResult(result);
			setPlayer((currentPlayer) => currentPlayer && {
				...currentPlayer,
				currentStreak: result.streak,
				lastPlayedDate: puzzle.date,
				hasPlayedToday: true,
			});
			return null;
		} catch (error) {
			if (error instanceof ApiError) {
				if (error.status === 409) {
					setToastMessage("You've already played today! Come back tomorrow.");
					setPlayer((currentPlayer) => currentPlayer && { ...currentPlayer, hasPlayedToday: true });
					return null;
				}

				if (error.status === 400) {
					return "Please enter a valid guess.";
				}

				if (error.status === 404) {
					return "Today’s puzzle is not available.";
				}
			}

			return "Unable to connect to the game server. Please try again.";
		}
	}

	if (!username) {
		return <UsernameForm onSubmit={handleUsernameSubmit} />;
	}

	if (isLoading) {
		return <LoadingState />;
	}

	if (hasError || !player || !puzzle) {
		return <ErrorState message={errorMessage} onRetry={handleRetry} />;
	}

	return (
		<>
			{toastMessage && (
				<Toast message={toastMessage} onClose={() => setToastMessage(null)} />
			)}
			<GameScreen
				username={username}
				player={player}
				puzzle={puzzle}
				onChangeUsername={handleChangeUsername}
				result={guessResult}
				alreadyPlayed={player.hasPlayedToday}
				onSubmitGuess={handleGuessSubmit}
			/>
		</>
	);
}
