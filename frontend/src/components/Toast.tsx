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
		<div className="toast-container" role="status" aria-live="assertive">
			<div className="toast-message">
				<span className="toast-icon">⚠️</span>
				<span>{message}</span>
			</div>
		</div>
	);
}
