export default class CommentsModel {
  constructor() {
    this._allComments = [];
  }

  getCommentsAll() {
    return this._allComments;
  }

  setComments(comments) {
    this._allComments = Array.from(comments);
  }

  getFilmComments(id) {
    const index = this._allComments.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    return this._allComments[index].comments;
  }

  addComment(id, comment) {
    const index = this._allComments.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._allComments[index].comments.concat(comment);

    return true;
  }

  removeComment(id, commentIndex) {
    const index = this._allComments.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._allComments[index].comments.splice(commentIndex, 1);

    return true;
  }
}
