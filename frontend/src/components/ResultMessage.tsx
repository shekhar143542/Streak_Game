import type { GuessResponse } from "../types/game";

type ResultMessageProps = {
	result?: GuessResponse | null;
	alreadyPlayed?: boolean;
};

export function ResultMessage({ result, alreadyPlayed = false }: ResultMessageProps) {
	if (result) {
		return (
			<section
				className={`result-message ${result.correct ? "result-correct celebration-pop" : "result-wrong result-shake"}`}
				aria-live="polite"
			>
				{result.correct && <div className="celebration-badge">🎉 Correct!</div>}
				{!result.correct && <div className="wrong-badge">❌ Wrong!</div>}
				<p className="result-detail">Answer: <strong>{result.answer}</strong></p>
				<p className="result-streak">🔥 Streak: {result.streak}</p>
				<p className="result-note">Come back tomorrow!</p>
			</section>
		);
	}

	if (alreadyPlayed) {
		return <p className="played-message">You’ve already played today. Come back tomorrow!</p>;
	}

	return null;
}
