import { useState, type FormEvent } from "react";

type GuessFormProps = {
	onSubmit: (guess: string) => Promise<string | null>;
};

export function GuessForm({ onSubmit }: GuessFormProps) {
	const [guess, setGuess] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
		event.preventDefault();
		if (isSubmitting) {
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

	return (
		<form className="guess-form" noValidate onSubmit={handleSubmit}>
			<label htmlFor="guess">Enter your guess</label>
			<input
				id="guess"
				name="guess"
				type="text"
				autoComplete="off"
				disabled={isSubmitting}
				value={guess}
				onChange={(event) => setGuess(event.target.value)}
			/>
			<p className="form-error" role="alert">{error}</p>
			<button type="submit" disabled={isSubmitting}>{isSubmitting ? "Checking…" : "Submit guess"}</button>
		</form>
	);
}
