import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import auth from './routes/auth';
import studioRoutes from './routes/studio.routes';
import clientRoutes from "./routes/client.routes";
import serviceRoutes from "./routes/service.routes";
import commandeRoutes from './routes/commandeRoutes';


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
app.use('/api', studioRoutes);
app.use("/api", clientRoutes);
app.use("/api", serviceRoutes);
app.use("/api", commandeRoutes);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
