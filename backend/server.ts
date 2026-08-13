import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import { gameRouter } from './routes/game.routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get('/health', (_request, response) => {
	response.json({ ok: true });
});

app.use('/api/game', gameRouter);

app.use(errorMiddleware);

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

