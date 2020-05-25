import AbstractSmartComponent from "./abstract-smart-component.js";
import {getRang, getWatchedFilms, getFullDuration, getRandomArrayItem} from "../utils/common.js";

import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';


const getWatchTime = (films) => {
  return films.length ? films.slice().map((film) => film.duration).reduce((a, b) => a + b) : 0;
};

const getWathcingGenres = (films) => {
  return films.length ? films.slice().map((film) => film.genres).reduce((a, b) => [...a, ...b]) : ``;
};

const countWathcingGenres = (arr) => {
  const hash = new Map();
  for (let i = 0; i < arr.length; i++) {
    if (hash.has(arr[i])) {
      hash.set(arr[i], hash.get(arr[i]) + 1);
    } else {
      hash.set(arr[i], 1);
    }
  }
  return hash;
};

const createDictionary = (map) => {
  const uniqueGenres = [];
  map.forEach((value, key) => {
    uniqueGenres.push([key, value]);
  });

  return uniqueGenres;
};

const getTopGenre = (map) => {
  let topGenres;
  let topValue = 0;
  map.forEach((value, key) => {
    if (value > topValue) {
      topValue = value;
      topGenres = [key];
    } else if (value === topValue) {
      topGenres.push(key);
    }
  });
  return topGenres ? getRandomArrayItem(topGenres) : 0;
};

const renderChart = (films, element) => {
  const wathcingGenres = getWathcingGenres(films);
  const genres = countWathcingGenres(wathcingGenres);
  const genresDictionary = createDictionary(genres).sort((a, b) => b[1] - a[1]);
  const labels = genresDictionary.map((it) => it[0]);
  const data = genresDictionary.map((it) => it[1]);

  return new Chart(element, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`,
        barThickness: 24
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticTemplate = (films) => {
  const userRang = getRang(films.length); //
  const watchedMinutes = getWatchTime(films);
  const {hours, minutes} = getFullDuration(watchedMinutes); //

  const wathcingGenres = getWathcingGenres(films);
  const genres = countWathcingGenres(wathcingGenres);
  const topGenre = getTopGenre(genres); //

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${userRang}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${films.length} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class PopUp extends AbstractSmartComponent {
  constructor(filmsModel) {
    super();

    this._filmsModel = filmsModel;
    this._films = getWatchedFilms(this._filmsModel.getFilmsAll());
    this._chart = null;

    this._renderChart();
  }

  getTemplate() {
    return createStatisticTemplate(this._films);
  }

  show() {
    super.show();

    this._films = getWatchedFilms(this._filmsModel.getFilmsAll());
    this.rerender(this._films);
  }

  recoveryListeners() {}

  rerender(films) {
    this._films = films;

    super.rerender();

    this._renderChart();
  }

  _renderChart() {
    const element = this.getElement();

    const BAR_HEIGHT = 50;
    const statisticCtx = element.querySelector(`.statistic__chart`);

    statisticCtx.height = BAR_HEIGHT * getWathcingGenres(getWatchedFilms(this._films)).length;

    this._resetChart();
    this._chart = renderChart(getWatchedFilms(this._films), statisticCtx);
  }

  _resetChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }
}

