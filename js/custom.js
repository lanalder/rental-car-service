(function () {

  const anime = require('animejs');

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  let init = {
    get w() { return window.innerWidth; },
    get h() { return window.innerHeight; },
    setScl() {
      document.body.style.width = `${this.w}px`;
      document.body.style.height = `${this.h}px`;
      canvas.width = this.w;
      canvas.height = this.h;
      road.draw();
    }
  };

  let ppl = {
    cont: document.querySelector('.ppl-cont'),
    picker: ['julie', 'spike'],
    chrs: new Array(6),
    draw() {
      while (this.cont.lastChild) {
        this.cont.lastChild.remove();
      }
      for (let i = 0; i < 6; i++) {
        this.chrs[i] = new Image();
        this.chrs[i].src = `../img/${this.picker[i%2]}.png`;
        clickable(this.chrs[i]);
        this.cont.appendChild(this.chrs[i]);
      }
      signs.draw();
    },
    no: 0
  };

  let road = {
    h: inProptn(1, 6),
    get y() { return init.h - this.h * 1.5; },
    // for lines... new fav pattern ig isget (n 3s today) nice 2 kno what ur up to tho instead of giganturan expressions (statements??) n mostly here bc objs suck at self-awareness (no self-ref this)
    get linY() { return this.y + (this.h / 3); },
    get linH() { return this.h / 9; },
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
      ppl.draw();
    }
  };

  let signs = {
    page: 0,
    pS: [document.querySelector('.page-sign-next'), document.querySelector('.page-sign-prev')],
    // height is not responsive atm!!
    get yPos() { return (road.y - (road.linH / 3) * 1.5)-inProptn(1, 6); },
    draw() {
      ctx.fillStyle = '#cdc597';
      // eek this is just, ratios of screen w/h etc., x has init.w - etc for right, y is top of curbs from road - this h
      ctx.fillRect(init.w - inProptn(0, 21), this.yPos, inProptn(0, 150), inProptn(1, 6));
      this.pS[0].style.top = `${this.yPos - this.pS[0].clientHeight}px`;
      this.pS[0].style.left = `${init.w - inProptn(0, 21) - this.pS[0].clientWidth}px`;
      car.position();
    }
  };

  let car = {
    thingItself: document.querySelector('.car'),
    position() {
      this.thingItself.style.bottom = `${inProptn(1, 18)}px`;
    }
  };

  function grass() {
    let amt = inProptn(0, 50);
    // cleanup 4 responsiveness
    let lawnmower = Array.from(document.querySelector('.grass-cont').children);
    lawnmower.forEach(x => {
      while (x.lastChild) {
        x.lastChild.remove();
      }
    } );
    // acc drawing
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
      } else {
        soil.style.top = `${road.y - 50 - (road.linH / 3)}px`;
      }
    }
  }

  'load resize'.split(' ').forEach(function(e) {
    // rescale things on both page load n resize
    window.addEventListener(e, tailor, false);
  });

  function tailor() {
    // interesting that canvas doesn't get drawn when this method called as func on above ev listener...
    init.setScl();
    grass();
  }

  function inProptn(nu, de) {
    // f 4 width, since usually 0 in arr; t 4 h
    return !nu ? Math.ceil(Math.abs(init.w / de))
              : Math.ceil(Math.abs(init.h / de));
  }

  function clickable(el) {
    el.addEventListener('click', function() {
      if (el.src.includes('inblack')) {
        ppl.no--;
        document.querySelector('.ppl-no').textContent = `${ppl.no}`;
        // lucky that the names r the same length! or could think of a more flexible n less messy method
        el.src = el.attributes[0].textContent.substring(0, 12) + el.attributes[0].textContent.substring(19);
      } else if (el.src.includes('julie')) {
        ppl.no++;
        document.querySelector('.ppl-no').textContent = `${ppl.no}`;
        el.src = '../img/julieinblack.png';
      } else {
        ppl.no++;
        document.querySelector('.ppl-no').textContent = `${ppl.no}`;
        el.src = '../img/spikeinblack.png';
      }
    });
  }

  signs.pS[0].addEventListener('click', function(e) {
    signs.page++;
    animate();
  });

  function animate() {
    anime({
      targets: car.thingItself,
      translateX: 500,
      delay: anime.stagger(1000),
      easing: 'easeOutExpo',
      duration: 1750
    });
    anime({
      targets: document.querySelector('.inp-el'),
      translateX: -700,
      delay: anime.stagger(1000),
      easing: 'easeOutExpo',
      duration: 1750
    });
  }

}());
