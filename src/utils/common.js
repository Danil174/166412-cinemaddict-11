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

export const sortObjectsByKeyMaxMin = (objects, key) => {
  const arr = objects.slice();
  return arr.sort((a, b) => b[key] - a[key]);
};

export const sortObjectsByValueLength = (objects, key) => {
  const arr = objects.slice();
  return arr.sort((a, b) => b[key].length - a[key].length);
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
