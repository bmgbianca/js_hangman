import mongoose from 'mongoose';
import { wordModel as word } from './Models/models.js';
import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import { router } from './Routes/routes.js';

import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', router);

const conectarMongoDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado ao banco de dados no MongoDB');
  } catch (error) {
    console.log(`Erro de conexão com o MongoDB: ${error}`);
    process.exit();
  }
};

app.listen(process.env.PORT || 8080, async () => {
  try {
    await conectarMongoDB();
    const databaseContent = await word.find();
    if (databaseContent.length === 0) {
      let wordsData = await fs.readFile('./validPortugueseWords.json');
      wordsData = JSON.parse(wordsData);
      for (let i = 0; i < wordsData.easy.length; i++) {
        const currentWord = wordsData.easy[i];
        await new word({
          word: currentWord,
          level: 'easy',
        }).save();
      }
      for (let i = 0; i < wordsData.normal.length; i++) {
        const currentWord = wordsData.normal[i];
        await new word({
          word: currentWord,
          level: 'normal',
        }).save();
      }
      for (let i = 0; i < wordsData.hard.length; i++) {
        const currentWord = wordsData.hard[i];
        await new word({
          word: currentWord,
          level: 'hard',
        }).save();
      }
      console.log('Base de dados carregada.');
    }
    console.log('Servidor iniciado');
  } catch (err) {
    console.log('Falha ao tentar levantar o servidor');
  }
});
