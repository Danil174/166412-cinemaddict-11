import AbstractComponent from "./abstract-component.js";

const createShowMoreBtnTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class ShowMoreBtn extends AbstractComponent {
  getTemplate() {
    return createShowMoreBtnTemplate();
  }
}
