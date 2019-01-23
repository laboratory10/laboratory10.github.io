var svg = document.getElementById("jumbotronSvg");
var pixels = [];
var i = 0;
var j;
var k;
for (j=0; j<17; j++) {
  for (k=0; k<41; k++) {
    pixels[i] = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    pixels[i].setAttributeNS(null, "x", "50%");
    pixels[i].setAttributeNS(null, "y", "50%");
    pixels[i].setAttributeNS(null, "height", "30");
    pixels[i].setAttributeNS(null, "width", "30");
    if (j%2 == 0) {
      pixels[i].setAttributeNS(null, "transform", "translate(" + (-635 + k*31) + ", " + (-263 + j*31) + ")");
    } else {
      pixels[i].setAttributeNS(null, "transform", "translate(" + (-650 + k*31) + ", " + (-263 + j*31) + ")");
    }
    switch (k) {
      case 0:
      case 40:
        pixels[i].setAttributeNS(null, "opacity", "0.1");
        break;
      case 1:
      case 39:
        pixels[i].setAttributeNS(null, "opacity", "0.2");
        break;
      case 2:
      case 38:
        pixels[i].setAttributeNS(null, "opacity", "0.5");
        break;
      case 3:
      case 37:
        pixels[i].setAttributeNS(null, "opacity", "0.8");
        break;
    }

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
        animation = document.createElementNS("http://www.w3.org/2000/svg", "animate");

        color = Math.floor(Math.random()*3 + 1);
        switch (color) {
          case 1:
            pixels[i].setAttributeNS(null, "fill", "rgb(0,255,0)");
            animation.setAttributeNS(null, "values", "rgb(0,255,0);rgb(0,255,255);rgb(0,0,255);rgb(0,255,255);rgb(0,255,0)");
            break;
          case 2:
            pixels[i].setAttributeNS(null, "fill", "rgb(0,255,255)");
            animation.setAttributeNS(null, "values", "rgb(0,255,255);rgb(0,0,255);rgb(0,255,255);rgb(0,255,0);rgb(0,255,255)");
            break;
          case 3:
            pixels[i].setAttributeNS(null, "fill", "rgb(0,0,255)");
            animation.setAttributeNS(null, "values", "rgb(0,0,255);rgb(0,255,255);rgb(0,255,0);rgb(0,255,255);rgb(0,0,255)");
            break;
        }
        animation.setAttributeNS(null, "attributeName", "fill");
        animation.setAttributeNS(null, "dur", Math.round(Math.random()*20) + 10);
        animation.setAttributeNS(null, "repeatCount", "indefinite");
        pixels[i].appendChild(animation);
        break;
      default:
        pixels[i].setAttributeNS(null, "fill", randomBackground());
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

function randomBackground () {
  let number = Math.floor(Math.random() * 10) + 25;
  return "rgb(" + number + "," + number + "," + number + ")";
}
