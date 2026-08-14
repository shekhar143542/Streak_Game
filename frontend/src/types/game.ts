export type TodayPuzzle = {
	date: string;
	question: string;
};

export type PlayerStatus = {
	username: string;
	currentStreak: number;
	lastPlayedDate: string | null;
	hasPlayedToday: boolean;
};

export type GuessRequest = {
	username: string;
	guess: string; 
};

export type GuessResponse = {
	correct: boolean;
	streak: number;
	message: "Correct!" | "Wrong!";
	answer: string;
};
