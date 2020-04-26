import moment from "moment";

export const getReleaseDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const getHumanizeDate = (date) => {
  return moment(date).fromNow();
};

export const getFilmDuration = (timeInMins) => {
  const time = moment.utc().startOf(`day`).add({minutes: timeInMins});
  const hours = time.hour() ? `${time.hour()}h ` : ``;
  return `${hours}${time.minutes()}m`;
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
