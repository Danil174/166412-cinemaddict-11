const getIDs = (comments) => {
  if (typeof comments[0] === `string`) {
    return comments;
  }
  return comments.map((comment) => {
    return comment.id;
  });
};

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

  toRAW() {
    return {
      "id": this.id,
      "comments": getIDs(this.comments),
      "film_info": {
        "title": this.name,
        "alternative_title": this.originalName,
        "total_rating": this.rating,
        "poster": this.img,
        "age_rating": this.allowedAge,
        "director": this.director,
        "writers": this.writers,
        "actors": this.actors,
        "release": {
          "date": this.releaseDate.toISOString(),
          "release_country": this.country
        },
        "runtime": this.duration,
        "genre": this.genres,
        "description": this.description
      },
      "user_details": {
        "watchlist": this.inWatchlist,
        "already_watched": this.watched,
        "watching_date": this.watchingDate.toISOString(),
        "favorite": this.favorite
      }
    };
  }

  static parseFilm(data) {
    return new Film(data);
  }

  static parseFilms(data) {
    return data.map(Film.parseFilm);
  }

  static clone(data) {
    return new Film(data.toRAW());
  }
}
