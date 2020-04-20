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

export const concatAndSortByCommentsCollections = (keyCollection, valuesCollection) => {
  const collection = new Map();

  for (let i = 0; i < keyCollection.length; i++) {
    collection.set(keyCollection[i], valuesCollection[i]);
  }
  return [...collection.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 2);
};

export const concatAndSortByRatingCollections = (keyCollection, valuesCollection) => {
  const collection = new Map();

  for (let i = 0; i < keyCollection.length; i++) {
    collection.set(keyCollection[i], valuesCollection[i]);
  }
  return [...collection.entries()].sort((a, b) => b[0].rating - a[0].rating).slice(0, 2);
};

export const getElementFromBinaryArr = (arr, index) => {
  const newArr = [];
  for (const el of arr) {
    newArr.push(el[index]);
  }
  return newArr;
};
