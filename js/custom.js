(function () {

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  var signBase;

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

  let road = {
    h: inProptn(1, 6),
    get y() { return init.h - this.h * 1.5 },
    // for lines... new fav pattern ig isget (n 3s today) nice 2 kno what ur up to tho instead of giganturan expressions (statements??) n mostly here bc objs suck at self-awareness (no self-ref this)
    get linY() { return this.y + (this.h / 3) },
    get linH() { return this.h / 9 },
    linW: inProptn(0, 9),
    draw() {
      // curbs 1st easiest 2 just have behind
      let shades = ['#9ca297', '#b1bab0'];
      for (let i = 0; i < 2; i++) {
        ctx.fillStyle = shades[i];
        if (i) {
          ctx.translate(0, 3.3);
        }
        ctx.fillRect(0, this.y - (this.linH / 3) * 1.5, init.w, this.h + (this.linH / 3) * (3 - i * 1.5));
      }
      ctx.translate(0, -3.3);
      // road itself
      ctx.fillStyle = 'black';
      ctx.fillRect(0, this.y, init.w, this.h);
      // road markings
      let gap = this.linW / 3;
      for (let i = 0; i < 18; i++) {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.moveTo(gap * i + 6, this.linY);
        ctx.lineTo(gap * i + 3 + this.linW, this.linY);
        ctx.lineTo(gap * i + this.linW, this.linY + this.linH);
        ctx.lineTo(gap * i + 1.5, this.linY + this.linH);
        ctx.closePath();
        ctx.fill();
        gap = this.linW + (this.linW / 1.5);
        // not simply gap+= this.linW since don't wanna move it along exponentially, gap isn't simply x coord but the offset 4 x
      }
      grass();
    }
  }

  let grass = {
    amt: inProptn(0, 50),
    roots: [],
    soil: null,
    draw() {
      for (let i = 0; i < 4; i++) {
        soil = document.querySelector(`.grass${i}`);
        for (let j = 0; j < amt; j++) {
          roots[j] = new Image(50, 50);
          roots[j].src = '../img/grs.png';
          soil.appendChild(roots[j]);
        }
        if (i < 3) {
          
        }
      }
    }
  }

  function grass() {
    //mayb better 4 reponsiveness as canv drawImag
    let amt = inProptn(0, 50);
    for (let i = 0; i < 4; i++) {
      let roots = [];
      let soil = document.querySelector(`.grass${i}`);
      soil.style.width = `${amt * init.w}px`;
      for (let j = 0; j < amt; j++) {
        roots[j] = new Image(50, 50);
        roots[j].src = '../img/grs.png';
        soil.appendChild(roots[j]);
      }
      if (i < 3) {
        soil.style.bottom = `${i * 30 - 50}px`;
        // p allg now i think for responsiveness except when enlarged heaps
      } else {
        soil.style.top = `${road.y - 50 - (road.linH / 3)}px`;
        console.log(soil.style.top);
      }
    }
  }

  'load resize'.split(' ').forEach(function(e) {
    // rescale things on both page load n resize
    window.addEventListener(e, draw2suit, false);
  })

  function draw2suit() {
    init.setScl();
    road.draw();
    pageSign(`${Math.ceil(road.y - 100 - (road.linH / 3))}px`);
  }

  function inProptn(nu, de) {
    // f 4 width, since usually 0 in arr; t 4 h
    return !nu ? Math.ceil(Math.abs(init.w / de))
              : Math.ceil(Math.abs(init.h / de));
  }

  function pageSign(signX) {
    let pS = document.querySelector('.page-sign');
    // All in future...
    pS.style.top = signX;
    console.log(signX);
    pS.style.height = `${inProptn(1, 6)}px`;
    pS.style.width = `${inProptn(0, 120)}px`;
  }

  // const ppl = document.querySelector('.ppl-img-cont');
  //
  // for (let i = 0; i < ppl.children.length; i++) {
  //   ppl.children[i].addEventListener('click', function() {
  //     ppl.children[i].classList.toggle('hide');
  //     ppl.children[i + 1].classList.toggle('hide');
  //
  //   }, false);
  // }


}());
