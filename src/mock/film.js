import {
  getRandomArrayItem,
  getRandomArrayItems,
  getRandomIntegerNumber,
  getRandomBool,
  getRandomDate
} from "../utils/common.js";

const FILMS = [
  `Made for Each Other`,
  `Popeye Meets Sinbad`,
  `Sagebrush Trail`,
  `Santa Claus Conquers the Martians`,
  `The Dance of Life`,
  `The Great Flamarion`,
  `The Man With the Golden Arm`
];

const POSTERS = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const DIRECTORS = [
  `J. J. Abrams`,
  `Alfred Hitchcock`,
  `Martin Scorsese`,
  `Woody Allen`,
  `M. Night Shyamalan`,
  `Stanley Kubrick`,
  `Quentin Tarantino`,
  `Sam Raimi`
];

const WRITERS = [
  `Dalton Trumbo`,
  `Alvah Cecil Bessie`,
  `Herbert Biberman`,
  `Lester Cole`,
  `Ring Lardner Jr.`,
  `John Howard Lawson`,
  `Albert Maltz`,
  `Samuel Ornitz`,
  `Adrian Scott`,
];

const ACTORS = [
  `Katharine Hepburn`,
  `Meryl Streep`,
  `Bette Davis`,
  `Ingrid Bergman`,
  `Vivien Leigh`,
  `Elizabeth Taylor`,
  `Audrey Hepburn`,
  `Barbara Stanwyck `,
  `Joan Crawford`,
];

const COUNTRIES = [
  `Afghanistan`,
  `Åland Islands`,
  `Albania`,
  `Algeria`,
  `American Samoa`,
  `AndorrA`,
  `Angola`,
  `Anguilla`,
  `Bolivia`,
  `Botswana`,
];

const GENRES = [
  `Horror`,
  `Comedy`,
  `Romance`,
  `Fantasy`,
  `Drama`,
  `Cartoon`
];

const AGES = [
  `21+`,
  `18+`,
  `14+`,
  `7+`,
  `4+`
];


const MIN_SENTENCES_AMOUNT = 1;
const MAX_SENTENCES_AMOUNT = 5;

const generateFilm = () => {
  const randomIndex = getRandomIntegerNumber(0, FILMS.length - 1);

  return {
    id: String(Date.now() + Math.random()),
    img: POSTERS[randomIndex],
    name: FILMS[randomIndex],
    originalName: FILMS[randomIndex].toUpperCase(),
    rating: getRandomIntegerNumber(0, 100) / 10,
    director: getRandomArrayItem(DIRECTORS),
    writers: getRandomArrayItems(WRITERS),
    actors: getRandomArrayItems(ACTORS),
    releaseDate: getRandomDate(getRandomIntegerNumber(1925, 1955), getRandomIntegerNumber(1, 12), getRandomIntegerNumber(1, 30)),
    duration: `${getRandomIntegerNumber(15, 180)}`,
    country: getRandomArrayItem(COUNTRIES),
    genres: getRandomArrayItems(GENRES, 3, 1, `, `).split(`, `),
    description: getRandomArrayItems(DESCRIPTIONS, MAX_SENTENCES_AMOUNT, MIN_SENTENCES_AMOUNT, ` `),
    allowedAge: getRandomArrayItem(AGES),
    inWatchlist: getRandomBool(),
    watched: getRandomBool(),
    favorite: getRandomBool(),
    comments: [],
  };
};

const generateFilms = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilm);
};

export {generateFilms};
