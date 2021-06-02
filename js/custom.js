(function () {

  var dm = [];

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  function initDim() {
    dm = [window.innerWidth, window.innerHeight];
    document.body.style.width = dm[0]+'px';
    document.body.style.height = dm[1]+'px';
    canvas.style.width = dm[0]+'px';
    canvas.style.height = dm[1]+'px';
    roadscale();
  }

  ctx.beginPath();
  ctx.fillStyle = 'black';

  window.addEventListener('load', function() {
    initDim();
  })

  function roadscale() {
    //getting some nice ratios or whatever
    let frac = Math.floor(dm[1]/5);
    console.log(0, dm[1]-Math.floor(dm[1]/5), dm[0], Math.floor(dm[1]/5));
    ctx.fillRect(0, dm[1]-frac, dm[0], frac);
  }

}());
