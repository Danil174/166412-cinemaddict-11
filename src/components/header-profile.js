import AbstractComponent from "./abstract-component.js";
import {getRang} from "../utils/common.js";

const createHeaderProfileTemplate = () => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating"></p>
      <img class="profile__avatar" src="./public/images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class HeaderProfile extends AbstractComponent {
  getTemplate() {
    return createHeaderProfileTemplate();
  }

  setUserRang(films) {
    const userRang = getRang(films.length);
    const rangContainer = this.getElement().querySelector(`.profile__rating`);

    rangContainer.textContent = userRang;
  }
}
