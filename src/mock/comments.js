import {
  getRandomArrayItem,
  getRandomIntegerNumber,
  getRandomDate
} from "../utils/common.js";

const REACTIONS = [
  `unbelievably`,
  `incredibly`,
  `improbably`,
  `amazingly`,
  `terribly`,
  `awfully`,
  `horribly`,
  `dreadfully`
];

const AUTHORS = [
  `Tony Stark`,
  `Steve Rogers`,
  `Bruce Banner`,
  `Thor`,
  `Natasha Romanoff`,
  `Clint Barton`,
  `Loki`,
  `Agent Phil Coulson`,
  `Agent Maria Hill`,
];

const EMOTIONS = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`
];

const MIN_COMMENTS_AMOUNT = 0;
const MAX_COMMENTS_AMOUNT = 5;

const generateComment = () => {
  return ({
    comment: getRandomArrayItem(REACTIONS),
    author: getRandomArrayItem(AUTHORS),
    date: getRandomDate(getRandomIntegerNumber(2018, 2020), getRandomIntegerNumber(1, 12), getRandomIntegerNumber(1, 30)),
    emotion: getRandomArrayItem(EMOTIONS)
  });
};

const generateFilmComments = (amount) => {
  let comments = [];
  for (let i = 0; i < amount; i++) {
    comments.push(generateComment());
  }
  return comments;
};

const generateComments = (count) => {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(generateFilmComments(getRandomIntegerNumber(MIN_COMMENTS_AMOUNT, MAX_COMMENTS_AMOUNT)));
  }
  return arr;
};

export {generateComments};
