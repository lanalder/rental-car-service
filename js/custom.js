import $ from 'jquery';
  window.jQuery = $;
  window.$ = $;

import Litepicker from 'litepicker';
// import mapboxgl from 'mapbox-gl';
// import turf from '@turf/turf';
// import length from '@turf/length';
// import needs to be outside iffe wrapper, otherwise throws undefined errors; i think this is because es6 modules are pre-parsed instead of commonjs (require) being called on demand, meaning that when first read the objs requiring litepicker are not yet defined... obvs out here litepicker-depending objs are still not defined, though they are within an as of yet anon func, so it must be able to access necessary values as returns once wrapper iffe is called, whereas if they were in the same global scope, the module isn't gonna wait for returns but expects those values there from the start

(function () {

  const anime = require('animejs/lib/anime.js');
  // const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
  const parsley = require('parsleyjs/dist/parsley.min.js');

  // obj to contain the transport dataset
  const omni = {
    keyz: ['mb', 'mn', 'car', 'cpv'],
    // that which pairs car with vals below are the indices of above arr
    vals: {
      ppl: [[1, 1], [1, 2], [1, 5], [2, 6]],
      days: [[1, 5], [1, 10], [3, 10], [2, 15]],
      coin: [109, 129, 144, 200],
      gas: [3.7, 8.5, 9.7, 17]
    }
  };

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  // so that one canvas px = one physical px, otherwise on big new retina screens or whatnot canvas pxs can be blurred

  const inpBits = Array.from(document.querySelectorAll('.moving-blocks'));
  // all the input-taking elements so can carousel them round n treat their values appropriately

  const init = {
    get w() { return window.innerWidth; },
    get h() { return window.innerHeight; },
    // getter used so that page is sorta reponsive w/o css, & so coords of elements are relative to user and not actual page width, which (site being a S.P.A) is way bigger than user can see at once
    setScl() {
      document.body.style.width = `${this.w}px`;
      document.body.style.height = `${this.h}px`;
      // style used on html els and not for canvas, since canvas css doesn't determine actual available coords -- actual obj size defaults to 300x150 n if only css is changed it just scales from that n looks rly bad
      canvas.width = this.w;
      canvas.height = this.h;
      // ghost();
      // begin domino of other obj inits
      road.draw();
    }
  };

  // _*_*_*_*_*_*_*_*_| INITIAL OBJS |_*_*_*_*_*_*_*_*_*_

  const road = {
    // road's h always inProptn(1, 7) and the line w inProptn(0, 9), getters below just used 2 make code more readable
    get y() { return init.h - inProptn(1, 7) * 1.5; },
    get linY() { return this.y + (inProptn(1, 7) / 3); },
    get linH() { return inProptn(1, 7) / 12; },
    animark: 0,
    // this is for the anime func, the value is changed 2 whatever it's set at over there, so equivalent 2 a translateX value (which can't simply b used bc of canvas, don't wanna move the whole thing but only some of its drawings)
    draw() {
      // drawing curbs first
      let shades = ['#9ca297', '#b1bab0'];
      for (let i = 0; i < 2; i++) {
        ctx.fillStyle = shades[i];
        if (i) {
          ctx.translate(0, 3.3);
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
    }
  };

  let car = {
    thingItself: null,
    position() {
      if (document.querySelector('.car') == null) {
        // not something 2 repeat on resize
        let musty = new Image();
        musty.src = '../img/car.png';
        document.getElementsByTagName('body')[0].appendChild(musty);
        this.thingItself = musty;
        this.thingItself.classList.add('v', 'car');
        // default car not just in html bc then the paths aren't quite the same for all imgs (needed 4 glow) and this was the quick n dirty way to fix that
      }
      this.thingItself.style.bottom = `${inProptn(1, 7) * 1.1}px`;
      this.thingItself.style.zIndex = 5;
      grass.draw();
    }
  };

  let grass = {
    amt: inProptn(0, 50),
    // each grass img is 50x50 so the amount needed 2 fill up screen is w/50
    roots: new Array(inProptn(0, 50)),
    // for holding each img
    soil: [0, 0, 0, 0],
    // for each line of grass, differently positioned
    get lawnmower() {
       Array.from(document.querySelector('.grass-cont').children); },
      // getters... eh but not simply a prop nor has a return since those give representation of arr and not the actual thing as it exists in the dom
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

  // _*_*_*_*_*_*_*_*_| ROAD (page) SIGNS |_*_*_*_*_*_*_*_*_*_

  let signs = {
    page: 1,
    pS: [document.querySelector('.page-sign-1'), document.querySelector('.page-sign-2')],
    trf: [document.querySelector('.grntrf'), document.querySelector('.redtrf')],
    anisign: 0,
    signPos: [init.w - inProptn(0, 6), init.w * 2 - inProptn(0, 3)],
    pos: {
      x: [init.w - inProptn(0, 6), init.w * 2 - inProptn(0, 3)],
      h: inProptn(1, 5),
      w: inProptn(0, 150),
      sT: road.y - inProptn(1, 6) - (7.4 * init.h / 100),
      tX: ((7.4 * init.h / 100) * 1.9)
    },
    eraser: [[], [], [], []],
    // signpost drawings logged here so can be cleared when they move (one per prev / next sign, 3rd for traffic light)
    get txt() {
      return [['← Back', `Q. ${this.page - 1} of 3`], ['Next →', `Q. ${this.page} of 3`], ['← Back', `Q. ${this.page - 1} of 3`]]; },
    // get just used so can reference this.page, prop defs can't ref each other i guess bc they're all read in one initialising sweep instead of called after
    draw() {
      if (this.eraser) {
        this.erase();
      }
      ctx.fillStyle = '#1A1D22';
      for (let i = 0; i < 2; i++) {
        this.pS[i].style.top = `${this.pos.sT}px`;
        this.pS[i].style.left = `${this.pos.x[i] - (this.pS[i].clientWidth / 1.98) - this.anisign}px`;
        ctx.fillRect(this.pos.x[i] - this.anisign, this.pos.sT, this.pos.w, this.pos.h);
        this.eraser[i].push(this.pos.x[i] - this.anisign - 3, this.pos.sT - 3, this.pos.w + 5, this.pos.h + 5);
      }
    },
    erase() {
      this.eraser.forEach(x => {
        ctx.clearRect(x[0], x[1], x[2], x[3]);
      });
      this.eraser = [[], [], [], []];
    }
  };

  let traffic = {
    // poss look into doing that extend / inheritance thing?
    trf: [document.querySelector('.grntrf'), document.querySelector('.redtrf')],
    rp: [],
    anisign: 0,
    draw(l, n) {
      l.forEach(x => {
        x.style.top = `${signs.pos.sT - ((19 * init.h) / 100)}px`;
        x.style.left = `${signs.pos.x[n] - signs.pos.tX * 1.4 - (this.anisign / 0.9) + (n * 100)}px`;
      });
      ctx.fillRect(signs.pos.x[n] - signs.pos.tX - (this.anisign / 0.9) + (n * 100), signs.pos.sT, signs.pos.w, signs.pos.h);
      signs.eraser[2 + n].push(signs.pos.x[n] - signs.pos.tX - (this.anisign / 0.9) + (n * 100) - 3, signs.pos.sT - 3, signs.pos.w + 5, signs.pos.h + 5);
    },
    lightChange(l) {
      l.forEach(x => x.classList.toggle('hide'));
    },
    clone() {
      for (let i = 0; i < 2; i++) {
        this.rp.push(this.trf[i].cloneNode());
        document.querySelector('.traffic').appendChild(this.rp[i]);
      }
      this.lightChange(this.rp);
    }
  };

  signs.pS[0].addEventListener('click', function() {
    // since signs 1 n 2 are not always next n prev respectively, some conditions for how they act:
    if (signs.page === 1 && ppl.no === 0 || ppl.no >= 7) {
      // no animating till error resolved
      valiPpl();
    } else if (signs.page === 1 && ppl.no > 0 && ppl.no < 7) {
      if (traffic.rp[0] == null) {
        traffic.clone();
      }
      animate(1);
    } else if (signs.page === 2 ) {
      // animate back a page on pg.2 since sign 0 now prev
      animate(0);
    }
  }, false);

  signs.pS[1].addEventListener('click', function() {
    if (signs.page === 2 && traffic.rp[1].classList.contains('hide')) {
      glow(car.thingItself);
      animate(1);
    } else if (signs.page === 3) {
      reverse();
      animate(0.99);
      // 0.99 was trial n error n i don't rly understand why it translates exactly a full page backwards except maybe bc 0.99 * var would give us var - 0.var which is essentially a full animation cycle when var is transX, and as a decimal makes new animation value less than current position so brings page back instead of forward like in animate(1)
    }
  }, false);

  // _*_*_*_*_*_*_*_*_| Pg. 1 PEOPLE |_*_*_*_*_*_*_*_*_*_

  let ppl = {
    cont: document.querySelector('.ppl-cont'),
    picker: ['julie', 'spike'],
    // names of the little ppl, so they can be subbed into img src
    chrs: new Array(6),
    no: 0,
    noEle: document.querySelector('.ppl-no'),
    draw() {
      while (this.cont.lastChild) {
        this.cont.lastChild.remove();
      }
      for (let i = 0; i < 6; i++) {
        this.chrs[i] = new Image(43, 139);
        this.chrs[i].src = `../img/${this.picker[i%2]}.png`;
        poke(this.chrs[i]);
        glow(this.chrs[i]);
        this.cont.appendChild(this.chrs[i]);
      }
    }
  };

  function poke(el) {
    el.addEventListener('click', function() {
      if (this.src.includes('inblack')) {
        ppl.no--;
        // lucky that the names r the same length!
        this.src = this.attributes.src.nodeValue.slice(0, 16) + this.attributes.src.nodeValue.slice(23);
        if (!ppl.no && !traffic.trf[0].classList.contains('hide')) {
          traffic.lightChange(traffic.trf);
        }
      } else {
        ppl.no++;
        this.src =  this.attributes.src.nodeValue.slice(0, 16) + 'inblack.png';
        if (traffic.trf[0].classList.contains('hide')) {
          traffic.lightChange(traffic.trf);
        }
      }
      ppl.noEle.value = ppl.no;
    }, false);
  }

  $(ppl.noEle).change(function() {
    valiPpl();
  });

  function valiPpl() {
    let go = traffic.rp[0].classList.contains('hide');
    $(ppl.noEle).parsley().validate();
    if (!$(ppl.noEle).parsley().isValid()) {
      if (!go) {
        traffic.lightChange(traffic.trf);
        // interesting that the argument here doesn't seem strictly necessary?
      }
      if (ppl.noEle.valueAsNumber > 6) {
        document.querySelector('.ppl-msg').textContent = "Sorry! Rentals fit up to 6 people per vechicle";
      } else {
        document.querySelector('.ppl-msg').textContent = "Cannot rent a car for nobody! Please select at least 1 person";
        ppl.chrs.forEach(x => {
          if (x.src.includes('inblack')) {
            x.src = x.attributes.src.nodeValue.slice(0, 12) + x.attributes.src.nodeValue.slice(19);
          }
        });
      }
      ppl.no = ppl.noEle.valueAsNumber;
    } else {
      if (go) {
        traffic.lightChange(traffic.trf);
      }
      coordinate();
      ppl.no = ppl.noEle.valueAsNumber;
    }
  }

  function coordinate() {
    let diff = 0;
    let chsCh = [true, true, true, true, true, true];
    // for finding index of ppl who need a wardrobe change
    ppl.chrs.forEach(x => {
      if (x.src.includes('inblack')) {
        chsCh[ppl.chrs.indexOf(x)] = false;
        // now we know who to skip
        diff++;
      }
    });
    diff = ppl.noEle.valueAsNumber - diff;
    // and how far off the user inp is from clicked ppl
    if (diff > 0) {
      // ie. if inp field going up
      for (let i = 0; i < diff; i++) {
        let b = chsCh.indexOf(chsCh.find(x => x === true));
        // changes first person not in black to selected
        ppl.chrs[b].src = ppl.chrs[b].src =  ppl.chrs[b].attributes.src.nodeValue.slice(0, 12) + 'inblack.png';
        chsCh[b] = false;
      }
    } else if (diff < 0){
      for (let i = 0; i < Math.abs(diff); i++) {
        let b = chsCh.indexOf(chsCh.find(x => x === false));
        ppl.chrs[b].src = ppl.chrs[b].attributes.src.nodeValue.slice(0, 12) + ppl.chrs[b].attributes.src.nodeValue.slice(19);
        chsCh[b] = true;
      }
    }
  }

  // _*_*_*_*_*_*_*_*_| Pg. 2 CALENDAR |_*_*_*_*_*_*_*_*_*_

  const picker = new Litepicker({
    element: document.querySelector('.calendar'),
    startDate: new Date(),
    inlineMode: true,
    autoRefresh: true,
    autoApply: true
  });

  let date = {
    cont: document.querySelector('.date-cont'),
    // inst[0] for default day (today), [1] to be for the end of date range
    inst: [new Date(), new Date()],
    // ms in a day
    msDays: 84600000,
    txtEle: document.querySelector('.human-form-day'),
    // to present date in a sensible format
    noEle: document.querySelector('.day-no'),
    humanFriendly(d) {
      return d.toDateString().slice(0, -4); },
    init() {
      picker.ui.classList.add('block', 'inline');
      this.cont.style.left = `${init.w}px`;
      this.txtEle.textContent = `${this.humanFriendly(this.inst[0])} until ${this.humanFriendly(this.inst[1])}`;
      $('.litepicker').click(function() {
        valiDate();
      });
    },
    get dayDiff() {
      return Math.floor(Math.abs(this.inst[1]-this.inst[0])/this.msDays)+1; }
  };

  date.noEle.addEventListener('click', function(e) {
    let inpMS = date.inst[0].getTime() +
    Math.floor(date.msDays * date.noEle.valueAsNumber) - date.msDays;
    // highlighting the daterange for input in the lil up n down box
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
    // highlighting daterange for picked pickled picker dates
    picker.setDateRange(date.inst[0], date.inst[1]);
    // letting input box reflect that
    date.noEle.value = `${date.dayDiff}`;
    date.txtEle.textContent = `${date.humanFriendly(date.inst[0])} until ${date.humanFriendly(date.inst[1])}`;
  }

  $('.day-no').change(function() {
    valiDate();
  });

  function valiDate() {
    let go = traffic.rp[0].classList.contains('hide');
    $('.day-no').parsley().validate();
    if (!$('.day-no').parsley().isValid()) {
      if (!go) {
        traffic.lightChange(traffic.rp);
      }
      if (!date.noEle.valueAsNumber) {
        date.txtEle.textContent = 'You might want it for at least a day';
      } else if (date.noEle.valueAsNumber >= 15) {
        date.txtEle.textContent = 'Sorry! Rentals only have up to 15 days';
      }
    } else {
      if (go) {
        traffic.lightChange(traffic.rp);
      }
    }
  }

  // _*_*_*_*_*_*_*_*_| Pg. 3 CARS GAS & MAPS |_*_*_*_*_*_*_*_*_*_

  function chosen1() {
    for (let i = 0; i < omni.keyz.length; i++) {
      // for each vechicle, as repped by index in omni.val props, check inputted ppl no is within range, n then the same for days, and for the index that passes the test, push that (i as .keyz index === car) to options arr
      if (ppl.no >= omni.vals.ppl[i][0] && ppl.no <= omni.vals.ppl[i][1] && date.noEle.valueAsNumber >= omni.vals.days[i][0] && date.noEle.valueAsNumber <= omni.vals.days[i][1]) {
        mechanic.opts.push(omni.keyz[i]);
      }
    }
  }

  let mechanic = {
    txt: document.querySelector('.v-cont'),
    caryard: document.querySelector('.vechs'),
    opts: [],
    anicar: init.w * 2,
    names: ['Motorbike', 'Small car', 'Large car', 'Campervan'],
    init() {
      this.txt.style.left = `${init.w * 2}px`;
    },
    present() {
      // since default car alr on screen, a. don't wanna add it again and b. can drive offscreen into the abyss
      if (this.opts.includes('car')) {
        this.opts = this.opts.filter(x => x !== 'car');
        car.thingItself.addEventListener('click', carChat, false);
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
        glow(c);
        this.caryard.appendChild(c);
        // carChat.addInfo();
        c.addEventListener('click', carChat, false);
      });
    }
  };

  let geo = {
    cont: document.querySelector('.map-cont'),
    clkd:
    init() {
      this.cont.style.left = `${init.w * 2}px`;
    }
  };

  let gas = {
    c: 0,
    btnTxt: ['Calculate gas costs', 'Choose another vechicle'],
    cont: document.querySelector('.v-info'),
    txt: document.querySelector('.v-txt-ch'),
    mb: document.querySelector('.mb'),
    irre: [...mechanic.caryard.children, car.thingItself]
  };

  const gasPedal = [
    anime({
      targets: geo.cont,
      translateX: -init.w * 1.6,
      easing: 'linear',
      // direction: 'normal',
      duration: 1000,
      autoplay: false
    }),
    anime({
      targets: gas.mb,
      translateX: init.w / 1.6,
      easing: 'easeOutExpo',
      duration: 1800,
      autoplay: false
    })
  ];

  function carChat() {
    let k = omni.keyz.indexOf(this.classList[1]);
    let v = this;
    gas.irre = [...mechanic.caryard.children, car.thingItself].filter(x => x !== v);
    const undefineUrself = anime({
      targets: gas.irre,
      translateX: init.w + 1000,
      easing: 'easeOutExpo',
      duration: 2600,
      autoplay: false
    });

    gasPedal.push(undefineUrself);

    const inf = [document.createElement('p'), document.createElement('button')];
    if (gas.cont.classList.contains('hide')) {
      gas.cont.classList.remove('hide');
    }
    inf[1].classList.add('btn', 'block');
    inf[1].textContent = gas.btnTxt[gas.c % 2];
    gas.txt.textContent = mechanic.names[k];
    inf[0].textContent += `$${omni.vals.coin[k] * date.noEle.valueAsNumber} for your ${date.noEle.valueAsNumber} days away`;
    gas.txt.append(...inf);
    inf[1].addEventListener('click', function() {
      gas.c++;
      cartograph(...gasPedal);
      inf[1].textContent = gas.btnTxt[gas.c % 2];
    }, false);
  }

  // _*_*_*_*_*_*_*_*_| Pg. 3 MAP & GAS |_*_*_*_*_*_*_*_*_*_

  mapboxgl.accessToken = 'pk.eyJ1IjoibGFuYWxkZXIiLCJhIjoiY2tweGlqd2RmMWVyajJ2b2lrejYzbDZ5diJ9.ELtetZkKKBOunIgDPByWYQ';

  var map = new mapboxgl.Map({
    container: document.querySelector('.map'),
    style: 'mapbox://styles/mapbox/streets-v11',
    // center: [167.33695575335665, -41.25361608045145],
    center: [174.74178362117001, -41.079950115189185],
    zoom: 5
  });

  function cartograph(x) {

    // if (!v.classList.contains('mb')) {
    //   anis = [gasPedal[0]];
    // }

    // gas.irre = [...mechanic.caryard.children, car.thingItself].filter(x => x !== v);




    // anis.push(undefineUrself);
    gasPedal.forEach(x => {
      x.play();
      x.finished.then(() => {
        x.reverse();
      });
      if (!gas.c % 2 && x.completed()) {
        // x.finished.then(() => {
          x.play();
        // });
      }
      console.log(x);
    });

    // gasPedal[0].play();
    // gasPedal[0].finished.then(() => {
    //   gasPedal[0].reverse();
    // });
    // if (!gas.c % 2) {
    //   gasPedal[0].play();
    // }
  }



  function gasC(d) {
    distCont.textContent = '';
    // this func is called from last section of code which handles the map / turf.length stuff; d is distance from points
    let ind = omni.keyz.indexOf(geo.clkd.classList[1]);
    let gL = Math.round((d / 100) * omni.vals.gas[ind]);
    let lcn = mechanic.names[ind].charAt(0).toLowerCase();
    distCont.textContent += `A ${lcn + mechanic.names[ind].substring(1)} will use ${gL} litres of gas for this ${d}km long journey`;
  }

  // _*_*_*_*_*_*_*_*_| HANDY DANDY FUNCS |_*_*_*_*_*_*_*_*_*_

  function animate(dirc) {
    // dirc if 0 goes back (since transX becomes 0 having been times'd by it, ie. og. pos), if 1 forward
    if (dirc === 1) {
      signs.page++;
    } else {
      signs.page--;
    }
    anime({
      targets: car.thingItself,
      translateX: (80 * dirc ) * (signs.page),
      easing: 'easeOutExpo',
      duration: 3000
    });
    anime({
      targets: inpBits,
      translateX: dirc * (-((init.w / 1.1) * (signs.page - 1) + ((signs.page - 1) * 120))),
      // don't have a clue as to why those numbers work
      easing: 'linear',
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
    anime({
      targets: [signs, traffic],
      anisign: dirc * ((init.w / 1.3) * (signs.page - 1)),
      easing: 'easeOutExpo',
      duration: 1750,
      update: function() {
        signs.draw();
        traffic.draw(traffic.trf, 0);
        traffic.draw(traffic.rp, 1);
      }
    });
    let peas = [Array.from(signs.pS[0].children), Array.from(signs.pS[1].children)];
    // airbnb 4.4 says use spread over array.from however my good reason to not listen to that here is we need a 2d array, n spread flattens it all
    peas.forEach(x => {
      x.forEach(y => {
        y.textContent = signs.txt[peas.indexOf(x) + (signs.page % 2)][x.indexOf(y)];
        // the + signs.page % 2 is so that the text of signs reflects the back n forth nature of if they're prev or next at that page
      });
    });
    // }
    // signs.page++;
    // road.animark = 0;
  }

  function reverse() {
    anime({
      targets: mechanic.caryard,
      translateX: 0,
      easing: 'easeOutExpo',
      duration: 3000
    });
    window.setTimeout(function() {
      while (mechanic.caryard.lastChild) {
        mechanic.caryard.lastChild.remove();
      }
    }, 1500);
    window.clearTimeout();
    mechanic.opts = [];
    if (car.thingItself.classList.contains('hide')) {
      car.thingItself.classList.remove('hide');
      anime({
        targets: car.thingItself,
        translateX: init.w - 1000,
        easing: 'easeOutQuad',
        duration: 2600
      });
    }
  }

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
    ppl.draw();
    geo.init();
    signs.draw();
    traffic.draw(traffic.trf, 0);
    car.position();
    // grass.draw();
    date.init();
    mechanic.init();
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

  function glow(el) {
    'mouseover mouseleave'.split(' ').forEach(x => {
      el.addEventListener(x, function() {
        let guide = this.attributes.src.nodeValue;
        if (guide.includes('glow')) {
          this.src = `../img/${guide.slice(11)}`;
        } else {
          this.src = `../img/glow${guide.slice(7)}`;
          // glow is always 4 chrs long
        }
      });
    }, false);
  }

  // glow(car.thingItself);


  // poke(ppl.no);

  // // cache was annoying
  // date.noEle.value = 1;

  'load resize'.split(' ').forEach(function(e) {
    // rescale things on both page load n resize
    window.addEventListener(e, tailor, false);
  });

  // _*_*_*_*_*_*_*_*_| the code below is not mine !! -->
  //       https://docs.mapbox.com/mapbox-gl-js/example/measure/ |_*_*_*_*_*_*_*_*_*_

  var distCont = document.getElementById('distance');

  var geojson = {
    'type': 'FeatureCollection',
    'features': []
  };

  var linestring = {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': []
    }
  };

  map.on('load', function () {
    map.addSource('geojson', {
      'type': 'geojson',
      'data': geojson
  });

  // Add styles to the map
  map.addLayer({
    id: 'measure-points',
    type: 'circle',
    source: 'geojson',
    paint: {
      'circle-radius': 5,
      'circle-color': '#6F2931'
    },
    filter: ['in', '$type', 'Point']
  });

  map.addLayer({
    id: 'measure-lines',
    type: 'line',
    source: 'geojson',
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-color': '#6F2931',
      'line-width': 2.5
    },
    filter: ['in', '$type', 'LineString']
  });

  map.on('click', function (e) {
      var features = map.queryRenderedFeatures(e.point, {
        layers: ['measure-points']
      });
      // Remove the linestring from the group
      // So we can redraw it based on the points collection
      if (geojson.features.length > 1) geojson.features.pop();
      // Clear the Distance container to populate it with a new value
      // distCont.innerHTML = '';
      // If a feature was clicked, remove it from the map
      if (features.length) {
        var id = features[0].properties.id;
        geojson.features = geojson.features.filter(function (point) {
          return point.properties.id !== id;
        });
      } else {
        var point = {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [e.lngLat.lng, e.lngLat.lat]
          },
          'properties': {
            'id': String(new Date().getTime())
          }
        };
      geojson.features.push(point);
    }
    if (geojson.features.length > 1) {
      linestring.geometry.coordinates = geojson.features.map(
        function (point) {
          return point.geometry.coordinates;
        }
      );
      geojson.features.push(linestring);
      // Populate the distanceContainer with total distance
      // var value = document.createElement('p');
      // distCont.textContent = 'Total distance: ' + turf.length(linestring).toLocaleString() + 'km';

      gasC(turf.length(linestring).toLocaleString());

        // distCont.appendChild(value);
      }
      map.getSource('geojson').setData(geojson);
    });
  });

  map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ['measure-points']
    });
    // UI indicator for clicking/hovering a point on the map
    map.getCanvas().style.cursor = features.length ? 'pointer' : 'crosshair';
  });

}());
