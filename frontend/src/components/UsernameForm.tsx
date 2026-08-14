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
			<section className="card onboarding-card" aria-labelledby="onboarding-title">
				<div className="card-header text-center">
					<p className="eyebrow gold-eyebrow">DAILY MYSTERY WORD</p>
					<h1 id="onboarding-title" className="brand-title">STREAK</h1>
					<p className="brand-subtitle">One puzzle. One guess. Every day.</p>
				</div>
				<form className="username-form" noValidate onSubmit={handleSubmit}>
					<label htmlFor="username-input" className="form-label">Enter your username</label>
					<input
						id="username-input"
						name="username"
						type="text"
						maxLength={MAX_USERNAME_LENGTH}
						autoComplete="username"
						required
						autoFocus
						placeholder="e.g. alex99"
						value={username}
						onChange={(event) => setUsername(event.target.value)}
					/>
					{error && <p className="form-error" role="alert">{error}</p>}
					<button type="submit" className="submit-button">Start playing</button>
				</form>
			</section>
		</main>
	);
}
