import Litepicker from 'litepicker';

import $ from 'jquery';
  window.jQuery = $;
  window.$ = $;


(function () {

  const anime = require('animejs/lib/anime.js');
  const parsley = require('parsleyjs/dist/parsley.min.js');

  // obj to contain the transport dataset
  const omni = {
    keyz: ['mb', 'mn', 'car', 'cpv'],
    // index of .keyz is the key to match below values with vechicle
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
  // so that one canvas px = one physical px, otherwise can get blurry on big screens

  const mainEles = Array.from(document.querySelectorAll('.moving-blocks'));
  // all the input-taking / info-giving elements so can carousel them round for the multi-page-site illusion

  const init = {
    get w() { return window.innerWidth; },
    get h() { return window.innerHeight; },
    // getter used so that page is sorta reponsive w/o css, & so coords of elements are relative to user and not actual page width, important distinction for a S.P.A.
    setScale() {
      document.body.style.width = `${this.w}px`;
      document.body.style.height = `${this.h}px`;
      // style used on html els and not for canvas, since canvas css doesn't determine actual available coords -- actual obj size defaults to 300x150 n if only css is changed it just scales from that n looks rly bad
      canvas.width = this.w;
      canvas.height = this.h;
      road.draw();
    }
  };

  // _*_*_*_*_*_*_*_*_| INITIAL OBJS |_*_*_*_*_*_*_*_*_*_

  const road = {
    animark: 0,
    // this is for the anime func, the value is changed 2 whatever it's set at over there, so equivalent 2 a translateX value (which can't simply b used bc of canvas, don't wanna move the whole thing but only some of its drawings)
    get y() { return init.h - inProptn(1, 7) * 1.5; },
    get linY() { return this.y + (inProptn(1, 7) / 3); },
    get linH() { return inProptn(1, 7) / 12; },
    // road's h always inProptn(1, 7) and the line w inProptn(0, 9), getters above just 2 make code more marginally more readable

    draw() {
      // drawing curbs first
      const shades = ['#9ca297', '#b1bab0'];
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

      this.markings();
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

  const car = {
    thingItself: null,

    position() {
      if (document.querySelector('.car') == null) {
        // not something 2 repeat on resize
        const musty = new Image();
        musty.src = 'img/car.png';
        document.getElementsByTagName('body')[0].appendChild(musty);
        this.thingItself = musty;
        this.thingItself.classList.add('v', 'car');
      }
      this.thingItself.style.bottom = `${inProptn(1, 7) * 1.1}px`;
      this.thingItself.style.zIndex = 5;

      grass.draw();
    },

    behindMn(w) {
      // sometimes (later on pg. 3) when car drives off it drives on and over the mini, which looks straight up silly, but have 2 account for events only working on positive zInd n animation seemingly only listening to zInd as either positive or negative and none of the finer details
      w ? this.thingItself.style.zIndex = '5' : this.thingItself.style.zIndex = '-3';
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
        this.lawnmower.forEach( x => {
          while (x.lastChild) {
            x.lastChild.remove();
          }
        }); }

      for (let i = 0; i < 4; i++) {
        // 4 lines of grass
        this.soil[i] = document.querySelector(`.grass${i}`);
        this.soil[i].style.width = `${this.amt * init.w}px`;

        for (let j = 0; j < this.amt; j++) {
          this.roots[j] = new Image(50, 50);
          this.roots[j].src = 'img/grs.png';
          this.soil[i].appendChild(this.roots[j]);
        }
      }
      this.soil.forEach( x => { x.style.bottom = `${this.soil.indexOf(x) * 30 - 50}px`; });
      // all lines just slightly on top of each other n under the road, except for the last
      this.soil[3].style.top = `${road.y - 50 - (road.linH / 3)}px`;
    }
  };

  // _*_*_*_*_*_*_*_*_| ROAD (page) SIGNS |_*_*_*_*_*_*_*_*_*_

  const signs = {
    page: 1,
    pS: [document.querySelector('.page-sign-1'), document.querySelector('.page-sign-2')],
    anisign: 0,
    signPos: [init.w - inProptn(0, 6), init.w * 2 - inProptn(0, 3)],
    pos: {
      // for positioning, heaped here so don't have 2 look at it n also maybe helps performance only calc'ing once?
      x: [init.w - inProptn(0, 6), init.w * 2 - inProptn(0, 3)],
      h: inProptn(1, 5),
      w: inProptn(0, 150),
      sT: road.y - inProptn(1, 6) - (7.4 * init.h / 100),
      tX: ((7.4 * init.h / 100) * 1.9)
    },
    eraser: [[], [], [], []],
    // signpost drawings logged here so can be cleared (this.erase()) when they move (one per prev / next sign, last 2 for traffic light)
    get txt() {
      return [['← Back', `To Q. ${this.page - 1} of 3`], [`On Q. ${this.page} of 3`, 'Next →']]; },
    // get just used so can reference this.page, prop defs can't ref each other bc they're all read in one initialising sweep instead of called after?

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

  const traffic = {
    trf: [document.querySelector('.grntrf'), document.querySelector('.redtrf')],
    rp: [0, 0],
    anisign: 0,
    get onOff() { return this.trf[0].classList.contains('hide'); },

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
        this.rp[i] = $(this.trf[i]).clone()[0];
        // jQuery v handy for this since img annoyingly isn't a node or something (.cloneNode), tho clones the whole thing as a new obj, so [0] just there to get the img
        document.querySelector('.traffic').append(this.rp[i]);
      }
      this.lightChange(this.rp);
    }
  };

  signs.pS[0].addEventListener('click', function() {
    // since signs 1 n 2 are not always next n prev respectively, some conditions for how they act:
    if (signs.page === 1 && valiPpl()) {
      if (!traffic.rp[0]) {
        traffic.clone();
      }
      animate(1);
    } else if (signs.page === 2) {
      // animate back a page on pg.2 since sign 0 now prev
      animate(0);
    }
  }, false);

  signs.pS[1].addEventListener('click', function() {
    if (signs.page === 2 && traffic.rp[1].classList.contains('hide')) {
      glow(car.thingItself);

      if (date.eleAsNo > 10 && ppl.no < 2) {
        mechanic.txt.textContent = errorTxt.vech[0];
      }
      animate(1);
    } else if (signs.page === 3) {
      reverse();
      animate(0.99);
      // 0.99 was trial n error n i don't rly understand why it translates exactly a full page backwards except maybe bc 0.99 * var would give us var - 0.var which is essentially a full animation cycle when var is transX, and as a decimal makes new animation value less than current position so brings page back instead of forward like in animate(1) (later i discover animejs' .reverse() method, but as page animations are dynamic there are philosophically elusive issues in returning to a dynamically changing starting point)
      gas.cont.classList.toggle('hide');
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
    get eleAsNo() { return this.noEle.valueAsNumber; },
    // i like getter i wonder if their reason for existing isn't entirely redundant, lets u access vars as they are dynamically n not bind them to one value at one point in time (if this can't also b done with normal props, idk i haven't tested it here)

    draw() {
      while (this.cont.lastChild) {
        this.cont.lastChild.remove();
      }
      for (let i = 0; i < 6; i++) {
        this.chrs[i] = new Image(43, 139);
        this.chrs[i].src = `img/${this.picker[i%2]}.png`;
        poke(this.chrs[i]);
        glow(this.chrs[i]);
        this.cont.appendChild(this.chrs[i]);
      }
    }
  };

  function poke(el) {
    el.addEventListener('click', function() {
      let nodeSrc = this.attributes.src.nodeValue;
      if (this.src.includes('inblack')) {
        ppl.no--;
        // lucky that the names r the same length!
        this.src = nodeSrc.slice(0, 13) + nodeSrc.slice(20);

        if (!ppl.no && !traffic.onOff) {
          traffic.lightChange(traffic.trf);
        }
      } else {
        ppl.no++;
        this.src = nodeSrc.slice(0, 13) + 'inblack.png';

        if (traffic.onOff) {
          traffic.lightChange(traffic.trf);
        }
      }
      ppl.noEle.value = ppl.no;
      valiPpl();
    }, false);
  }

  $(ppl.noEle).change(function() {
    valiPpl();
  });

  function valiPpl() {
    let msg = document.querySelector('.ppl-msg').childNodes[2];
    $(ppl.noEle).parsley().validate();

    if (!$(ppl.noEle).parsley().isValid()) {

      if (!traffic.onOff) {
        traffic.lightChange(traffic.trf);
      }

      if (ppl.eleAsNo > 6) {
        msg.textContent = errorTxt.ppl[1];
      } else {
        msg.textContent = errorTxt.ppl[0];
        // ensuring all ppl are unselected, since only want to coordinate() when input is valid; also prevents user inp box going below 0 when coord is called
        ppl.chrs.forEach(x => {
          let nodeSrc = x.attributes.src.nodeValue;
          if (x.src.includes('inblack')) {
            x.src = nodeSrc.slice(0, 9) + nodeSrc.slice(16);
          }
        });
      }
      ppl.no = ppl.eleAsNo;
      // returns on behalf of sign click listeners, only animate forward when true
      return false;
    } else {
      msg.textContent = errorTxt.ppl[2];
      if (traffic.onOff) {
        traffic.lightChange(traffic.trf);
      }

      coordinate();
      ppl.no = ppl.eleAsNo;
      return true;
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
    diff = ppl.eleAsNo - diff;
    // and how far off the user inp is from clicked ppl

    if (diff > 0) {
      // ie. if inp field going up
      for (let i = 0; i < diff; i++) {
        const b = chsCh.indexOf(chsCh.find(x => x === true));
        let nodeSrc = ppl.chrs[b].attributes.src.nodeValue;
        // changes first person not in black to selected
        ppl.chrs[b].src = ppl.chrs[b].src = nodeSrc.slice(0, 9) + 'inblack.png';
        chsCh[b] = false;
      }
    } else if (diff < 0){
      for (let i = 0; i < Math.abs(diff); i++) {
        const b = chsCh.indexOf(chsCh.find(x => x === false));
        let nodeSrc = ppl.chrs[b].attributes.src.nodeValue;
        ppl.chrs[b].src = nodeSrc.slice(0, 9) + nodeSrc.slice(16);
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
    get eleAsNo() { return this.noEle.valueAsNumber; },

    humanFriendly(d) {
      return d.toDateString().slice(0, -4); },

    init() {
      // this.inst[1] = new Date(this.inst[0].getTime() + this.msDays);
      picker.ui.classList.add('block', 'inline');
      this.cont.style.left = `${init.w}px`;
      this.txtEle.textContent = `${this.humanFriendly(this.inst[0])} until ${this.humanFriendly(this.inst[1])}`;
      $('.litepicker').click(function() {
        valiDate();
      });
    }
  };

  date.noEle.addEventListener('click', function() {
    let inpMS = date.inst[0].getTime() + Math.floor(date.msDays * date.eleAsNo) - date.msDays;
    // highlighting the daterange for input in the lil up n down box
    picker.setDateRange(date.inst[0], new Date(inpMS));
  }, false);

  function datedealer() {
    const clkd = picker.getDate();
    date.inst[1] = clkd.dateInstance;
    date.inst.sort((x, y) => x.getTime() - y.getTime());
    // to ensure [1] is always the date > [0]
    let fd = new Date().toString().substring(0, 10);
    // new date will never quite b the same as new date made a minute ago so instead compare the more humanly accurate day of week month etc
    date.noEle.valueAsNumber = Math.round((date.inst[1].getTime() - date.inst[0].getTime()) / date.msDays);

    // this is to ensure that if picker date (1st click) is tomorrow / yesterday, today is included in day count, since today is never over as being the full 84600etc seconds just adding it and tomorrow in a manual + 1
    if (date.inst[1].getTime() - date.inst[0].getTime() >= date.msDays) {
      date.noEle.valueAsNumber += 1;
    }
    // highlighting daterange for picked pickled picker dates
    picker.setDateRange(date.inst[0], date.inst[1]);
    // letting input box reflect that
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

      if (date.eleAsNo === 0) {
        date.txtEle.textContent = errorTxt.date[0];
      } else if (date.eleAsNo >= 15) {
        date.txtEle.textContent = errorTxt.date[1];
      } else {
        date.txtEle.textContent = errorTxt.date[2];
      }
    } else {
      if (go) {
        traffic.lightChange(traffic.rp);
      }
    }
  }

  // _*_*_*_*_*_*_*_*_| Pg. 3 CARS GAS & MAPS |_*_*_*_*_*_*_*_*_*_

  mapboxgl.accessToken = 'pk.eyJ1IjoibGFuYWxkZXIiLCJhIjoiY2tweGlqd2RmMWVyajJ2b2lrejYzbDZ5diJ9.ELtetZkKKBOunIgDPByWYQ';

  var map = new mapboxgl.Map({
    container: document.querySelector('.map'),
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [174.74178362117001, -41.079950115189185],
    zoom: 4.5
  });

  function chosen1() {
    for (let i = 0; i < omni.keyz.length; i++) {
      // for each vechicle, as repped by index in omni.val props, check inputted ppl no is within range, n then the same for days, and for the index that passes the test, push that (i as .keyz index === car) to options arr
      if (ppl.no >= omni.vals.ppl[i][0] && ppl.no <= omni.vals.ppl[i][1] && date.eleAsNo >= omni.vals.days[i][0] && date.eleAsNo <= omni.vals.days[i][1]) {
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
        car.behindMn(1);
        this.opts = this.opts.filter(x => x !== 'car');
        car.thingItself.addEventListener('click', carChat, false);
      } else {
        car.behindMn(0);
        anime({
          targets: car.thingItself,
          translateX: init.w + 800,
          // extra 800 just for safety
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
        c.src = `img/${x}.png`;
        c.classList.add('v', `${x}`);
        c.style.right = `${-init.w}px`;
        glow(c);
        this.caryard.appendChild(c);
        c.addEventListener('click', carChat, false);
      });
    }
  };

  let geo = {
    cont: document.querySelector('.map-cont'),
    clkd: null,
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
    irre: [...mechanic.caryard.children, car.thingItself],
    av$: 2.329
  };

  const go = {
    sign: document.querySelector('.go'),
    txt: document.querySelector('.go-txt'),

    draw() {
      this.sign.style.left = `${init.w * 2.45}px`;
      this.sign.style.top = `${signs.pos.sT - ((13 * init.h) / 100)}px`;
      this.txt.textContent = 'Book →';
      this.txt.style.left = `${init.w * 2.45 + 53}px`;
      this.txt.style.top = `${signs.pos.sT - ((13 * init.h) / 100) + 93}px`;
      glow(this.sign);
    }
  };

  const gasPedal = [
    null,
    anime({
      targets: [geo.cont, go.sign, go.txt],
      translateX: -init.w * 1.6,
      easing: 'easeOutExpo',
      duration: 1800,
      autoplay: false
    })
  ];

  function carChat() {
    let k = omni.keyz.indexOf(this.classList[1]);
    const inf = [document.createElement('p'), document.createElement('button')];
    geo.clkd = this;
    gas.irre = [car.thingItself, ...mechanic.caryard.children].filter(x => x !== geo.clkd);
    // when parameters are t/f based conditionals can just be the argument!
    car.behindMn(this === car.thingItself && !gas.cont.classList.contains('hide'));

    gasPedal[0] = anime({
      targets: gas.irre,
      translateX: 1800,
      easing: 'linear',
      duration: 1300,
      autoplay: false,
      // when anim on cars done n they're back 2 og pos, make zInd of default car positive again
      changeComplete: function() {
        car.behindMn(gas.c % 2 - 1 && gasPedal[0].reversed && geo.clkd !== car.thingItself);
      }
    });

    if (gas.cont.classList.contains('hide')) {
      gas.cont.classList.toggle('hide');
    }

    inf[1].classList.add('btn', 'block');
    inf[1].textContent = gas.btnTxt[gas.c % 2];
    gas.txt.textContent = mechanic.names[k];
    inf[0].textContent += `$${omni.vals.coin[k] * date.eleAsNo} for your ${date.eleAsNo} days away`;
    gas.txt.append(...inf);


    inf[1].addEventListener('click', function() {
      resetLines();
      gas.c++;
      gasPedal.forEach(a => { cartograph(a); });
      inf[1].textContent = gas.btnTxt[gas.c % 2];
    }, false);
  }

  // 1st conditional actually for third run through of animation; so it plays, then reverses the dirc for second play when cars come back onscreen / map off, then! (between 2nd n 3rd click) animation is completed, and it restarts from og position n loops (i think, idk animations r kinda mysterious)
  function cartograph(x) {
    if (x.completed) {
      x.restart();
    }
    x.play();
    x.finished.then(() => {
      x.reverse();
    });
  }

  function gasC(d) {
    distCont.textContent = '';
    // this func is called from last section of code which handles the map / turf.length stuff; d is distance from points
    d = Math.round(d);
    let ind = omni.keyz.indexOf(geo.clkd.classList[1]);
    let gL = Math.round(d / 100 * omni.vals.gas[ind]);
    let lcn = mechanic.names[ind].charAt(0).toLowerCase();

    distCont.textContent += `A ${lcn + mechanic.names[ind].substring(1)} will use ${gL} litres of gas for this ${d}km long journey, which comes to roughly $${Math.round(gL * gas.av$)} for fuel`;
    gas.txt.firstElementChild.textContent = `$${Math.round((omni.vals.coin[ind] * date.eleAsNo) + (gL * gas.av$))} in total`;
  }

  function resetLines() {
    distCont.textContent = 'Click on the map to draw your route & get an estimate for how much gas will be used';
    geojson = {
      'type': 'FeatureCollection',
      'features': []
    };
    linestring = {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': []
      }
    };
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
      targets: mainEles,
      translateX: dirc * (-((init.w / 1.1) * (signs.page - 1) + ((signs.page - 1) * 120))),
      // idk why these numbers work
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
        translateX: dirc * ((20 / init.w) * 100 - init.w) - 200,
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

    const peas = [Array.from(signs.pS[0].children), Array.from(signs.pS[1].children)];
    // airbnb 4.4 says use spread over array.from however my good reason to not listen to that is we need a 2d array, n spread flattens it all
    for (let i = 0; i < 2; i++) {
      // first loop reps signs, second the 2 <p>s in them
      for (let y = 0; y < 2; y++) {
        // each sign <p> = the sign that it's in (i) and page we're at % 2 since sign alternates between next / prev on odd / even pages, and then! since there are 3 pages and only 2 signs, % 2 to loop around the array! it's like a 2d circle array, buzzy and then [y] reps what <p> to keep text in right pos
        peas[i][y].textContent = signs.txt[(i + signs.page % 2) % 2][y];
      }
    }
  }

  function reverse() {
    anime({
      targets: [mechanic.caryard, geo.cont, go.sign, go.txt],
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

  function tailor() {
    init.setScale();
    ppl.draw();
    car.position();
    date.init();
    geo.init();
    signs.draw();
    traffic.draw(traffic.trf, 0);
    go.draw();
    mechanic.init();
  }

  function inProptn(nu, de) {
    // f 4 width, since usually 0 in arr; t 4 h
    return !nu ? Math.ceil(Math.abs(init.w / de))
              : Math.ceil(Math.abs(init.h / de));
  }

  picker.ui.addEventListener('click', datedealer, false);

  function glow(el) {
    'mouseover mouseleave'.split(' ').forEach(x => {
      el.addEventListener(x, function() {
        let guide = this.attributes.src.nodeValue;
        if (guide.includes('glow')) {
          this.src = `img/${guide.slice(8)}`;
        } else {
          this.src = `img/glow${guide.slice(4)}`;
          // glow is always 4 chrs long
        }
      });
    }, false);
  }

  'load resize'.split(' ').forEach(function(e) {
    // rescale things on both page load n resize
    window.addEventListener(e, tailor, false);
  });

  const errorTxt = {
    ppl: ['Cannot rent a car for nobody! Please select at least 1 person', 'Very sorry, but our rentals can only fit up to 6 people per vechicle', 'Select how many people you will be travelling with:'],
    date: ['You might want it for at least a day', 'Sorry! Rentals only have up to 15 days', 'For how long will you need your rental?'],
    vech: ['Sorry! There are no available vechicles for your selections. Please go back and change your answers if you want to try again :)', 'These vechicles are well-suited for your holiday! Click on them for pricing & further info, or try going back and changing your answers to see other options']
  };

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
      gasC(turf.length(linestring));

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
