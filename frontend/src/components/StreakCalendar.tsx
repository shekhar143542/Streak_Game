type StreakCalendarProps = {
	puzzleDate: string;
	hasPlayedToday: boolean;
};

export function StreakCalendar({ puzzleDate, hasPlayedToday }: StreakCalendarProps) {
	// Parse the date components from puzzleDate (YYYY-MM-DD)
	const [yearStr, monthStr, dayStr] = puzzleDate.split("-");
	const year = Number(yearStr) || new Date().getUTCFullYear();
	const monthIndex = (Number(monthStr) || (new Date().getUTCMonth() + 1)) - 1; // 0-indexed
	const todayDay = Number(dayStr) || new Date().getUTCDate();

	// Month display name
	const monthName = new Intl.DateTimeFormat("en-US", {
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(Date.UTC(year, monthIndex, todayDay)));

	// Total days in the month
	const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();

	// First day of month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
	const rawFirstDay = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
	// Shift to Monday-first: 0 = Mon, 1 = Tue, ..., 6 = Sun
	const startOffset = (rawFirstDay + 6) % 7;

	// Weekday abbreviations
	const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

	const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);
	const blankOffsets = Array.from({ length: startOffset }, (_, index) => index);

	return (
		<section className="card calendar-card" aria-labelledby="calendar-title">
			<div className="calendar-card-header">
				<div className="calendar-header-titles">
					<p className="eyebrow gold-eyebrow">STREAK CALENDAR</p>
					<h2 id="calendar-title" className="calendar-month">{monthName}</h2>
				</div>
				<div className="calendar-month-badge" aria-hidden="true">
					<span>📅</span>
				</div>
			</div>

			<div className="calendar-grid" role="grid" aria-label={`Calendar for ${monthName}`}>
				<div className="calendar-weekdays" role="row">
					{weekdays.map((day, idx) => (
						<div key={idx} className="calendar-weekday" role="columnheader" aria-label={`Weekday ${day}`}>
							{day}
						</div>
					))}
				</div>

				<div className="calendar-days">
					{blankOffsets.map((_, idx) => (
						<div key={`blank-${idx}`} className="calendar-day day-empty" aria-hidden="true" />
					))}

					{daysArray.map((day) => {
						const isToday = day === todayDay;
						const isPast = day < todayDay;
						const isFuture = day > todayDay;
						const isCompleted = isToday && hasPlayedToday;

						let dayClass = "calendar-day";
						if (isCompleted) {
							dayClass += " day-completed";
						} else if (isToday) {
							dayClass += " day-today";
						} else if (isPast) {
							dayClass += " day-past";
						} else if (isFuture) {
							dayClass += " day-future";
						}

						return (
							<div
								key={day}
								className={dayClass}
								role="gridcell"
								aria-current={isToday ? "date" : undefined}
								aria-label={`${monthName} ${day}${isCompleted ? ", Completed" : isToday ? ", Today" : ""}`}
							>
								<span className="day-number">{day}</span>
								{isCompleted && <span className="day-badge" title="Completed">✓</span>}
							</div>
						);
					})}
				</div>
			</div>

			<div className="calendar-legend">
				<div className="legend-item">
					<span className="legend-dot dot-completed" />
					<span>Completed</span>
				</div>
				<div className="legend-item">
					<span className="legend-dot dot-today" />
					<span>Today</span>
				</div>
				<div className="legend-item">
					<span className="legend-dot dot-upcoming" />
					<span>Upcoming</span>
				</div>
			</div>
		</section>
	);
}
