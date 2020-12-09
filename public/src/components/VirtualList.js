const containerClass = 'vlist-cont';
const fullSizeDummyClass = `${containerClass}__fulldummy`;
const moreLoadImgClass = `${containerClass}__mloading`;

export class VirtuallList {
  constructor({viewportWidth, viewportHeight, itemHeight, items, itemClass, itemRenderCb, loadMoreCb}) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.itemHeight = itemHeight;
    this.items = items ? items : [];
    this.itemClass = itemClass;

    this.itemRenderCb = itemRenderCb;
    this.loadMoreCb = loadMoreCb;

    this.screenItemsLen = Math.ceil(this.viewportHeight / this.itemHeight);
    this.cachedItemsLen = this.screenItemsLen * 3; // Cache 3 times the number of screenItemsLen
    this.lastRenderedScrTop = 0;
    this.scrollEndTop = this.items.length > 0 ? this.itemHeight * this.items.length - this.viewportHeight : 0;

    this.container = null;
    this.loadImg = null;
    this.fullSizeDummy = null;
    this.scrollHandler = null;

    this._initList();
  }

  destroy() {
    this.container.removeEventListener('scroll', this.scrollHandler);
    this.container.remove();
  }

  pushItems(items) {
    const first = parseInt(this.lastRenderedScrTop / this.itemHeight) - this.screenItemsLen;

    this.items = this.items.concat(items);
    this.scrollEndTop = this.items.length > 0 ? this.itemHeight * this.items.length - this.viewportHeight : 0;
    this._updateFullSizeDummy(this.itemHeight * this.items.length);
    this._renderItems(first < 0 ? 0 : first);
  }

  showMoreLoading() {
    if (!this.loadImg) {
      return;
    }
    this.loadImg.style.top = (this.items.length * this.itemHeight - this.itemHeight) + 'px';
    this.loadImg.style.display = 'block';
  }

  hideMoreLoading() {
    if (!this.loadImg) {
      return;
    }
    this.loadImg.style.display = 'none';
  }

  _initList() {
    this.fullSizeDummy = this._createFullSizeDummy(this.itemHeight * this.items.length);
    this.loadImg = this._createMoreLoading();
    this.container = this._createContainer(this.viewportWidth, this.viewportHeight);
    this.container.appendChild(this.fullSizeDummy);
    this.container.appendChild(this.loadImg);

    this._renderItems(0);

    this.scrollHandler = this._onScroll.bind(this);
    this.container.addEventListener('scroll', this.scrollHandler);
  }

  _onScroll(e) {
    const scrollTop = e.target.scrollTop;

    if (this.loadMoreCb && scrollTop >= this.scrollEndTop) {
      this.loadMoreCb();
    }

    if (!this.lastRenderedScrTop || Math.abs(scrollTop - this.lastRenderedScrTop) > (this.screenItemsLen * this.itemHeight)) {
      const firstIdx = Math.floor(scrollTop / this.itemHeight) - this.screenItemsLen;
      this._renderItems(firstIdx < 0 ? 0 : firstIdx);
      this.lastRenderedScrTop = scrollTop;
    }

    e.preventDefault();
  }

  _renderItems(firstIdx) {
    const fragment = document.createDocumentFragment();
    const renderedItems = this.container.querySelectorAll(`.${this.itemClass}`);
    const rItemsLen = renderedItems.length;
    let i, j, lastIdx = firstIdx + this.cachedItemsLen;

    if (lastIdx > this.items.length) {
      lastIdx = this.items.length;
    }

    for (i = firstIdx; i < lastIdx; i+=1) {
      fragment.appendChild(this._createItem(i));
    }

    for (j = 0; j < rItemsLen; j+=1) {
      if (renderedItems[j]) {
        this.container.removeChild(renderedItems[j]);
      }
    }
    this.container.appendChild(fragment);
  }

  _createItem(i) {
    const item = this.itemRenderCb(this.items[i]);

    item.classList.add(this.itemClass);
    item.style.position = 'absolute';
    item.style.height = this.itemHeight + 'px';
    item.style.top = (i * this.itemHeight) + 'px';

    return item;
  }

  _createContainer(w, h) {
    const el = document.createElement('div');

    el.classList.add(containerClass);
    el.style.width = w ? `${w}px` : '100%';
    el.style.height = h ? `${h}px` : '100%';

    return el;
  }

  _createFullSizeDummy(h) {
    const el = document.createElement('div');

    el.classList.add(fullSizeDummyClass);
    el.style.height = `${h}px`;

    return el;
  }

  _createMoreLoading() {
    const el = document.createElement('img');

    el.classList.add(moreLoadImgClass);
    el.style.left = `calc(50% - ${this.itemHeight / 2}px)`;
    el.style.width = `${this.itemHeight}px`;
    el.src = '/img/progress_rolling_blue.svg';

    return el;
  }

  _updateFullSizeDummy(h) {
    if (!this.fullSizeDummy) {
      return;
    }
    this.fullSizeDummy.style.height = `${h}px`;
  }
}
