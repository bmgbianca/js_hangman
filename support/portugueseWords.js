import lineReader from 'line-reader';
import fs from 'fs';
import readline from 'readline';

const allWords = [];

const readInterface = readline.createInterface({
  input: fs.createReadStream('./portugueseWords.txt'),
  console: false,
});

readInterface.on('line', function (line) {
  allWords.push(line);
});

readInterface.on('close', function () {
  const allPortugueseWords = {};
  for (let i = 0; i < allWords.length; i++) {
    const word = allWords[i];
    allPortugueseWords[word] = true;
  }
  fs.writeFile(
    './allPortugueseWords.json',
    JSON.stringify(allPortugueseWords),
    (err) => {
      if (err) {
        throw err;
      } else {
        console.log('File has been successfully saved!');
      }
    }
  );
});

/* lineReader.eachLine('./portugueseWords.txt', function (line, last) {
  allWords.push(line);
  if (last) {
    const validPortugueseWords = {
      allWords: allWords,
    };
    fs.writeFile(
      './validPortugueseWords.json',
      JSON.stringify(validPortugueseWords),
      (err) => {
        if (err) {
          throw err;
        }
        console.log('File has been successfully saved!');
      }
    );
  }
});
 */
