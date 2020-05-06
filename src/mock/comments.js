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

const generateComment = (commentId) => {
  return ({
    id: commentId,
    author: getRandomArrayItem(AUTHORS),
    comment: getRandomArrayItem(REACTIONS),
    date: getRandomDate(getRandomIntegerNumber(2018, 2020), getRandomIntegerNumber(1, 12), getRandomIntegerNumber(1, 30)),
    emotion: getRandomArrayItem(EMOTIONS),
  });
};

export const generateAllComments = (films) => {
  const comments = [];

  films.forEach((it) => it.comments.forEach(
      (commentId) => comments.push(generateComment(commentId))
  ));

  return comments;
};
