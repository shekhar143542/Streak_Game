import { useEffect } from "react";

type ToastProps = {
	message: string;
	onClose: () => void;
	duration?: number;
};

export function Toast({ message, onClose, duration = 3500 }: ToastProps) {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, duration);

		return () => {
			clearTimeout(timer);
		};
	}, [onClose, duration]);

	return (
		<aside className="toast-container" role="status" aria-live="assertive">
			<div className="toast-card">
				<span className="toast-icon" aria-hidden="true">⚠️</span>
				<p className="toast-text">{message}</p>
				<button type="button" className="toast-close" onClick={onClose} aria-label="Close notification">
					✕
				</button>
			</div>
		</aside>
	);
}
