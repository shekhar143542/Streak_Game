import type { GuessResponse } from "../types/game";

type ResultMessageProps = {
	result?: GuessResponse | null;
	alreadyPlayed?: boolean;
};

export function ResultMessage({ result, alreadyPlayed = false }: ResultMessageProps) {
	if (result) {
		const isCorrect = result.correct;

		return (
			<section
				className={`card result-card ${isCorrect ? "result-correct celebration-pop" : "result-wrong result-shake"}`}
				aria-live="polite"
				aria-label={isCorrect ? "Guess Correct" : "Guess Wrong"}
			>
				<div className="result-icon-wrap" aria-hidden="true">
					{isCorrect ? <span className="result-icon gold-sparkle">✨</span> : <span className="result-icon red-cross">❌</span>}
				</div>
				<h2 className="result-title">{isCorrect ? "CORRECT!" : "WRONG"}</h2>
				<p className="result-answer">
					Answer: <strong>{result.answer}</strong>
				</p>
				<p className="result-streak-badge">
					🔥 {result.streak} DAY STREAK
				</p>
				<p className="result-footer">Come back tomorrow.</p>
			</section>
		);
	}

	if (alreadyPlayed) {
		return (
			<section className="card result-card result-played" aria-live="polite">
				<p className="played-message">You’ve already played today. Come back tomorrow.</p>
			</section>
		);
	}

	return null;
}
