const generateComment = () => ({
  comment: `Booooooooooring`,
  author: `Tim Macoveev`,
  date: `2019/12/31 23:59`,
  emotion: [`smile`, `sleeping`, `puke`, `angry`],
});

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilm);
};

export {ggenerateComments};
