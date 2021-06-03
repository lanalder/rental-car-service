(function () {

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let init = {
  get w() { return window.innerWidth },
  get h() { return window.innerHeight },
  setScl() {
    document.body.style.width = `${this.w}px`;
    document.body.style.height = `${this.h}px`;
    canvas.width = this.w;
    canvas.height = this.h;
  }
}

ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
// cubic-bezier(.17,.67,.83,.67)

let road = {
  h: init.h/6,
  get y() { return init.h-this.h*1.5 },

  // for lines... new fav pattern ig isget (n 3s today) nice 2 kno what ur up to tho instead of giganturan expressions (statements??) n mostly here bc objs suck at self-awareness (no self-ref this)
  get linY() { return this.y+(this.h/3) },
  get linH() { return this.h/9 },
  linW: init.w/9,

  draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, this.y, init.w, this.h);

    let gap = this.linW/1.5;
    // ctx.beginPath();

    // for (let i = 0; i < 12; i++) {


      // ctx.moveTo(gap*i+10, this.linY);
      // ctx.lineTo((gap*i-10)+this.linW, this.linY);
      // ctx.lineTo(gap*i+this.linW, this.linY+this.linH);
      // ctx.lineTo(gap*i, this.linY+this.linH);
      // ctx.closePath();
      // ctx.fillStyle = 'white';
      // ctx.fillRect(gap*i, this.linY, this.linW, this.linH);
      // gap = this.linW+(this.linW/1.5);
    // }
  }
}

init.setScl();
road.draw();

window.onresize = resize;

function resize() {
  init.setScl();
  road.draw();
}


ctx.strokeStyle = 'red';
ctx.beginPath();
ctx.moveTo(10, 10);
ctx.lineTo(190, 10);
ctx.lineTo(200, 110);
ctx.lineTo(0, 110);
ctx.closePath();

}());
