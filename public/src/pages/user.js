import { VirtuallList } from './../components/VirtualList.js'
import { fetchUsers } from './../service/api.js'

const viewportItemCount = 5;
const viewportHeight = window.innerHeight;
const itemHeight = Math.max(Math.floor(viewportHeight / viewportItemCount), 84);
const itemClass = 'row-wrap';
const listLoadClass = 'list-load';

class UsersView {
  constructor() {
    this.userList = null;
    this.isFetching = false;
    this.lastPage = 0;
    this.loadSize = viewportItemCount * 3;
  }

  showList() {
    this._showListLoading();
    fetchUsers(this.lastPage + 1, this.loadSize).then((res) => {
      const items = res.result ? res.result : [];
      this.lastPage += 1;

      this.userList = new VirtuallList({
        viewportHeight,
        itemHeight,
        items,
        itemClass,
        itemRenderCb: this._itemRenderCb.bind(this),
        loadMoreCb: this._loadMoreCb.bind(this)
      });
      this._hideListLoading();
      document.getElementById('app').appendChild(this.userList.container);
    }).catch((err) => {
      console.error(`fetch err: ${err}`);
      this._hideListLoading();
    });
  }

  _loadMoreCb() {
      if (this.isFetching) {
        return;
      }

      this.userList.showMoreLoading();
      this.isFetching = true;

      fetchUsers(this.lastPage + 1, this.loadSize).then((res) => {
        const items = res.result ? res.result : [];

        this.lastPage += 1;
        this.userList.pushItems(items);
        this.userList.hideMoreLoading();
        this.isFetching = false;
      }).catch((err) => {
        this.userList.hideMoreLoading();
        this.isFetching = false;
        console.error(`fetch err: ${err}`);
      });
  }

  _itemRenderCb(item) {
    const el = document.createElement('div');
    const idEl = document.createElement('p');
    const keyEl = document.createElement('p');
    const uuidEl = document.createElement('p');
    const dateEl = document.createElement('p');

    idEl.innerHTML = `id: ${item.id}`;
    idEl.classList.add(`${itemClass}__id`);

    keyEl.innerHTML = `key: ${item.key}`;
    keyEl.classList.add(`${itemClass}__key`);

    uuidEl.innerHTML = `uuid: ${item.uuid}`;
    uuidEl.classList.add(`${itemClass}__uuid`);

    dateEl.innerHTML = `created: ${this._getDateString(item.created)}`;
    dateEl.classList.add(`${itemClass}__date`);

    el.appendChild(idEl);
    el.appendChild(keyEl);
    el.appendChild(uuidEl);
    el.appendChild(dateEl);

    return el;
  }

  _getDateString(timestamp) {
    const date = new Date(timestamp);
    const fillDigit = (time) => time < 10 ? '0' + time : time;
    let day = date.getDate();
    let month = date.getMonth()+1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();

    return `${year}.${fillDigit(month)}.${fillDigit(day)} ${fillDigit(hour)}:${fillDigit(min)}:${fillDigit(sec)}`;
  }

  _showListLoading() {
    const el = document.createElement('div');

    el.classList.add(listLoadClass);
    document.getElementById('app').appendChild(el);
  }

  _hideListLoading() {
    const el = document.querySelector(`.${listLoadClass}`);

    if (el) {
      el.remove();
    }
  }
}

const usersView = new UsersView();
usersView.showList();
