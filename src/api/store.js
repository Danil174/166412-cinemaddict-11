export default class Store {
  constructor(prefix, storage) {
    this._storage = storage;
    this._storePrefix = prefix;
  }

  getItems(key) {
    try {
      return JSON.parse(this._storage.getItem(`${this._storePrefix}/${key}`)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items, key) {
    this._storage.setItem(
        `${this._storePrefix}/${key}`,
        JSON.stringify(items)
    );
  }

  setItem(key, value) {
    const store = this.getItems(key);

    this._storage.setItem(
        `${this._storePrefix}/${key}`,
        JSON.stringify(
            Object.assign({}, store, {
              [value.id]: value
            })
        )
    );
  }
}
