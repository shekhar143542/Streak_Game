import { asc, count, gte } from "drizzle-orm";

import { db } from "./index";
import { dailyPuzzles } from "./schema";

const GAME_START_DATE = "2026-08-13";
const PUZZLE_COUNT = 100;

type PuzzleDefinition = {
	clue: string;
	answer: string;
};

const puzzleDefinitions: PuzzleDefinition[] = [
	{ clue: "What programming language runs in a Java Virtual Machine?", answer: "Java" },
	{ clue: "What markup language structures a web page?", answer: "HTML" },
	{ clue: "What language styles the appearance of web pages?", answer: "CSS" },
	{ clue: "What language adds interactivity to web pages?", answer: "JavaScript" },
	{ clue: "What version-control system uses commits and branches?", answer: "Git" },
	{ clue: "What database language is used to query relational data?", answer: "SQL" },
	{ clue: "What open-source operating system kernel powers many servers?", answer: "Linux" },
	{ clue: "What protocol securely loads websites in a browser?", answer: "HTTPS" },
	{ clue: "What device forwards data between computer networks?", answer: "Router" },
	{ clue: "What is the smallest unit of digital information?", answer: "Bit" },
	{ clue: "What planet is known as the Red Planet?", answer: "Mars" },
	{ clue: "What is the largest planet in our solar system?", answer: "Jupiter" },
	{ clue: "What planet is famous for its visible rings?", answer: "Saturn" },
	{ clue: "What star is at the center of our solar system?", answer: "Sun" },
	{ clue: "What natural satellite orbits Earth?", answer: "Moon" },
	{ clue: "What force pulls objects toward Earth?", answer: "Gravity" },
	{ clue: "What gas do plants take in during photosynthesis?", answer: "Carbon dioxide" },
	{ clue: "What gas do humans need to breathe?", answer: "Oxygen" },
	{ clue: "What is H2O commonly called?", answer: "Water" },
	{ clue: "What process turns liquid water into water vapor?", answer: "Evaporation" },
	{ clue: "What is the capital city of Japan?", answer: "Tokyo" },
	{ clue: "What is the capital city of France?", answer: "Paris" },
	{ clue: "What is the capital city of Australia?", answer: "Canberra" },
	{ clue: "What river flows through Egypt toward the Mediterranean Sea?", answer: "Nile" },
	{ clue: "What is the largest ocean on Earth?", answer: "Pacific" },
	{ clue: "What desert covers much of northern Africa?", answer: "Sahara" },
	{ clue: "What mountain range includes Mount Everest?", answer: "Himalayas" },
	{ clue: "What country is shaped like a boot in southern Europe?", answer: "Italy" },
	{ clue: "What continent contains the Amazon rainforest?", answer: "South America" },
	{ clue: "What country has the maple leaf on its flag?", answer: "Canada" },
	{ clue: "What animal is known for black and white stripes?", answer: "Zebra" },
	{ clue: "What animal has a long trunk?", answer: "Elephant" },
	{ clue: "What animal is the largest land mammal?", answer: "Giraffe" },
	{ clue: "What animal builds dams in rivers?", answer: "Beaver" },
	{ clue: "What animal carries its home on its back?", answer: "Snail" },
	{ clue: "What insect makes honey?", answer: "Bee" },
	{ clue: "What bird cannot fly and is strongly associated with Antarctica?", answer: "Penguin" },
	{ clue: "What animal changes color to blend into its surroundings?", answer: "Chameleon" },
	{ clue: "What marine mammal is famous for its playful jumps?", answer: "Dolphin" },
	{ clue: "What animal has eight arms and lives in the ocean?", answer: "Octopus" },
	{ clue: "What fruit is yellow and curved?", answer: "Banana" },
	{ clue: "What fruit is red and has seeds on its outside?", answer: "Strawberry" },
	{ clue: "What citrus fruit is usually orange in color?", answer: "Orange" },
	{ clue: "What food is made by baking dough and is often sliced?", answer: "Bread" },
	{ clue: "What dairy food is commonly put on pizza?", answer: "Cheese" },
	{ clue: "What Italian dish has a crust, sauce, and toppings?", answer: "Pizza" },
	{ clue: "What Japanese dish commonly combines rice with raw fish?", answer: "Sushi" },
	{ clue: "What sweet frozen dessert is often served in a cone?", answer: "Ice cream" },
	{ clue: "What drink is brewed from roasted beans?", answer: "Coffee" },
	{ clue: "What utensil has prongs for picking up food?", answer: "Fork" },
	{ clue: "What tool is used to cut paper?", answer: "Scissors" },
	{ clue: "What object tells time using hands or numbers?", answer: "Clock" },
	{ clue: "What item opens a locked door?", answer: "Key" },
	{ clue: "What item keeps you dry in the rain?", answer: "Umbrella" },
	{ clue: "What object gives light when electricity flows through it?", answer: "Bulb" },
	{ clue: "What household appliance keeps food cold?", answer: "Refrigerator" },
	{ clue: "What vehicle travels on rails?", answer: "Train" },
	{ clue: "What vehicle flies in the sky with wings and engines?", answer: "Airplane" },
	{ clue: "What vehicle has two wheels and is powered by pedaling?", answer: "Bicycle" },
	{ clue: "What instrument has black and white keys?", answer: "Piano" },
	{ clue: "What instrument is played by blowing across a reed?", answer: "Clarinet" },
	{ clue: "What instrument typically has six strings?", answer: "Guitar" },
	{ clue: "What shape has three sides?", answer: "Triangle" },
	{ clue: "What shape has four equal sides and four right angles?", answer: "Square" },
	{ clue: "What number comes after nine?", answer: "Ten" },
	{ clue: "What mathematical operation combines two quantities?", answer: "Addition" },
	{ clue: "What is the value of pi rounded to two decimal places?", answer: "3.14" },
	{ clue: "What scientist developed the theory of relativity?", answer: "Einstein" },
	{ clue: "What scientist is associated with the law of gravity and an apple?", answer: "Newton" },
	{ clue: "What part of a plant absorbs water from the soil?", answer: "Roots" },
	{ clue: "What part of a flower is usually colorful and attracts pollinators?", answer: "Petal" },
	{ clue: "What organ pumps blood through the body?", answer: "Heart" },
	{ clue: "What organ is used for breathing?", answer: "Lungs" },
	{ clue: "What is the hard outer layer of a tooth called?", answer: "Enamel" },
	{ clue: "What layer protects Earth from harmful ultraviolet radiation?", answer: "Ozone" },
	{ clue: "What instrument measures temperature?", answer: "Thermometer" },
	{ clue: "What instrument measures atmospheric pressure?", answer: "Barometer" },
	{ clue: "What metal is liquid at room temperature?", answer: "Mercury" },
	{ clue: "What gemstone is the hardest natural substance?", answer: "Diamond" },
	{ clue: "What color results from mixing blue and yellow?", answer: "Green" },
	{ clue: "What color results from mixing red and blue?", answer: "Purple" },
	{ clue: "What season follows summer in the Northern Hemisphere?", answer: "Autumn" },
	{ clue: "What day comes after Friday?", answer: "Saturday" },
	{ clue: "What month has the fewest days?", answer: "February" },
	{ clue: "What holiday is celebrated on January 1?", answer: "New Year" },
	{ clue: "What device is used to take photographs?", answer: "Camera" },
	{ clue: "What device lets you hear someone far away using a phone network?", answer: "Telephone" },
	{ clue: "What device displays a computer's visual output?", answer: "Monitor" },
	{ clue: "What computer input device moves a pointer on screen?", answer: "Mouse" },
	{ clue: "What computer input device contains letter keys?", answer: "Keyboard" },
	{ clue: "What storage device commonly uses flash memory and plugs into USB?", answer: "Flash drive" },
	{ clue: "What technology identifies objects using radio waves and tags?", answer: "RFID" },
	{ clue: "What wireless technology commonly connects headphones to a phone?", answer: "Bluetooth" },
	{ clue: "What network technology provides wireless internet at home?", answer: "Wi-Fi" },
	{ clue: "What service translates domain names into IP addresses?", answer: "DNS" },
	{ clue: "What term describes software whose source code is publicly available?", answer: "Open source" },
	{ clue: "What cybersecurity attack tricks people into revealing credentials?", answer: "Phishing" },
	{ clue: "What secret code helps protect an online account?", answer: "Password" },
	{ clue: "What term means a copy of data kept for recovery?", answer: "Backup" },
	{ clue: "What bird is traditionally associated with wisdom?", answer: "Owl" },
];

