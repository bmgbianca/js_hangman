import express from 'express';
import { wordModel as word } from '../Models/models.js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

export const router = express.Router();

const allPortugueseWords = fs.readFileSync('./allPortugueseWords.json');
const validWords = JSON.parse(allPortugueseWords);

router.get('/single-player/:level', async (req, res, next) => {
  try {
    const databaseWords = await word.find({ level: req.params.level });
    const databaseWordsObjectsArray = [];
    for (let i = 0; i < databaseWords.length; i++) {
      const currentWordObject = databaseWords[i];
      databaseWordsObjectsArray.push(currentWordObject);
    }
    const randomNumber = Math.floor(
      Math.random() * databaseWordsObjectsArray.length
    );
    const currentGameWordObject = databaseWordsObjectsArray[randomNumber];
    res.send({
      id: currentGameWordObject._id,
      word: currentGameWordObject.word,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/play-with-a-friend', async (req, res, next) => {
  try {
    const sentWord = req.body.word.toLowerCase();
    const regex = /^.*@|#|\$|%|&|\*|_|!|<|>|\?|{|}|\[|\]|:|\+|\^|~|`|;|'|"|,|\.|=.*$/;
    const numbersRE = /^.*\d.*$/;
    if (!sentWord || sentWord.length < 3) {
      res
        .status(500)
        .send(
          'Erro: Você precisa digitar uma palavra válida, com pelo menos 3 letras.'
        );
    } else if (
      sentWord.includes(' ') ||
      sentWord.match(numbersRE) ||
      sentWord.match(regex)
    ) {
      res
        .status(500)
        .send(
          'Erro: Sua palavra NÃO deve conter espaços em branco ou números.'
        );
    } else if (!validWords[sentWord]) {
      res
        .status(500)
        .send('Por favor, insira uma palavra válida da língua portuguesa.');
    } else {
      const newWord = await new word({
        word: sentWord,
      }).save();
      res.send(newWord._id);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/play-with-a-friend/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const currentGameWord = await word.findById(id);
    res.send(currentGameWord.word);
  } catch (err) {
    next(err);
  }
});

router.post('/play-with-a-friend/score/:id', async (req, res, next) => {
  try {
    const score = req.body.score;
    const id = req.params.id;
    if (typeof score !== 'number') {
      throw new Error(
        'Atenção: a pontuação enviada precisa obrigatoriamente ser um número!'
      );
    } else {
      const updatedGame = await word.findByIdAndUpdate(
        id,
        {
          $set: { score: score },
        },
        { new: true }
      );
      res.send(JSON.stringify(updatedGame.score));
    }
  } catch (err) {
    next(err);
  }
});

router.get('/play-with-a-friend/score/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const gameInfo = await word.findById(id);
    if (gameInfo.score || gameInfo.score === 0) {
      res.send(JSON.stringify(gameInfo.score));
    } else {
      res.send(
        'Oops! Parece que seu oponente ainda não terminou o jogo! Aguarde um pouco mais e, depois, clique em "ATUALIZAR".'
      );
    }
  } catch (err) {
    next(err);
  }
});

router.use((err, _req, res, _next) => {
  res.status(err.status || 502).send(`Ocorreu um erro: ${err.message}`);
});
