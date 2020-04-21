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
