export default class Film {
  constructor(data) {
    this.actors = data[`film_info`][`actors`];
    this.allowedAge = data[`film_info`][`age_rating`];
    this.comments = data[`comments`];
    this.country = data[`film_info`][`release`][`release_country`];
    this.description = data[`film_info`][`description`];
    this.director = data[`film_info`][`director`];
    this.duration = data[`film_info`][`runtime`];
    this.favorite = data[`user_details`][`favorite`];
    this.genres = data[`film_info`][`genre`];
    this.id = data[`id`];
    this.img = data[`film_info`][`poster`];
    this.inWatchlist = data[`user_details`][`watchlist`];
    this.name = data[`film_info`][`title`];
    this.originalName = data[`film_info`][`alternative_title`];
    this.rating = data[`film_info`][`total_rating`];
    this.releaseDate = new Date(data[`film_info`][`release`][`date`]);
    this.watched = data[`user_details`][`already_watched`];
    this.watchingDate = new Date(data[`user_details`][`watching_date`]);
    this.writers = data[`film_info`][`writers`];
  }

  static parseFilm(data) {
    return new Film(data);
  }

  static parseFilms(data) {
    return data.map(Film.parseFilm);
  }
}
