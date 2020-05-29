export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getItems(key) {
    try {
      return JSON.parse(this._storage.getItem(key)) || {};
    } catch (err) {
      return {};
    }
  }

  // setItems(items) {
  //   this._storage.setItem(
  //       this._storeKey,
  //       JSON.stringify(items)
  //   );
  // }

  setItems(items, key) {
    this._storage.setItem(
        key,
        JSON.stringify(items)
    );
  }

  setItem(key, value) {
    const store = this.getItems(key);

    this._storage.setItem(
        key,
        JSON.stringify(
            Object.assign({}, store, {
              [value.id]: value
            })
        )
    );
  }
}
