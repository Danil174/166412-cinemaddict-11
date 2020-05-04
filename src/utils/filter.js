import {FilterType, FilterConvertType} from "../const.js";

export const getFilmsByType = (films, type) => {
  return films.filter((film) => film[type]);
};

export const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return films;
    case FilterType.WATCHLIST:
      return getFilmsByType(films, FilterConvertType.WATCHLIST);
    case FilterType.HISTORY:
      return getFilmsByType(films, FilterConvertType.HISTORY);
    case FilterType.FAVORITES:
      return getFilmsByType(films, FilterConvertType.FAVORITES);
  }

  return films;
};