type SeedPuzzle = PuzzleDefinition & {
	puzzleDate: Date;
	date: string;
};

function formatCalendarDate(value: Date): string {
	return value.toISOString().slice(0, 10);
}

function addUtcDays(startDate: string, offset: number): Date {
	const value = new Date(`${startDate}T00:00:00.000Z`);
	value.setUTCDate(value.getUTCDate() + offset);
	return value;
}

function validateSeedPuzzles(puzzles: SeedPuzzle[]): void {
	if (puzzles.length !== PUZZLE_COUNT) {
		throw new Error(`Seed dataset must contain exactly ${PUZZLE_COUNT} puzzles.`);
	}

	const dates = new Set(puzzles.map((puzzle) => puzzle.date));
	const clues = new Set(puzzles.map((puzzle) => puzzle.clue));
	const answers = new Set(puzzles.map((puzzle) => puzzle.answer));

	if (dates.size !== PUZZLE_COUNT || clues.size !== PUZZLE_COUNT || answers.size !== PUZZLE_COUNT) {
		throw new Error("Seed dataset contains duplicate dates, clues, or answers.");
	}

	for (const puzzle of puzzles) {
		if (!puzzle.clue.trim() || !puzzle.answer.trim()) {
			throw new Error("Seed dataset contains an empty clue or answer.");
		}

		if (!/^\d{4}-\d{2}-\d{2}$/.test(puzzle.date) || formatCalendarDate(puzzle.puzzleDate) !== puzzle.date) {
			throw new Error(`Seed dataset contains an invalid date: ${puzzle.date}`);
		}
	}
}

