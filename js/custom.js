import Litepicker from 'litepicker';
// import mapboxgl from 'mapbox-gl';
// import needs to be outside iffe wrapper, otherwise throws undefined errors; i think this is because es6 modules are pre-parsed instead of commonjs (require) being called on demand, meaning that when first read the objs requiring litepicker are not yet defined... obvs out here litepicker-depending objs are still not defined, though they are within an as of yet anon func, so it must be able to access necessary values as returns once wrapper iffe is called, whereas if they were in the same global scope, the module isn't gonna wait for returns but expects those values there from the start

(function () {

  const anime = require('animejs/lib/anime.js');
  // const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

  const omni = {
    mb: new Map([
      ['ppl', [1, 1]],
      ['days', [1, 5]],
      ['$', 109],
      ['gas', 3.7]
    ]),
    mn: new Map([
      ['ppl', [1, 2]],
      ['days', [1, 10]],
      ['$', 129],
      ['gas', 8.5]
    ]),
    must: new Map([
      ['ppl', [1, 5]],
      ['days', [3, 10]],
      ['$', 144],
      ['gas', 9.7]
    ]),
    cpv: new Map([
      ['ppl', [2, 6]],
      ['days', [2, 15]],
      ['$', 200],
      ['gas', 17]
    ])
  };

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  // so that one canvas px = one physical px, otherwise on big new retina screens or whatnot canvas pxs can be blurred

  var inpBits = Array.from(document.querySelectorAll('.inp-el'));
  // all the input-taking elements so can carousel them round n treat their values appropriately

  const picker = new Litepicker({
    element: document.querySelector('.date'),
    startDate: new Date(),
    inlineMode: true,
    autoRefresh: true,
    autoApply: true
  });

  let init = {
    get w() { return window.innerWidth; },
    get h() { return window.innerHeight; },
    // getter used so that page is sorta reponsive w/o css, & so coords of elements are relative to user and not actual page position
    setScl() {
      document.body.style.width = `${this.w}px`;
      document.body.style.height = `${this.h}px`;
      // style used on html els and not for canvas, since canvas a js obj which doesn't read/need css
      canvas.width = this.w;
      canvas.height = this.h;
      // when init is called, sets off a domino effect of all the other objs that need 2 be initd
      road.draw();
    }
  };

  let road = {
    // these getters are for the more complex calcs so the code below isn't an instance migraine, i mean it's still messy but road's h always inProtn(1, 7) and the line w inProtn(0, 9)
    get y() { return init.h - inProptn(1, 7) * 1.5; },
    get linY() { return this.y + (inProptn(1, 7) / 3); },
    get linH() { return inProptn(1, 7) / 12; },
    animark: 0,
    // this is for the anime func, the value is changed 2 whatever it's set at over there, which is equivalent as you'll see below 2 a translateX value
    draw() {
      // drawing curbs first
      let shades = ['#9ca297', '#b1bab0'];
      for (let i = 0; i < 2; i++) {
        ctx.fillStyle = shades[i];
        if (i) {
          ctx.translate(0, 3.3);
          // curbs r actually just 2 slightly different coloured rects behind the road, translate gives some very slight illusion of 3d, slightly
        }
        ctx.fillRect(0, this.y - (this.linH / 3) * 1.5, init.w, inProptn(1, 7) + (this.linH / 3) * (3 - i * 1.5));
      }
      ctx.translate(0, -3.3);
      // road itself
      ctx.fillStyle = 'black';
      ctx.fillRect(0, this.y, init.w, inProptn(1, 7));
    },
    markings() {
      // road markings
      let gap = inProptn(0, 9) / 3;
      for (let i = 0; i < 18; i++) {
        // 18 is arbitrary but big enough to encompass all 'pages' as well as if site is zoomed out
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.moveTo(gap * i + 6 - this.animark, this.linY);
        // animark is for animate, the essentially translateX val
        ctx.lineTo(gap * i + 3 + inProptn(0, 9) - this.animark, this.linY);
        ctx.lineTo(gap * i + inProptn(0, 9) - this.animark, this.linY + this.linH);
        ctx.lineTo(gap * i + 1.5 - this.animark, this.linY + this.linH);
        ctx.closePath();
        ctx.fill();
        gap = inProptn(0, 9) + (inProptn(0, 9) / 1.5);
        // first gap val is just the offset from x=0, after that offset from last line needs 2 include the prev line width
      }
      ppl.draw();
    }
  };

  let ppl = {
    cont: document.querySelector('.ppl-cont'),
    picker: ['julie', 'spike'],
    // names of the little ppl, so that they can be subbed into img src
    chrs: new Array(6),
    draw() {
      while (this.cont.lastChild) {
        // so that on resize, last little ppl can be whooshed away n new ones made
        this.cont.lastChild.remove();
      }
      for (let i = 0; i < 6; i++) {
        this.chrs[i] = new Image();
        this.chrs[i].src = `../img/${this.picker[i%2]}.png`;
        poke(this.chrs[i]);
        // adds click events 2 them
        this.cont.appendChild(this.chrs[i]);
      }
      signs.draw();
    },
    no: 0
  };

  function poke(el) {
    el.addEventListener('click', function() {
      if (el.src.includes('inblack')) {
        ppl.no--;
        document.querySelector('.ppl-no').textContent = `${ppl.no}`;
        // lucky that the names r the same length!
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

  let signs = {
    page: 1,
    pS: [document.querySelector('.page-sign-next'), document.querySelector('.page-sign-prev')],
    // height is not responsive atm!!
    get yPos() {
      return (road.y - (road.linH / 3) * 1.5)-inProptn(1, 6); },
    draw() {
      ctx.fillStyle = '#cdc597';
      // eek this is just, ratios of screen w/h etc., x has init.w - etc for right, y is top of curbs from road - this h
      ctx.fillRect(init.w - inProptn(0, 21), this.yPos, inProptn(0, 150), inProptn(1, 6));
      this.pS[0].style.top = `${this.yPos - this.pS[0].clientHeight}px`;
      this.pS[0].style.left = `${init.w - inProptn(0, 21) - this.pS[0].clientWidth}px`;
      // next obj init
      car.position();
    }
  };

  let car = {
    thingItself: document.querySelector('.car'),
    // a short wee beast but useful in other things, like animate n
    position() {
      this.thingItself.style.bottom = `${vp2px(0, 15)}px`;
      // this! is properly not reponsive
    }
  };

  let grass = {
    amt: inProptn(0, 50),
    // each grass img is 50x50 so the amt needed 2 fill up screen is w/50
    roots: new Array(inProptn(0, 50)),
    // for holding each img
    soil: new Array(4),
    // for each line of grass, differently positioned
    get lawnmower() {
       Array.from(document.querySelector('.grass-cont').children); },
      // very interesting!! that a return here messes it all up, because then the lawnmower only mows the values of a new arr called lawnmower (and the same without the getter), whereas without the return lawnmower literally is one and the same with the arr of grass, and so can delete the dom elements accordingly
    draw() {
      if (this.lawnmower) {
      // if empty, first init; if true, mow all the old grass and redraw relevant to resize
        this.lawnmower.forEach(x => {
          while (x.lastChild) {
            x.lastChild.remove();
          }
        } ); }
      for (let i = 0; i < 4; i++) {
        this.soil[i] = document.querySelector(`.grass${i}`);
        this.soil[i].style.width = `${this.amt * init.w}px`;
        for (let j = 0; j < this.amt; j++) {
          this.roots[j] = new Image(50, 50);
          this.roots[j].src = '../img/grs.png';
          this.soil[i].appendChild(this.roots[j]);
        }
      }
      this.soil.forEach( x => { x.style.bottom = `${this.soil.indexOf(x) * 30 - 50}px`; } );
      this.soil[3].style.top = `${road.y - 50 - (road.linH / 3)}px`;
    }
  };

  let date = {
    cont: document.querySelector('.date-cont'),
    inst: [new Date()],
    msDays: 84600000,
    txtEle: document.querySelector('.human-form-day'),
    humanFriendly(d) {
      return d.toDateString().slice(0, -4); },
    init() {
      picker.ui.classList.add('block', 'inline');
      this.cont.style.left = `${init.w}px`;
      this.cont.style.width = `${picker.ui.clientWidth + 18}px`;
      // i quickly became cssphobic
      this.txtEle.textContent = `${this.humanFriendly(this.inst[0])} until ${this.humanFriendly(this.inst[0])}`;
    },
    get dayDiff() {
      return Math.floor(Math.abs(this.inst[1]-this.inst[0])/this.msDays)+1; },
    noEle: document.querySelector('.day-no')
  };

  date.noEle.addEventListener('click', function(e) {
    let inpMS = date.inst[0].getTime() +
    Math.floor(date.msDays * date.noEle.valueAsNumber) - date.msDays;
    picker.setDateRange(date.inst[0], new Date(inpMS));
  }, false);

  function datedealer() {
    let clkd = picker.getDate();
    date.inst.push(clkd.dateInstance);
    date.txtEle.textContent = `${date.humanFriendly(date.inst[0])} until ${date.humanFriendly(date.inst[0])}`;
    if (date.inst.length > 1) {
      picker.setDateRange(date.inst[0], date.inst[1]);
      date.noEle.value = `${date.dayDiff}`;
      date.days = date.dayDiff;
      date.txtEle.textContent = `${date.humanFriendly(date.inst[0])} until ${date.humanFriendly(date.inst[1])}`;
      date.inst.shift();
    }
  }

  let mechanic = {
    cont: document.querySelector('.v-cont'),
    vechs: Array.from(document.querySelector('.vechs').children),
    vRightPos: [12, 7, 81],
    // fyi arr order of vechs is mb, mn, cpv
    anicar: 0,
    // carFacts: ['']
    init() {
      this.cont.style.left = `${init.w * 2}px`;
      for (let i = 0; i < this.vechs.length; i++) {
        // this.vechs[i].style.right = `${vp2px(this.vechs[i])}`
        this.vechs[i].style.right = `${vp2px(1, this.vRightPos[i]) - init.w + this.anicar}px`;
        // can u rly not get right pos from dom?
      }
    }
  };

  mechanic.vechs.forEach(x => {
    x.addEventListener('click', function(e) {
      let name = x.classList[1];
      let newD = document.createElement('div');
      newD.classList.add('wrapper', 'block', `${name}`, 'manu-facts');
      document.querySelector('.v-info').appendChild(newD);
      cardealer();
    }, true);
  });

  function cardealer() {

  }

  console.log(omni.mb.get('ppl'), Object.keys(omni));

  Object.keys.forEach(x => {
    console.log(x);
  })

  function animate() {
    anime({
      targets: car.thingItself,
      translateX: 80 * signs.page,
      easing: 'easeOutExpo',
      duration: 3000
    });
    anime({
      targets: inpBits,
      translateX: -(900 * signs.page + signs.page * 100),
      easing: 'easeOutQuad',
      duration: 1500
    });
    anime({
      targets: road,
      animark: 800 * signs.page,
      // round: 1,
      easing: 'easeOutExpo',
      duration: 2750,
      update: function() {
        road.draw();
        road.markings();
      }
    });
    grass.draw();
    anime({
      targets: grass.soil,
      translateX: -(800 * signs.page),
      easing: 'easeOutExpo',
      duration: 2700
    });
    if (signs.page === 2) {
      anime({
        targets: mechanic,
        anicar: init.w,
        round: 1,
        easing: 'easeOutExpo',
        duration: 4750,
        update: function() {
          mechanic.init();
        }
      });
    }
    signs.page++;
    road.animark = 0;
    mechanic.anicar = -init.w;
  }


  // if (signs.page === 2) {
  //   Object.defineProperty(this, 'exists', {value: 1, writable: true});
  //   // this is to let other objs know that there's a carpark in the way of where they wanna go
  //   ctx.fillStyle = 'black';
  //   ctx.fillRect(init.w / 2, road.y - 3.3, 100, road.h);
  //   // a sneaky black rect to cover where the carpark curb crosses over the road
  //   anime({
  //     targets: carpark,
  //     anipark: 0,
  //     // round: 1,
  //     easing: 'linear',
  //     duration: 2750,
  //     update: function() {
  //       carpark.init();
  //       // carpark.placeCars();
  //     }
  //   });
  // }

  // let carpark = {
  //   colours: ['#9ca297', '#b1bab0', 'black'],
  //   vechCont: document.querySelector('.cp-cars'),
  //   vechs: ['mb', 'cpv', 'mini'],
  //   // 2 draw curb n carpark respectively
  //   anipark: init.w * 3,
  //   tY: 0,
  //   // pos on page was written first so easily 2 subtract from pos on screen to animate rather than the other way around
  //   // fractions man >:(
  //   init() {
  //     for (let i = 0; i < 3; i++) {
  //       // not rly sure why i make things so complicated
  //       if (i) {
  //         ctx.translate(0, 3.3);
  //       } else {
  //         ctx.translate(0, -3.3);
  //       }
  //
  //       ctx.fillStyle='red';
  //       ctx.fillRect(0+this.anipark, this.tY, 1000, 1000);
  //
  //       ctx.beginPath();
  //       ctx.fillStyle = `${this.colours[i]}`;
  //       ctx.moveTo((init.w / 2) + this.anipark, init.h);
  //       // ctx.lineTo(init.w / 2 + init.w / 5, init.h / 2);
  //       // cause its curvy n translated with curbies starting x gonna b a lil different
  //       ctx.bezierCurveTo(init.w / 2 + this.anipark, init.h, (init.w / 2) + (init.w / 18) + this.anipark, init.h - init.h / 3, (init.w / 2) + (init.w / 7) + this.anipark, init.h - init.h / 3);
  //       // annoying that this method can't take more than one return from inProptn
  //       ctx.lineTo(init.w + this.anipark, init.h - init.h / 3);
  //       ctx.lineTo(init.w + this.anipark, init.h);
  //       ctx.closePath();
  //       ctx.fill();
  //       console.log(this.anipark, (init.w / 2) );
  //       // i cannot BElieve setting vals to props within prop funcs doesn't change outer val ig it makes sense but like funcs should b able 2 change more global vars than themselves?? is this what;s happening w grass arrs?
  //     }
  //   },
  //   placeCars() {
  //     // redo when cpvan acc done lol
  //     for (let i = 0; i < this.vechs.length; i++) {
  //       let v = new Image(300, 200);
  //       v.src = `../img/${this.vechs[i]}.png`;
  //       this.vechCont.appendChild(v);
  //     }
  //   },
  //   plant() {
  //
  //   }
  // };

  // mapboxgl.accessToken = 'pk.eyJ1IjoibGFuYWxkZXIiLCJhIjoiY2tweGlqd2RmMWVyajJ2b2lrejYzbDZ5diJ9.ELtetZkKKBOunIgDPByWYQ';
  //
  // const map = new mapboxgl.Map({
  //   container: document.querySelector('.map'),
  //   style: 'mapbox://styles/mapbox/streets-v11',
  //   center: [-74.5, 40],
  //   zoom: 9
  // });
  //
  // let geo = {
  //   cont: document.querySelector('.map'),
  //   init() {
  //     this.cont.style.width = `${inProptn(0, 3)}px`;
  //     this.cont.style.height = `${inProptn(1, 3)}px`;
  //     document.querySelector('.map-cont').style.left = `${init.w * 2}px`;
  //   }
  // };
  //
  // let geoInfo = {
  //
  // }

  function tailor() {
    init.setScl();
    road.markings();
    grass.draw();
    date.init();
    mechanic.init();
    // geo.init();
  }

  function inProptn(nu, de) {
    // f 4 width, since usually 0 in arr; t 4 h
    return !nu ? Math.ceil(Math.abs(init.w / de))
              : Math.ceil(Math.abs(init.h / de));
  }

   function vp2px(d, vw) {
    // d T = vw/h -> px, d F reverse
    return d ? Math.round((window.innerHeight * vw) / 100)
      : Math.round(((vw * 100) / window.innerWidth) * 100);
      // this second one a bit diff from the formula on stackoverflow but f it
  }

  signs.pS[0].addEventListener('click', animate, false);
  picker.ui.addEventListener('click', datedealer, false);

  'load resize'.split(' ').forEach(function(e) {
    // rescale things on both page load n resize
    window.addEventListener(e, tailor, false);
  });

}());
