let canvas;
let ctx;
let pushBtn;
let start = false;

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

  // console.log(R.objs[0]);

  clear();
  R.render();
  requestAnimationFrame(loop);
};

const setup = () => {
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  pushBtn = document.querySelector("#push");

  pushBtn.addEventListener("click", addForce);

  R.add(new Item(0, 1, 50, 600, 100));

  console.dir(R.objs);
  console.log("Loading complete!");

  (() => {
    requestAnimationFrame(loop);
  })();
};

window.onload = setup;
