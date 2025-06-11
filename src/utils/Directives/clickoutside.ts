const thatMap: Record<number, any> = {};
let thatIndex = 0;

function add(item: any) {
  if (Object.keys(thatMap).length === 0) {
    addEventListener('mouseup', onmouseup, true);
  }
  thatMap[thatIndex] = item;
  return thatIndex++;
}

function remove(id: any) {
  delete thatMap[id];
  if (Object.keys(thatMap).length === 0) {
    removeEventListener('mouseup', onmouseup, true);
  }
}

function onmouseup(e: any) {
  for (const key in thatMap) {
    const item = thatMap[key];
    let is = false;
    if (item.el.contains(e.target)) is = true;
    if (item.arg) {
      const list = typeof item.arg === 'string' ? document.querySelectorAll('.' + item.arg) : [item.arg];
      for (let i = 0; i < list.length; i++) {
        if (list[i].contains(e.target)) {
          is = true;
          break;
        }
      }
    }
    if (!is && item.fn) item.fn();
  }
}

export default {
  created: function (el: any, binding: any) {
    el.clickoutsideIndex = add({ el, fn: binding.value, arg: binding.arg });
  },
  beforeUnmount: function (el: any) {
    remove(el.clickoutsideIndex);
  },
};
