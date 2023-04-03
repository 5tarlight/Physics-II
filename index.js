let canvas;
let ctx;

const BLACK = "rgb(0, 0, 0)";
const RED = "rgb(200, 0, 0)";
const GREEN = "rgb(0, 200, 0)";
const BLUE = "rgb(0, 0, 200)";

const draw = (x, y, w, h = w, color = BLACK) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
};

const clear = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

class Item {
  id;
  x;
  y;
  w;
  h;
  color;

  constructor(id, x, y, w, h = w, color = BLACK) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
  }

  show() {
    draw(this.x, this.y, this.w, this.h, this.color);
  }
}

const R = {
  objs: [],

  add(obj) {
    this.objs.push(obj);
  },
  remove(id) {
    const index = this.objs.findIndex((o) => o.id === id);
    this.objs = [...this.objs.slice(0, index), ...this.objs.slice(index + 1)];
  },
  size() {
    return this.objs.length;
  },

  render() {
    this.objs.forEach((o) => o.show());
  },
};

const loop = () => {
  clear();
  R.render();

  requestAnimationFrame(loop);
};

const setup = () => {
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");

  R.add(new Item(0, 50, 600, 100));

  console.log("Loading complete!");
  requestAnimationFrame(loop);
};

window.onload = setup;
