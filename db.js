class DB {
  static add(item){
    return new Promise(async (resolve, reject) => {
      const db = await DB.open();
      const trans = DB.#getTransaction(db);
      const todos = DB.#getObjectStore(trans);
      const query = todos.add(item);
      query.onsuccess = (event) => resolve(event.target.result);
    })
  }
  
  static remove(id){
    return new Promise(async (resolve, reject) => {
      const db = await DB.open();
      const trans = DB.#getTransaction(db);
      const todos = DB.#getObjectStore(trans);
      const query = await todos.delete(id);
      query.onsuccess = (event) => resolve(event.target.result);  
    })
  }
  
  static list(){
    return new Promise(async (resolve, reject) => {
      const db = await DB.open();
      const trans = DB.#getTransaction(db);
      const todos = DB.#getObjectStore(trans);
      const query = await todos.getAll();
      query.onsuccess = (event) => resolve(event.target.result);
    });
  }
  
  static update(item){
    return new Promise(async (resolve, reject) => {
      const db = await DB.open();
      const trans = DB.#getTransaction(db);
      const todos = DB.#getObjectStore(trans);
      const query = await todos.put(item);
      query.onsuccess = (event) => resolve(item);
    })
  }

  static clear(){
    return new Promise(async (resolve, reject) => {
      const db = await DB.open();
      const trans = DB.#getTransaction(db);
      const todos = DB.#getObjectStore(trans);
      const query = todos.clear();
      query.onsuccess = (event) => resolve(event.target.result);
    })
  }
  
  static #dbName = 'todos';
  static #table = 'todos';
  static #version = 2;
  
  static open(){
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB.#dbName, DB.#version);
      req.onupgradeneeded = DB.#setupDB;
      req.onerror = reject;
      req.onsuccess = () => resolve(req.result);
    })
  }
  
  static #getTransaction(db){
    return db.transaction(DB.#table, 'readwrite')
  }
  
  static #getObjectStore(t){
    return t.objectStore(DB.#table);
  }

  static #setupDB(event){
    const db = event.target.result;
    const objectStore = db.createObjectStore(DB.#dbName, {keyPath: 'id'});
    objectStore.createIndex('item', 'item', {unique: false});
    objectStore.createIndex('done', 'done', {unique: false});
    objectStore.createIndex('when', 'when', {unique: false});
  };
}