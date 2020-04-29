import {FilterType} from "../const.js";

export const getFilmsByType = (films, type) => {
  return films.filter((film) => film[type]);
};

export const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return films;
    case FilterType.WATCHLIST:
      return getFilmsByType(films, FilterType.WATCHLIST.toLowerCase());
    case FilterType.HISTORY:
      return getFilmsByType(films, FilterType.HISTORY.toLowerCase());
    case FilterType.FAVORITES:
      return getFilmsByType(films, FilterType.FAVORITES.toLowerCase());
  }

  return films;
};
