import { useState, type FormEvent } from "react";

const MAX_USERNAME_LENGTH = 50;

type UsernameFormProps = {
	onSubmit: (username: string) => void;
};

export function UsernameForm({ onSubmit }: UsernameFormProps) {
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		const trimmedUsername = username.trim();
		if (!trimmedUsername || trimmedUsername.length > MAX_USERNAME_LENGTH) {
			setError("Enter a username between 1 and 50 characters.");
			return;
		}

		onSubmit(trimmedUsername);
	}

	return (
		<main className="page-shell">
			<section className="card onboarding-card" aria-labelledby="streak-title">
				<p className="eyebrow">DAILY MYSTERY WORD</p>
				<h1 id="streak-title">STREAK</h1>
				<p className="subtitle">Your daily challenge</p>
				<form className="username-form" noValidate onSubmit={handleSubmit}>
					<label htmlFor="username">Enter your username</label>
					<input
						id="username"
						name="username"
						type="text"
						maxLength={MAX_USERNAME_LENGTH}
						autoComplete="username"
						required
						autoFocus
						value={username}
						onChange={(event) => setUsername(event.target.value)}
					/>
					<p className="form-error" role="alert">{error}</p>
					<button type="submit">Start playing</button>
				</form>
			</section>
		</main>
	);
}
