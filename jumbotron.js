
var svg = document.getElementById("jumbotronSvg");
var pixels = [];
var i = 0;
var j;
var k;
for (j=0; j<17; j++) {
  for (k=0; k<41; k++) {
    pixels[i] = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    pixels[i].setAttributeNS(null, "x", "50%");
    pixels[i].setAttributeNS(null, "y", "50%");
    pixels[i].setAttributeNS(null, "height", "30");
    pixels[i].setAttributeNS(null, "width", "30");
    pixels[i].setAttributeNS(null, "fill", "#ffffff");
    if (j%2 == 0) {
      pixels[i].setAttributeNS(null, "transform", "translate(" + (-635 + k*31) + ", " + (-263 + j*31) + ")");
    } else {
      pixels[i].setAttributeNS(null, "transform", "translate(" + (-650 + k*31) + ", " + (-263 + j*31) + ")");
    }
    svg.appendChild(pixels[i]);
    i=i+1;
  }
}

topText = document.createElementNS("http://www.w3.org/2000/svg", 'text');
topText.setAttributeNS(null, "text-anchor", "middle");
topText.setAttributeNS(null, "x", "50%");
topText.setAttributeNS(null, "y", "15%");
topText.setAttributeNS(null, "fill", "white");
topText.setAttributeNS(null, "font-size", "36");
topText.setAttributeNS(null, "font-weight", "bold");
topText.setAttributeNS(null, "font-family", "arial");
svg.appendChild(topText);
topText.innerHTML = "DISCOVER APPS";

botText = document.createElementNS("http://www.w3.org/2000/svg", 'text');
botText.setAttributeNS(null, "text-anchor", "middle");
botText.setAttributeNS(null, "x", "50%");
botText.setAttributeNS(null, "y", "90%");
botText.setAttributeNS(null, "fill", "white");
botText.setAttributeNS(null, "font-size", "36");
botText.setAttributeNS(null, "font-weight", "bold");
botText.setAttributeNS(null, "font-family", "arial");
svg.appendChild(botText);
botText.innerHTML = "INSPIRED BY SCIENCE AND TECHNOLOGY";

for (i=0; i<pixels.length; i++) {
  switch (i) {
    case 182:
    case 183:
    case 184:
    case 185:
    case 186:
    case 224:
    case 227:
    case 265:
    case 267:
    case 306:
    case 309:
    case 346:
    case 350:
    case 387:
    case 392:
    case 427:
    case 433:
    case 468:
    case 475:
    case 508:
    case 509:
    case 510:
    case 511:
    case 512:
    case 513:
    case 514:
    case 515:
    case 516:
      pixels[i].style.fill = randomColor();
      break;
    default:
      pixels[i].style.fill = randomBackground();
  }
}

setInterval(function () {life();}, 100);

function life () {
  var i;
  for (i=0; i<pixels.length; i++) {
    switch (i) {
      case 182:
      case 183:
      case 184:
      case 185:
      case 186:
      case 224:
      case 227:
      case 265:
      case 267:
      case 306:
      case 309:
      case 346:
      case 350:
      case 387:
      case 392:
      case 427:
      case 433:
      case 468:
      case 475:
      case 508:
      case 509:
      case 510:
      case 511:
      case 512:
      case 513:
      case 514:
      case 515:
      case 516:
        rgbVals = pixels[i].style.fill.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        if (rgbVals) {
          pixels[i].style.fill = advanceColor(Number(rgbVals[1]),Number(rgbVals[2]),Number(rgbVals[3]));
        }
        break;
      default:
        pixels[i].style.fill = morphBackground ((pixels[i].style.fill.substring(4,6)));
    }
  }
}

function randomBackground () {
  let number = Math.floor(Math.random() * 5) + 20;
  return "rgb(" + number + "," + number + "," + number + ")";
}

function morphBackground (startColor) {
  var factor = Math.floor(Math.random()) + 1;
  var direction = Math.round(Math.random());
  if (direction == 0) {
    var newColor = startColor - factor;
  } else {
    var newColor = startColor + factor;
  }
  if (newColor > 25) {
    newColor = 25;
  } else if (newColor < 15) {
    newColor = 15;
  }
  return "rgb(" + newColor + "," + newColor + "," + newColor + ")";
}

function randomColor () {
  //one of the r/g/b components must be zero
  var zeroColor = Math.floor(Math.random() * 3) + 1;
  //another must be 255
  var fullColor = Math.floor(Math.random() * 2) + 1;
  var r;
  var g;
  var b;
  switch (zeroColor) {
    case 1:
      r = 0;
      if (fullColor==1){
        g = 255;
        b = Math.floor(Math.random() * 256);
      } else{
        g = Math.floor(Math.random() * 256);
        b = 255;
      }
      break;
    case 2:
      g = 0;
      if (fullColor==1){
        r = 255;
        b = Math.floor(Math.random() * 256);
      } else{
        r = Math.floor(Math.random() * 256);
        b = 255;
      }
      break;
    case 3:
      b = 0;
      if (fullColor==1){
        r = 255;
        g = Math.floor(Math.random() * 256);
      } else{
        r = Math.floor(Math.random() * 256);
        g = 255;
      }
      break;
  }
  return "rgb(" + r + "," + g + "," + b + ")";
}

function advanceColor (oldR, oldG, oldB) {
  var factor = Math.floor(Math.random() * 25) + 5;
  var r = oldR;
  var g = oldG;
  var b = oldB;
  //implement color change algorithm
  //first, cover cases where one r/g/b value is transitioning
  if (oldR < 255 && oldR > 0) {
    if (oldG == 255) {
      //sub form r
      r = advanceRGB(r, 0, factor);
    } else if (oldB == 255) {
      //add to r
      r = advanceRGB(r, 1, factor);
    }
  }
  if (oldG < 255 && oldG > 0) {
    if (oldB == 255) {
      //sub from g
      g = advanceRGB(g, 0, factor);
    } else if (oldR == 255) {
      //add to g
      g = advanceRGB(g, 1, factor);
    }
  }
  if (oldB < 255 && oldB > 0) {
    if (oldR == 255) {
      //sub from b
      b = advanceRGB(b, 0, factor);
    } else if (oldG == 255) {
      //add to b
      b = advanceRGB(b, 1, factor);
    }
  }
  //then cover cases where two are zero
  if (oldR == 0 && oldG == 0) {
    //add to r
    r = advanceRGB(r, 1, factor);
  }
  if (oldR == 0 && oldB == 0) {
    //add to b
    b = advanceRGB(b, 1, factor);
  }
  if (oldG == 0 && oldB == 0) {
    //add to g
    g = advanceRGB(g, 1, factor);
  }
  //finally, cover cases where two are 255
  if (oldR == 255 && oldG == 255) {
    //sub from r
    r = advanceRGB(r, 0, factor);
  }
  if (oldR == 255 && oldB == 255) {
    //sub from b
    b = advanceRGB(b, 0, factor);
  }
  if (oldG == 255 && oldB == 255) {
    //sub from g
    g = advanceRGB(g, 0, factor);
  }
  return "rgb(" + r + "," + g + "," + b + ")";
}

function advanceRGB(oldValue, direction, factor) {
  var newValue;
  if (direction == 0) {
    newValue = oldValue - factor;
  } else {
    newValue = oldValue + factor;
  }
  if (newValue > 255) {
    newValue = 255;
  } else if (newValue < 0) {
    newValue = 0;
  }
  return newValue;
}
