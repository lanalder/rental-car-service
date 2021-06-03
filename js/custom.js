(function () {

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.beginPath();

let init = {
  get w() { return window.innerWidth },
  get h() { return window.innerHeight },
  scale() {
    document.body.style.width = `${this.w}px`;
    document.body.style.height = `${this.h}px`;
    canvas.style.width = `${this.w}px`;
    canvas.style.height = `${this.h}px`;
  }
}

let road = {
  // everything a responsive ratio since maths is marginally (marginally!) more interesting than css
  get h() { return Math.ceil(canvas.height/3) },
  get y() { return Math.ceil(canvas.height-this.h*1.3) },
  // for lines
  get linY() { return this.y+(Math.ceil(this.y/5)) },
  get linW() { return Math.ceil(init.w/10) },
  get linX() { return },

  draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, this.y, init.w, this.h);
    for (let i = 0; i < Math.ceil(init.w/5); i++) {
      ctx.fillStyle = 'white';
      ctx.fillRect(i, this.linY, this.linW, Math.ceil(this.linW/36));
    }
  }
}

init.scale();
road.draw();

window.onresize = resize;

function resize() {
  init.scale();
  road.draw();
}

}());
