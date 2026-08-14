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
		<form className="guess-form" noValidate onSubmit={handleSubmit}>
			<label htmlFor="guess">Enter your guess</label>
			<input
				id="guess"
				name="guess"
				type="text"
				autoComplete="off"
				disabled={isFrozen}
				value={guess}
				placeholder={disabled ? "You have already played today" : "Type your answer…"}
				onChange={(event) => setGuess(event.target.value)}
			/>
			<p className="form-error" role="alert">{error}</p>
			<button type="submit" disabled={isFrozen}>
				{isSubmitting ? "Checking…" : disabled ? "Guess Submitted" : "Submit guess"}
			</button>
		</form>
	);
}
