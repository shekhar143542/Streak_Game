import { useState, type FormEvent } from "react";

type GuessFormProps = {
	onSubmit: (guess: string) => Promise<string | null>;
	disabled?: boolean;
};

export function GuessForm({ onSubmit, disabled = false }: GuessFormProps) {
	const [guess, setGuess] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
		event.preventDefault();
		if (disabled || isSubmitting) {
			return;
		}

		const trimmedGuess = guess.trim();
		if (!trimmedGuess) {
			setError("Please enter a guess.");
			return;
		}

		setError("");
		setIsSubmitting(true);
		const submissionError = await onSubmit(trimmedGuess);
		if (submissionError) {
			setError(submissionError);
		}
		setIsSubmitting(false);
	}

	const isFrozen = disabled || isSubmitting;

	return (
		<section className="card guess-card" aria-labelledby="guess-heading">
			<p id="guess-heading" className="eyebrow">YOUR GUESS</p>
			<form className="guess-form" noValidate onSubmit={handleSubmit}>
				<label htmlFor="guess-input" className="sr-only">Enter your answer</label>
				<input
					id="guess-input"
					name="guess"
					type="text"
					autoComplete="off"
					disabled={isFrozen}
					value={guess}
					placeholder="Enter your answer..."
					aria-describedby={error ? "guess-error" : undefined}
					onChange={(event) => setGuess(event.target.value)}
				/>
				{error && <p id="guess-error" className="form-error" role="alert">{error}</p>}
				<button type="submit" className="submit-button" disabled={isFrozen}>
					{isSubmitting ? "Checking..." : disabled ? "Guess Completed" : "Submit Guess"}
				</button>
			</form>
		</section>
	);
}
