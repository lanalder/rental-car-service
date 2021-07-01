# Rental Car Match-Making Service
### In the service of Tourism New Zealand

A single-page website (S.P.A.) which determines the most suitable rental car for users' situations. To keep tourism alive and well in a plague-ridden era this website facilitates bookings and inspires leisure travel for kiwis.

HTML and CSS has been validated, and JS linted via gulp without errors (or, CSS has errors, but only from others' imported files and their use of psuedo-classes).

The [airbnb](https://github.com/airbnb/javascript) styleguide has been mostly adhered to, especially in its general preference of es6 syntax, and object and array conventions. Template literals are used over concatenation, and almost always destructuring syntax, and arrow functions, and single quotes.

But, sometimes spread isn't great for where the guide says to use it (like if you need a 2d array), and I'll take the mild risks of ++ / -- (neater / more concise). I also firmly reckon for-loops have their place alongside 'higher-order functions' like .findIndex() or Obj.keys(), such as in the code below:

```javascript
const peas = [];
signs.pS.forEach((x) => peas.push(x.children));

for (let i = 0; i < 2; i++) {
  for (let y = 0; y < 2; y++) {

    peas[i][y].textContent = signs.txt[(i + signs.page % 2) % 2][y];
  }
}
```
.forEach() could very well be used instead of the old-fashioned iterator, but since the index of the original value is needed to find index of the new, we would end up with two unnecessary .indexOf(), while this way i and y already *are* the required index. It's also a fair bit easier to see what's going on.

Production tools & libraries / plugins / APIs:
* gulp
* eslint (although mainly just gulp's linter)
* jQuery
* [litepicker](https://github.com/wakirin/Litepicker)
* [animejs](https://github.com/juliangarnier/anime/)
* [parsley](https://parsleyjs.org/)
* Mapbox and turf/length
* [blocks.css](https://github.com/thesephist/blocks.css)

& an honourable mention to paint.net

Object literals have been used far more frequently than functions, and in a only half successful attempt to cut down on CSS, DOM elements are more than not created / positioned relative to vp via JS itself. Half the graphics are actual images and the other half canvas-drawn, and there's not really any grand justification for this except that canvas is cool but not super great to animate, and drawing semi-realistic cars in code was a bit extra even for me.
