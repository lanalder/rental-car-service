import $ from 'jquery';
  window.jQuery = $;
  window.$ = $;

import Litepicker from 'litepicker';
// import mapboxgl from 'mapbox-gl';
// import needs to be outside iffe wrapper, otherwise throws undefined errors; i think this is because es6 modules are pre-parsed instead of commonjs (require) being called on demand, meaning that when first read the objs requiring litepicker are not yet defined... obvs out here litepicker-depending objs are still not defined, though they are within an as of yet anon func, so it must be able to access necessary values as returns once wrapper iffe is called, whereas if they were in the same global scope, the module isn't gonna wait for returns but expects those values there from the start

(function () {

  const anime = require('animejs/lib/anime.js');
  // const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
  const parsley = require('parsleyjs/dist/parsley.min.js');

  // obj to contain the transport dataset
  const omni = {
    keyz: ['mb', 'mn', 'must', 'cpv'],
    // that which pairs car with vals below are the indices of above arr
    vals: {
      ppl: [[1, 1], [1, 2], [1, 5], [2, 6]],
      days: [[1, 5], [1, 10], [3, 10], [2, 15]],
      coin: [109, 129, 144, 200],
      gas: [109, 129, 144, 200]
    }
  };

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  // so that one canvas px = one physical px, otherwise on big new retina screens or whatnot canvas pxs can be blurred

  var inpBits = Array.from(document.querySelectorAll('.inp-el'));
  // all the input-taking elements so can carousel them round n treat their values appropriately

  let init = {
    get w() { return window.innerWidth; },
    get h() { return window.innerHeight; },
    // getter used so that page is sorta reponsive w/o css, & so coords of elements are relative to user and not actual page position (ideally)
    setScl() {
      document.body.style.width = `${this.w}px`;
      document.body.style.height = `${this.h}px`;
      // style used on html els and not for canvas, since canvas css doesn't determine actual available coords, but as an obj its size does this as well as set automatically size as an element (im p sure)
      // canvas (as obj) default size 300x150 n if only change css, scales to that n is all blurred
      canvas.width = this.w;
      canvas.height = this.h;
      // when init is called, sets off a domino effect of all the other objs that need 2 be initd
      // ghost();
      road.draw();
    }
  };

  // _*_*_*_*_*_*_*_*_| INITIAL OBJS |_*_*_*_*_*_*_*_*_*_

  let road = {
    // these getters (methods ig) are for the more complex calcs so the code below isn't an instant migraine, i mean it's still messy but road's h always inProtn(1, 7) and the line w inProtn(0, 9)
    get y() { return init.h - inProptn(1, 7) * 1.5; },
    get linY() { return this.y + (inProptn(1, 7) / 3); },
    get linH() { return inProptn(1, 7) / 12; },
    animark: 0,
    // this is for the anime func, the value is changed 2 whatever it's set at over there, which is equivalent as you'll see below 2 a translateX value (which can't simply b used bc of canvas, don't wanna move the whole thing but only some of its drawings)
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

  let signs = {
    page: 1,
    pS: [document.querySelector('.page-sign-1'), document.querySelector('.page-sign-2')],
    get txt() { return [['Go back ←', `Q. ${this.page - 1} of 4`], ['Onwards →', `Q. ${this.page} of 4`]]; },
    // get just used so can reference this.page, prop defs can't ref each other it seems bc they're all read in one initialising sweep, unlike methods/get, which happen after obj has been processed
    anisign: 0,
    // height is not responsive atm!!
    eraser: [[], []],
    get yPos() {
      return (road.y - (road.linH / 3) * 1.5)-inProptn(1, 6); },
    draw() {
      if (this.eraser) {
        this.erase();
      }
      ctx.fillStyle = '#1A1D22';

      // for first sign (gets confusing since signs alternate whether they're prev or next so there's the illusion of driving by them (better than making a whole bunch of one-off use signs tho), but 1st sign (pS[0]) always the sign most to the left)
      ctx.fillRect(init.w - inProptn(0, 21) - this.anisign, this.yPos, inProptn(0, 150), inProptn(1, 6));
      this.pS[0].style.top = `${this.yPos - this.pS[0].clientHeight}px`;
      this.pS[0].style.left = `${init.w - inProptn(0, 21) - this.pS[0].clientWidth - this.anisign}px`;

      this.eraser[0].push(init.w - inProptn(0, 21) - this.anisign - 3, this.yPos - 3, inProptn(0, 150) + 5, inProptn(1, 6) + 5);

      // 2nd sign
      ctx.fillRect(init.w * 2 - inProptn(0, 3) - this.anisign, this.yPos, inProptn(0, 150), inProptn(1, 6));
      this.pS[1].style.top = `${this.yPos - this.pS[1].clientHeight}px`;
      this.pS[1].style.left = `${init.w * 2 - inProptn(0, 3) - this.pS[1].clientWidth - this.anisign}px`;

      this.eraser[1].push(init.w * 2 - inProptn(0, 3) - this.anisign - 3, this.yPos - 3, inProptn(0, 150) + 5, inProptn(1, 6) + 5);

      // next obj init
      // car.position();
    },
    erase() {
      ctx.clearRect(this.eraser[0][this.eraser[0].length - 4], this.eraser[0][this.eraser[0].length - 3], this.eraser[0][this.eraser[0].length - 2], this.eraser[0][this.eraser[0].length - 1]);

      ctx.clearRect(this.eraser[1][this.eraser[1].length - 4], this.eraser[1][this.eraser[1].length - 3], this.eraser[1][this.eraser[1].length - 2], this.eraser[1][this.eraser[1].length - 1]);

      this.eraser = [[], []];
    }
  };

  let car = {
    thingItself: document.querySelector('.car'),
    // a short wee thing but an obj in its own right mostly for anime
    position() {
      this.thingItself.style.bottom = `${inProptn(1, 7) * 1.1}px`;
      // this! is properly not reponsive
      grass.draw();
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
      // not sure i 'get' getters yet but not simply a prop nor has a return since both target a representation of arr and not the actual thing as it exists in the dom, maybe what the 'direct' part of getter is except as a method does the exact same, so still seems redundant...
    draw() {
      if (this.lawnmower) {
      // if empty, this is the first init; if true, mow all the old grass and redraw relevant to resize
        this.lawnmower.forEach(x => {
          while (x.lastChild) {
            x.lastChild.remove();
          }
        } ); }
      for (let i = 0; i < 4; i++) {
        // 4 lines of grass
        this.soil[i] = document.querySelector(`.grass${i}`);
        this.soil[i].style.width = `${this.amt * init.w}px`;
        for (let j = 0; j < this.amt; j++) {
          this.roots[j] = new Image(50, 50);
          this.roots[j].src = '../img/grs.png';
          this.soil[i].appendChild(this.roots[j]);
        }
      }
      this.soil.forEach( x => { x.style.bottom = `${this.soil.indexOf(x) * 30 - 50}px`; } );
      // all lines just slightly on top of each other n under the road, except for the last
      this.soil[3].style.top = `${road.y - 50 - (road.linH / 3)}px`;
    }
  };

  // _*_*_*_*_*_*_*_*_| Pg. 1 PEOPLE |_*_*_*_*_*_*_*_*_*_

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
        // poke adds click events 2 them
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

  // _*_*_*_*_*_*_*_*_| Pg. 2 CALENDAR |_*_*_*_*_*_*_*_*_*_

  const picker = new Litepicker({
    element: document.querySelector('.date'),
    startDate: new Date(),
    inlineMode: true,
    autoRefresh: true,
    autoApply: true
  });

  let date = {
    cont: document.querySelector('.date-cont'),
    // inst[0] for default day (today), [1] to be for the end of date range (these will change a bit)
    inst: [new Date(), new Date()],
    // ms in a day
    msDays: 84600000,
    txtEle: document.querySelector('.human-form-day'),
    // to present date in a sensible format
    humanFriendly(d) {
      return d.toDateString().slice(0, -4); },
    init() {
      picker.ui.classList.add('block', 'inline');
      this.cont.style.left = `${init.w}px`;
      this.cont.style.width = `${picker.ui.clientWidth + 18}px`;
      // i quickly became cssphobic
      this.txtEle.textContent = `${this.humanFriendly(this.inst[0])} until ${this.humanFriendly(this.inst[1])}`;
      $('.litepicker').click(function() {
        valiDate();
      });
    },
    get dayDiff() {
      return Math.floor(Math.abs(this.inst[1]-this.inst[0])/this.msDays)+1; },
    noEle: document.querySelector('.day-no')
  };

  date.noEle.addEventListener('click', function(e) {
    let inpMS = date.inst[0].getTime() +
    Math.floor(date.msDays * date.noEle.valueAsNumber) - date.msDays;
    // just highlighting the daterange for input in the lil up n down no box rather than picker itself
    picker.setDateRange(date.inst[0], new Date(inpMS));
  }, false);

  function datedealer() {
    let clkd = picker.getDate();
    // ensuring the human readable date has the later date last
    if (clkd.dateInstance > date.inst[0]) {
      date.inst[1] = clkd.dateInstance;
    } else {
      date.inst[0] = clkd.dateInstance;
    }
    // highlighting daterange for pickled picked picker dates
    picker.setDateRange(date.inst[0], date.inst[1]);
    // letting inp no box reflect that
    date.noEle.value = `${date.dayDiff}`;
    date.txtEle.textContent = `${date.humanFriendly(date.inst[0])} until ${date.humanFriendly(date.inst[1])}`;
  }

  $('.day-no').change(function() {
    valiDate();
  });

  function valiDate() {
    $('.day-no').parsley().validate();
    if (!$('.day-no').parsley().isValid()) {
      date.txtEle.textContent = 'Sorry! Rentals have up to 15 days :o(';
      // date.txtEle.style.backgroundColor =
    }
  }

  // _*_*_*_*_*_*_*_*_| Pg. 3 CAR SELECT |_*_*_*_*_*_*_*_*_*_

  function chosen1() {
    for (let i = 0; i < omni.keyz.length; i++) {
      // for each vechicle, as repped by index in omni.val props, check inputted ppl no is within range, n then the same for days, and for the index that passes the test, push that (i as .keyz index === car) to options arr
      if (ppl.no >= omni.vals.ppl[i][0] && ppl.no <= omni.vals.ppl[i][1] && date.noEle.valueAsNumber >= omni.vals.days[i][0] && date.noEle.valueAsNumber <= omni.vals.days[i][1]) {
        mechanic.opts.push(omni.keyz[i]);
      }
    }
  }

  let mechanic = {
    txt: document.querySelector('.v-tit'),
    caryard: document.querySelector('.vechs'),
    opts: [],
    anicar: init.w * 2,
    names: ['motorbike', 'small car', 'large car', 'campervan'],
    init() {
      this.txt.style.left = `${init.w * 2}px`;
    },
    present() {
      // since must(ang) alr on screen as default, a. don't wanna try add it again and b. can drive offscreen into the abyss
      if (this.opts.includes('must')) {
        this.opts = this.opts.filter(x => x !== 'must');
      } else {
        car.thingItself.style.zIndex = '-3';
        // otherwise drives in front of mini n looks straight up silly
        anime({
          targets: car.thingItself,
          translateX: init.w + 1000,
          // extra 1k just for safety
          easing: 'easeOutQuad',
          duration: 2600
        });
        window.setTimeout(function() {
          car.thingItself.classList.add('hide');
        }, 1400);
        window.clearTimeout();
        // not strictly necessary but good practice ig
      }
      this.opts.forEach(x => {
        let c = new Image();
        c.src = `../img/${x}.png`;
        c.classList.add('v', `${x}`);
        c.style.right = `${-init.w}px`;
        this.caryard.appendChild(c);
        carChat();
      });
    }
  };

  function carChat() {
    let clkd = [];
    let infoCont = document.querySelector('.v-info');
    [...Array.from(mechanic.caryard.children), car.thingItself].forEach(x => {
    // spread ... makes a flattened list of an iterable literal, super cool n handy here otherwise end up w a 2d arr -- don't want to push default car into caryard, since this guy requires special treatment, but also needs to be included here
      x.addEventListener('click', function(e) {
        clkd.push(x);
        if (clkd.length > 1) {
          infoCont.removeChild(infoCont.firstChild);
        }
        // if (clkd[clkd.length - 1] === clkd[clkd.length - 2]) {
        //   console.log('hdi', clkd[clkd.length - 1], clkd[clkd.length - 2]);
        //   while (infoCont.lastChild) {
        //     infoCont.lastChild.remove();
        //   }
        //   clkd = [];
        // } else {
        let newD = document.createElement('div');
        let k = omni.keyz.indexOf(x.classList[1]);

        newD.classList.add('wrapper', 'block', 'manu-facts', `${x.classList[1]}`);
        infoCont.appendChild(newD);

        newD.textContent = `${mechanic.names[k]}: \r\n`;
        newD.textContent += `$${omni.vals.coin[k] * date.noEle.valueAsNumber} for your ${date.noEle.valueAsNumber} days away`;

      }, false);
    });
  }



  // _*_*_*_*_*_*_*_*_| HANDY DANDY FUNCS |_*_*_*_*_*_*_*_*_*_

  function animate(dirc) {
    console.log(signs.page);
    // dirc if 0 goes back (since transX becomes 0 having been times'd by it, ie. og. pos), if 1 forward
    // ghost();
    if (dirc) {
      signs.page++;
    } else {
      signs.page--;
    }
    anime({
      targets: car.thingItself,
      translateX: (80 * dirc ) * signs.page,
      easing: 'easeOutExpo',
      duration: 3000
    });
    anime({
      targets: inpBits,
      translateX: dirc * (-((init.w / 1.1) * (signs.page - 1) + ((signs.page - 1) * 120))),
      // idk what mathematically is going on here but random sums haven't failed me yet
      easing: 'easeOutExpo',
      duration: 1500
    });
    anime({
      targets: road,
      animark: dirc * (400 * signs.page),
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
      translateX: dirc * (-(400 * signs.page)),
      easing: 'easeOutExpo',
      duration: 2700
    });
    if (signs.page === 3) {
      chosen1();
      mechanic.present();
      anime({
        targets: mechanic.caryard,
        translateX: dirc * (-(init.w + vp2px(0, 20))),
        // negative here as well since style target is .right (-init.w in .present) and vechs come from the right
        easing: 'easeOutExpo',
        duration: 3000
      });
    }
    // if (signs.page % 2) {
      anime({
        targets: signs,
        anisign: dirc * ((init.w / 1.3) * (signs.page - 1)),
        easing: 'easeOutExpo',
        duration: 2750,
        update: function() {
          signs.draw();
        }
      });

      let peas = [Array.from(signs.pS[0].children), Array.from(signs.pS[1].children)];
      peas.forEach(x => {
        x.forEach(y => {
          y.textContent = signs.txt[peas.indexOf(x)][x.indexOf(y)];
          // blame linter on how abstract this got, it didn't like when peas was defined in loop something ab scope and confusing semantics
        });
      });
    console.log(signs.page);
    // }
    // signs.page++;
    // road.animark = 0;
  }

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
    car.position();
    // grass.draw();
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
    return d ? Math.round((init.w * vw) / 100)
      : Math.round((vw * 100 / init.w) * 100);
  }

  signs.pS[0].addEventListener('click', function() {
    if (signs.page === 1 && ppl.no === 0) {
      document.querySelector('.ppl-msg').textContent = "Cannot rent a car for nobody! Select at least 1 person";
    } else if (signs.page === 1 && ppl.no > 0) {
      animate(1);
      // signs.page++;
    } else if (signs.page !== 1) {
      animate(0);
      // signs.page--;
      Array.from(signs.pS[0].children).forEach(x => {
        x.textContent = signs.txt[1][Array.from(signs.pS[0].children).indexOf(x)];
      });
    }
  }, false);

  signs.pS[1].addEventListener('click', function() {
    if (signs.page === 2 && $('.day-no').parsley().isValid()) {
      // chosen1();
      // mechanic.present();
      animate(1);
      // signs.page++;
    }
  }, false);

  // function ghost() {
  //   inpBits.forEach(x => {
  //     console.log(x.style.left, x.style.right, x.style.transform);
  //     if (x.style.left > init.w || x.style.transform < 0) {
  //       x.classList.add('hide');
  //     } else {
  //       x.classList.remove('hide');
  //     }
  //   })
  // }

  picker.ui.addEventListener('click', datedealer, false);

  // cache was annoying
  date.noEle.value = 1;

  'load resize'.split(' ').forEach(function(e) {
    // rescale things on both page load n resize
    window.addEventListener(e, tailor, false);
  });

}());
