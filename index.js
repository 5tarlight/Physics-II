let canvas;
let ctx;
let pushBtn;
let start = false;
let predH, predW;
let curH, curW;
let offsetX, offsetY;
const g = 0.098;

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
  weight;
  color;

  constructor(id, weight, x, y, w, h = w, color = BLACK) {
    this.id = id;
    this.weight = weight;
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
  get(id) {
    return this.objs.filter((o) => o.id === id)[0];
  },
  move(id, x = 0, y = 0) {
    const item = R.get(id);

    if (!item) {
      return;
    }

    const index = this.objs.findIndex((o) => o.id === id);

    if (index === -1) return;

    this.objs[index] = new Item(
      item.id,
      item.weight,
      item.x + x,
      item.y + y,
      item.w,
      item.h,
      item.color
    );
  },

  render() {
    this.objs.forEach((o) => o.show());
  },
};

class Force {
  power;
  theta; // θ (rad)
  target;

  constructor(target, power, theta = 0) {
    this.power = power;
    this.target = target;
    this.theta = theta;
  }
}

const forces = [];

const addForce = () => {
  start = true;
  const f = new Force(0, 10, (-Math.PI * 1.5) / 4);
  forces.push(f);

  const fy = f.power * Math.sin(f.theta) - g;
  const fx = f.power * Math.cos(f.theta);
  const v = Math.sqrt(fy * fy + fx * fx);
  predH.innerText =
    (v * v * Math.sin(f.theta) * Math.sin(f.theta)) / 2 / g + " m";
  predW.innerText = (v * v * -Math.sin(2 * f.theta)) / g + " m";
};

let velX = 0;
let velY = 0;

const calcAccel = () => {
  while (forces.length > 0) {
    const f = forces.pop();
    const x = f.power * Math.cos(f.theta);
    const y = f.power * Math.sin(f.theta);
    console.log("move", f.target, "(", x, ",", y, ")");

    velX += x / R.get(f.target).weight;
    velY += y / R.get(f.target).weight;
  }
};

const loop = () => {
  if (start) forces.push(new Force(0, 0.098, Math.PI / 2));
  calcAccel();
  R.move(0, velX, velY);

  curW.innerText = `${R.get(0).x - offsetX} m`;
  curH.innerText = `${canvas.height - R.get(0).y - offsetY} m`;

  clear();
  R.render();
  requestAnimationFrame(loop);
};

const setup = () => {
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  pushBtn = document.querySelector("#push");

  pushBtn.addEventListener("click", addForce);

  predH = document.getElementById("pred-height");
  predW = document.getElementById("pred-width");
  curH = document.getElementById("cur-height");
  curW = document.getElementById("cur-width");

  R.add(new Item(0, 1, 50, 600, 100));

  offsetX = R.get(0).x;
  offsetY = canvas.height - R.get(0).y;

  console.dir(R.objs);
  console.log("Loading complete!");

  (() => {
    requestAnimationFrame(loop);
  })();
};

window.onload = setup;
