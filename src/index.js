import Storage from 'store';

let checkExpireViaTime = function (info = {}, key) {
  if (info.exp !== -1 && (new Date().getTime() - info.time > info.exp)) {
    Storage.remove(key);
    return null;
  }
  return info;

};

let checkExpireViaRead = function (info = {}, key) {
  // 读取次数策略
  if (info.read !== -1) {
    info.readed = info.readed || 0;
    info.readed = info.readed + 1;
    if (info.readed === info.read) {
      Storage.remove(key);
    } else {
      Storage.set(key, info);
    }

    return info;

  }
  return info;

};

export let store = Storage;
export let cache = {

  remove: function (key) {
    Storage.remove(key);
  },
  set: function (key, val, {time = -1, read = -1}) {
    let expTime = time === -1 ? -1 : time * 1000;

    Storage.set(key, {
      val: val,
      exp: expTime,
      time: new Date().getTime(),
      read: read
    });

    if (expTime > 0) {
      let curStore = Storage.get('EXPIRE_STORE') || [];

      curStore.push(key);
      Storage.set('EXPIRE_STORE', curStore);
    }
  },
  clearForce() {
    let curStore = Storage.get('EXPIRE_STORE') || [];

    for (let i = 0; i < curStore.length; i++) {
      let key = curStore[i];

      Storage.remove(key);
    }
    Storage.remove('EXPIRE_STORE');
  },
  clear() {
    let curStore = Storage.get('EXPIRE_STORE') || [];

    for (let i = 0; i < curStore.length; i++) {
      let key = curStore[i];
      let info = Storage.get(key);

      checkExpireViaTime(info, key);
    }
  },
  get: function (key) {
    var info = Storage.get(key);

    if (!info) {
      return null;
    }

    // 时间策略
    if (!checkExpireViaTime(info, key)) {
      return null;
    }

    // 读取次数策略
    let data = checkExpireViaRead(info, key);

    if (data) {
      return data.val;
    }
    return null;

  }
};
