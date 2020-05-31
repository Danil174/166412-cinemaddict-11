import AbstractSmartComponent from "./abstract-smart-component.js";
import {getRang, getRandomArrayItem} from "../utils/common.js";

import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 50;

const sortTypeMap = new Map()
  .set(`statistic-all-time`, 0)
  .set(`statistic-today`, 1)
  .set(`statistic-week`, 7)
  .set(`statistic-month`, 31)
  .set(`statistic-year`, 365);

class WatchedFilms {
  constructor() {
    this._films = [];
  }

  setFilms(films) {
    this._films = films;
  }

  getFilms() {
    return this._films;
  }

  getFilmsDuration() {
    const hours = this._getFilmsDurationMins() ? Math.floor(this._getFilmsDurationMins() / 60) : 0;
    const minutes = this._getFilmsDurationMins() ? this._getFilmsDurationMins() % 60 : 0;

    return {
      hours,
      minutes,
    };
  }

  _getFilmsDurationMins() {
    return this._films.length ? this._films.slice().map((film) => film.duration).reduce((a, b) => a + b) : 0;
  }

  getSortetGenresCollection() {
    const uniqueGenres = [];
    this._countWatchedGenres().forEach((value, key) => {
      uniqueGenres.push({key, value});
    });

    return uniqueGenres.sort((a, b) => b.value - a.value);
  }

  _getWatchedGenres() {
    return this.getFilms().length ? this.getFilms().slice().map((film) => film.genres).reduce((a, b) => [...a, ...b]) : ``;
  }

  _countWatchedGenres() {
    const watchedGenres = this._getWatchedGenres();
    const hash = new Map();

    for (let i = 0; i < watchedGenres.length; i++) {
      if (hash.has(watchedGenres[i])) {
        hash.set(watchedGenres[i], hash.get(watchedGenres[i]) + 1);
      } else {
        hash.set(watchedGenres[i], 1);
      }
    }
    return hash;
  }

  getTopGenre() {
    let topGenres;
    let topValue = 0;

    this._countWatchedGenres().forEach((value, key) => {
      if (value > topValue) {
        topValue = value;
        topGenres = [key];
      } else if (value === topValue) {
        topGenres.push(key);
      }
    });

    return topGenres ? getRandomArrayItem(topGenres) : ``;
  }
}

const renderChart = (watchedFilms, element) => {
  const labels = watchedFilms.getSortetGenresCollection().map((it) => it.key);
  const data = watchedFilms.getSortetGenresCollection().map((it) => it.value);

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

const createStatisticTemplate = (watchedFilms, userRang) => {
  const filmsAmount = watchedFilms.getFilms().length;
  const {hours, minutes} = watchedFilms.getFilmsDuration();
  const topGenre = watchedFilms.getTopGenre();

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
          <p class="statistic__item-text">${filmsAmount} <span class="statistic__item-description">movies</span></p>
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

export default class Statistic extends AbstractSmartComponent {
  constructor(filmsModel) {
    super();

    this._watchedFilms = new WatchedFilms();
    this._filmsModel = filmsModel;
    this._userRang = getRang(this._filmsModel.getWatchedFilms().length);
    this._chart = null;

    this._watchedFilms.setFilms(this._filmsModel.getWatchedFilms());
    this._renderChart();
  }

  getTemplate() {
    return createStatisticTemplate(this._watchedFilms, this._userRang);
  }

  show() {
    super.show();

    this._watchedFilms.setFilms(this._filmsModel.getWatchedFilms());
    this.rerender();
  }

  recoveryListeners() {
    this._setStatisticFiltersClickHandler();
  }

  rerender() {
    super.rerender();
    this._renderChart();
  }

  _setStatisticFiltersClickHandler() {
    this.getElement().querySelector(`.statistic__filters`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        if (evt.target.tagName !== `LABEL`) {
          return;
        }
        this._setFilms(this._filmsByDay(sortTypeMap.get(evt.target.htmlFor)));
        this.rerender();
        this._setActiveRadio(evt.target.htmlFor);
      });
  }

  _setActiveRadio(selector) {
    this.getElement().querySelector(`#${selector}`).checked = true;
  }

  _filmsByDay(date) {
    const dateFrom = (() => {
      if (!date) {
        return new Date(0);
      }
      const d = new Date(Date.now());
      d.setDate(d.getDate() - Number(date));
      return d;
    })();
    return this._filmsModel.getWatchedFilms().slice().filter((it) => {
      return it.watchingDate >= dateFrom;
    });
  }

  _setFilms(films) {
    this._watchedFilms.setFilms(films);
  }

  _renderChart() {
    const element = this.getElement();

    const statisticCtx = element.querySelector(`.statistic__chart`);
    statisticCtx.height = BAR_HEIGHT * this._watchedFilms.getSortetGenresCollection().length;

    this._resetChart();
    this._chart = renderChart(this._watchedFilms, statisticCtx);
  }

  _resetChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }
}

