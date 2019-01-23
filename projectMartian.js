let mslLabel = document.getElementById("mslLabel");
let earthLabel = document.getElementById("earthLabel");

let marsEarthDistance = document.getElementById("marsEarthDistance");
let curiosityClock = document.getElementById("curiosityClock");
let curiositySol = document.getElementById("curiositySol");
let earthDate = document.getElementById("earthDate");
let earthClock = document.getElementById("earthClock");
let minuteArc = document.getElementById("minuteArc");
let hourArc = document.getElementById("hourArc");

let taiOffset = 37;
let lastTaiUpdate = "1 January 2017";

var weekArray = new Array(7);
weekArray[0] = "SUN";
weekArray[1] = "MON";
weekArray[2] = "TUE";
weekArray[3] = "WED";
weekArray[4] = "THU";
weekArray[5] = "FRI";
weekArray[6] = "SAT";

var monthArray = new Array(12);
monthArray[0] = "JAN";
monthArray[1] = "FEB";
monthArray[2] = "MAR";
monthArray[3] = "APR";
monthArray[4] = "MAY";
monthArray[5] = "JUN";
monthArray[6] = "JUL";
monthArray[7] = "AUG";
monthArray[8] = "SEPT";
monthArray[9] = "OCT";
monthArray[10] = "NOV";
monthArray[11] = "DEC";

function inside24(n) {
  if (n < 0) {
    n += 24;
  } else if (n >= 24) {
    n -= 24;
  }
  return n;
}

function convertHoursToHoursMinutes(h) {
  var x = h * 3600;
  var hh = Math.floor(x / 3600);
  if (hh < 10) hh = "0" + hh;
  var y = x % 3600;
  var mm = Math.floor(y / 60);
  if (mm < 10) mm = "0" + mm;
  return hh + ":" + mm
}

// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes) {
  return (360 / 60) * minutes;
}

function tick() {
  let today = new Date();
  var hours = 0;
  var mins = 0;
  var secs = 0;

  if (today.getHours() > 12) {
    hours = today.getHours()-12;
  } else if (today.getHours() == 0) {
    hours = 12;
  } else {
    hours = today.getHours();
  }

  if (String(today.getMinutes()).length == 1) {
    mins = "0" + today.getMinutes()
  } else {
    mins = today.getMinutes()
  }

  if (String(today.getSeconds()).length == 1) {
    secs = "0" + today.getSeconds()
  } else {
    secs = today.getSeconds()
  }
  let dayNumber = today.getDate();
  let dayOfWeek = weekArray[today.getDay()];
  let month = monthArray[today.getMonth()];

  //calculate curiosity time
  let jd_ut = 2440587.5 + (today.getTime() / 8.64E7);
  let jd_tt = jd_ut + (taiOffset + 32.184) / 86400;
  let j2000 = jd_tt - 2451545.0;

  let msd = (((j2000 - 4.5) / 1.027491252) + 44796.0 - 0.00096);
  let mtc = (24 * msd) % 24;

  let curiosityLocalMeanSolarTime = inside24(mtc - 222.6 * 24 / 360);
  let curiositySolValue = Math.floor(msd - (360 - 137.4) / 360) - 49268;

  //set values for the clock
  earthDate.innerHTML = dayOfWeek + " " + dayNumber + " " + month;
  earthClock.innerHTML = hours + ":" + mins + ":" + secs;
  var minutesAngle = minutesToAngle(mins);

  minuteArc.setAttribute("transform", "rotate(" + minutesToAngle(mins) + " 512 250)");
  hourArc.setAttribute("transform", "rotate(" + hoursToAngle(hours, mins) + " 512 250)");

  curiosityClock.innerHTML = "M" + convertHoursToHoursMinutes(curiosityLocalMeanSolarTime);
  curiositySol.innerHTML = "SOL " + curiositySolValue;

  mslLabel.innerHTML = "MARS-MSL";
  earthLabel.innerHTML = "EARTH";
}

setInterval(function () {tick();}, 1000);
