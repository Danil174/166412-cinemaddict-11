import moment from "moment";
import {UserRangs} from "../const.js";

export const getReleaseDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const getHumanizeDate = (date) => {
  return moment(date).fromNow();
};

export const getFilmDuration = (timeInMins) => {
  const time = moment.utc().startOf(`day`).add({minutes: timeInMins});
  return {
    hours: time.hour() ? `${time.hour()}h ` : ``,
    minutes: time.minutes() ? `${time.minutes()}m ` : ``,
  };
};

export const getFullDuration = (timeInMins) => {
  const hours = Math.floor(timeInMins / 60);
  const minutes = timeInMins % 60;
  return {
    hours,
    minutes,
  };
};

export const getRandomArrayItems = (array, maxItems = array.length, minItems = 1, joinSTR = `, `) => {
  const arr = array.slice();
  const itemsAmount = getRandomIntegerNumber(minItems, maxItems);
  let newArr = [];

  for (let i = 0; i < itemsAmount; i++) {
    newArr.push(arr.splice(getRandomIntegerNumber(0, arr.length - 1), 1));
  }

  return newArr.join(joinSTR);
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);

  return array[randomIndex];
};

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.round(Math.random() * (max - min));
};

export const getRandomBool = () => {
  return Math.random() > 0.5;
};

export const getRandomDate = (year, month, day) => {
  return (new Date(year, month, day));
};

export const getAmountByCurrentKey = (objects, key, value) => {
  return (objects.filter((obj) => obj[key] === value)).length;
};

export const getRandomFilmsByMaxPropertyValue = (films, amount, key) => {
  const newFilms = films.slice().filter((film) => film[key] !== 0);

  if (newFilms.length === 0) {
    return [];
  }

  if (newFilms.length === 1) {
    return newFilms;
  }

  newFilms.sort((a, b) => b[key] - a[key]);

  if (newFilms[0][key] === newFilms[1][key]) {
    const elementsWithMaxValues = newFilms.filter((film) => film[key] === newFilms[0][key]);
    return elementsWithMaxValues.sort(() => Math.random() - 0.5).slice(0, amount);
  } else if (newFilms[1][key] === newFilms[2][key]) {
    const firstElement = newFilms[0];
    const elementsWithMaxValues = newFilms.filter((film) => film[key] === newFilms[1][key]);
    elementsWithMaxValues.sort(() => Math.random() - 0.5);
    return [firstElement, ...elementsWithMaxValues.slice(0, 1)];
  }

  return newFilms.slice(0, amount);
};

export const getRandomFilmsByMaxPropertyLenght = (films, amount, key) => {

  const newFilms = films.slice().filter((film) => film[key].length !== 0);

  if (newFilms.length === 0) {
    return [];
  }

  if (newFilms.length === 1) {
    return newFilms;
  }

  newFilms.sort((a, b) => b[key].length - a[key].length);

  if (newFilms[0][key].length === newFilms[1][key].length) {
    const elementsWithMaxValues = newFilms.filter((film) => film[key].length === newFilms[0][key].length);
    return elementsWithMaxValues.sort(() => Math.random() - 0.5).slice(0, amount);
  } else if (newFilms[1][key].length === newFilms[2][key].length) {
    const firstElement = newFilms[0];
    const elementsWithMaxValues = newFilms.filter((film) => film[key].length === newFilms[1][key].length);
    elementsWithMaxValues.sort(() => Math.random() - 0.5);
    return [firstElement, ...elementsWithMaxValues.slice(0, 1)];
  }

  return newFilms.slice(0, amount);
};

export const getRang = (filmsAmount) => {
  if (filmsAmount === 0) {
    return ``;
  }

  const numericRang = Math.ceil(filmsAmount / 10);

  switch (numericRang) {
    case 1:
      return UserRangs.NOVICE;
    case 2:
      return UserRangs.FAN;
    default:
      return UserRangs.EXPERT;
  }
};
