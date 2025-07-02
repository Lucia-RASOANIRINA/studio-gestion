import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import auth from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Autoriser CORS pour ton frontend React (ajuste l'URL si besoin)
app.use(cors({
  origin: 'http://localhost:5173', // adresse du front (Vite par défaut)
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api', auth);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
