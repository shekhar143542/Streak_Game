import type { GuessResponse } from "../types/game";

type ResultMessageProps = {
	result?: GuessResponse;
	alreadyPlayed?: boolean;
};

export function ResultMessage({ result, alreadyPlayed = false }: ResultMessageProps) {
	if (alreadyPlayed) {
		return <p className="played-message">You’ve already played today. Come back tomorrow!</p>;
	}

	if (!result) {
		return null;
	}

	return (
		<section className={result.correct ? "result-message result-correct" : "result-message result-wrong"} aria-live="polite">
			<h2>{result.correct ? "🎉 " : "❌ "}{result.message}</h2>
			<p>Answer: <strong>{result.answer}</strong></p>
			<p>🔥 {result.streak} day streak</p>
			<p>Come back tomorrow!</p>
		</section>
	);
}