const seedPuzzles: SeedPuzzle[] = puzzleDefinitions.map((puzzle, index) => {
	const puzzleDate = addUtcDays(GAME_START_DATE, index);
	return { ...puzzle, puzzleDate, date: formatCalendarDate(puzzleDate) };
});

async function seed(): Promise<void> {
	validateSeedPuzzles(seedPuzzles);

	const inserted = await db
		.insert(dailyPuzzles)
		.values(seedPuzzles.map(({ clue, answer, puzzleDate }) => ({ clue, answer, puzzleDate })))
		.onConflictDoNothing({ target: dailyPuzzles.puzzleDate })
		.returning({ puzzleDate: dailyPuzzles.puzzleDate });

	const firstDate = seedPuzzles[0].date;
	const lastDate = seedPuzzles.at(-1)!.date;
	const storedPuzzles = await db
		.select({
			puzzleDate: dailyPuzzles.puzzleDate,
			clue: dailyPuzzles.clue,
			answer: dailyPuzzles.answer,
		})
		.from(dailyPuzzles)
		.where(gte(dailyPuzzles.puzzleDate, seedPuzzles[0].puzzleDate))
		.orderBy(asc(dailyPuzzles.puzzleDate));

	const expectedByDate = new Map(seedPuzzles.map((puzzle) => [puzzle.date, puzzle]));
	const seededRange = storedPuzzles.filter((puzzle) => puzzle.puzzleDate <= seedPuzzles.at(-1)!.puzzleDate);

	if (seededRange.length !== PUZZLE_COUNT) {
		throw new Error(`Expected ${PUZZLE_COUNT} puzzles from ${firstDate} through ${lastDate}; found ${seededRange.length}.`);
	}

	for (const puzzle of seededRange) {
		const date = formatCalendarDate(puzzle.puzzleDate);
		const expected = expectedByDate.get(date);
		if (!expected || expected.clue !== puzzle.clue || expected.answer !== puzzle.answer) {
			throw new Error(`Existing puzzle data conflicts with the seed for ${date}.`);
		}
	}

	const [{ total }] = await db.select({ total: count() }).from(dailyPuzzles);

	console.log(`Seed complete: ${inserted.length} inserted, ${seededRange.length} verified.`);
	console.log(`Puzzle dates: ${firstDate} through ${lastDate}.`);
	console.log(`Total daily_puzzles rows: ${total}.`);
}

seed().catch((error: unknown) => {
	console.error(error);
	process.exitCode = 1;
});
