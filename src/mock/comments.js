import {
  getRandomArrayItem,
  getRandomIntegerNumber,
  getRandomDate
} from '../util.js';

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

const generateComment = () => ({
  comment: getRandomArrayItem(REACTIONS),
  author: getRandomArrayItem(AUTHORS),
  date: getRandomDate(getRandomIntegerNumber(2018, 2020), getRandomIntegerNumber(1, 12), getRandomIntegerNumber(1, 30)),
  emotion: getRandomArrayItem(EMOTIONS)
});

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};

export {generateComments};
