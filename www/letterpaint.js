(function(){



  /* Get container elements */

  var container = document.querySelector('#container');

  var charscontainer = document.querySelector('#chars');



  var message = new Array();

  message[0] = "You can do it!";

  message[1] = "You are just there!";

  message[2] = "Just a little more!";



  var score=0;  

var mtimer;

var secCount;

var sec=0;

  /* Get sounds */

  var winsound = document.querySelector('#winsound');

  var errorsound = document.querySelector('#errorsound');



  /* Prepare canvas */

  var c = document.querySelector('canvas');

  var cx = c.getContext('2d');

  var letter = null;

  var fontsize = 300;

  var paintcolour = [240, 240, 240];

  var textcolour = [255, 30, 20];

  var xoffset = 0;

  var yoffset = 0;

  var linewidth = 20;

  var pixels = 0;

  var letterpixels = 0;



  /* Mouse and touch events */

  var mousedown = false;

  var touched = false;

  var oldx = 0;

  var oldy = 0;



  /* Overall game presets */

  var state = 'intro';

  var sound = true;

  var currentstate;



  function init() {

    xoffset = container.offsetLeft;

    yoffset = container.offsetTop;

    fontsize = container.offsetHeight / 1.5;

    linewidth = container.offsetHeight / 19;

    paintletter();

    setstate('intro');

	$( "#sc" ).hide();

	$( "#msg" ).hide();

  }



  function togglesound() {

    if (sound) {

      sound = false;

      soundbutton.className = 'navbuttonoff';

    } else {

      sound = true;

      soundbutton.className = 'navbutton';

    }

  }



  function showerror() {

    setstate('error');

    if (sound) {

      errorsound.play();

    }

    if (navigator.vibrate) {

      navigator.vibrate(100);

    }

  }



  function showinfo() {

    if (state !== 'info') {

      setstate('info');

    } else {

      setstate('play');

    }

  }





  function setstate(newstate) {

    state = newstate;

    container.className = newstate;

    currentsate = state;

  }

  function moreneeded() {

    setstate('play');

    mousedown = false;

  }

  function retry(ev) {

    mousedown = false;

    oldx = 0;

    oldy = 0;

    paintletter(letter);

  }

  function winner() {

    paintletter();

	score+=1;

	$( "#sc" ).text( "Score: "+score);

    resets();

  sec=0;

  }

  

  function showMessage()

{clearInterval(mtimer);



	$( "#msg" ).text(message[Math.floor((Math.random()*3))]);

	$( "#msg" ).show( "slow" );

		mtimer=setInterval(function(){resets()},3000);

	

}



  function resets()

{

	clearInterval(mtimer);

	$( "#msg" ).hide();

	mtimer=setInterval(function(){showMessage()},9000);

    

}



  function start() {

	  sec=0;

	secCount=setInterval(function(){sec++},1000);



	resets();



	paintletter(letter);

	$( "#sc" ).show( "slow" );

  }

  function cancel() {

    paintletter();

  }

  function paintletter(retryletter) {

    var chars = charscontainer.innerHTML.split('');

    letter = retryletter ||

             chars[parseInt(Math.random() * chars.length,10)];

    c.width = container.offsetWidth;

    c.height = container.offsetHeight;

    cx.font = 'bold ' + fontsize + 'px Open Sans';

    cx.fillStyle = '#ccc';

    cx.strokeStyle = 'rgb(' + paintcolour.join(',') + ')';





    cx.textBaseline = 'baseline';

    cx.lineWidth = linewidth;

    cx.lineCap = 'round';

    cx.fillText(

      letter,

      (c.width - cx.measureText(letter).width) / 2,

      (c.height / 1.3)

    );

     cx.font = 'bold ' + fontsize + 'px Open Sans B';
     cx.fillStyle = 'rgb(' + textcolour.join(',') + ')';
     cx.fillText(

      letter,

      (c.width - cx.measureText(letter).width) / 2,

      (c.height / 1.3)

      );


    pixels = cx.getImageData(0, 0, c.width, c.height);

    letterpixels = getpixelamount(

      textcolour[0],

      textcolour[1],

      textcolour[2]

    );

    cx.shadowOffsetX = 0;

    cx.shadowOffsetY = 0;

    cx.shadowBlur = 0;

    cx.shadowColor = '#333';

    setstate('play');

  }



  function getpixelamount(r, g, b) {

    var pixels = cx.getImageData(0, 0, c.width, c.height);

    var all = pixels.data.length;

    var amount = 0;

    for (i = 0; i < all; i += 4) {

      if (pixels.data[i] === r &&

          pixels.data[i+1] === g &&

          pixels.data[i+2] === b) {

        amount++;

      }

    }

    return amount;

  }



  function paint(x, y) {

    var rx = x - xoffset;

    var ry = y - yoffset;

    var colour = pixelcolour(x, y);

    if( colour.r === 0 && colour.g === 0 && colour.b === 0) {

      showerror();

    } else {

      cx.beginPath();

      if (oldx > 0 && oldy > 0) {

        cx.moveTo(oldx, oldy);

      }

      cx.lineTo(rx, ry);

      cx.stroke();

      cx.closePath();

      oldx = rx;

      oldy = ry;

    }

  }



  function pixelcolour(x, y) {

    var index = ((y * (pixels.width * 4)) + (x * 4));

    return {

      r:pixels.data[index],

      g:pixels.data[index + 1],

      b:pixels.data[index + 2],

      a:pixels.data[index + 3]

    };

  }



  function pixelthreshold() {

    if (state !== 'error') {

      if (getpixelamount(

        paintcolour[0],

        paintcolour[1],

        paintcolour[2]

      ) / letterpixels > 1.15) {

		  $( "#sec" ).text( "You did it in "+sec+" seconds.");

       setstate('win');

       if (sound) {

         winsound.play();

       }

      }

    }

  }



  /* Mouse event listeners */



  function onmouseup(ev) {

    ev.preventDefault();

    oldx = 0;

    oldy = 0;

    mousedown = false;

    pixelthreshold();

  }

  function onmousedown(ev) {

    ev.preventDefault();

    mousedown = true;

  }

  function onmousemove(ev) {

    ev.preventDefault();

    if (mousedown) {

      paint(ev.clientX, ev.clientY);

      ev.preventDefault();

    }

  }



  /* Touch event listeners */



  function ontouchstart(ev) {

    touched = true;

  }

  function ontouchend(ev) {

    touched = false;

    oldx = 0;

    oldy = 0;

    pixelthreshold();

  }

  function ontouchmove(ev) {

    if (touched) {

      paint(

        ev.changedTouches[0].pageX,

        ev.changedTouches[0].pageY

      );

      ev.preventDefault();

    }

  }





  /* Button event handlers */



$( "#info" ).on( "click", function() {

   setstate('play');

});

  

$( '#error button' ).on( "click", function() {

   retry();

});

$('#infos').on( "click", function() {

   showinfo();

});

$('#sound').on( "click", function() {

  togglesound();

});

$('#reload').on( "click", function() {

   cancel();

});

$( '#win button').on( "click", function() {

   winner();

});

$('#intro button').on( "click", function() {

   start();

});



$('#quitg').on( "click", function() {

   init();

});

$('#continue').on( "click", function() {

   setstate("play");

});





$('#quit').on( "click", function() {

  

$('#confirmM').text("You got a score of "+score+". Good Job!");



 setstate("confirm");

 

});



  /* Canvas event handlers */



  c.addEventListener('mouseup', onmouseup, false);

  c.addEventListener('mousedown', onmousedown, false);

  c.addEventListener('mousemove', onmousemove, false);

  c.addEventListener('touchstart', ontouchstart, false);

  c.addEventListener('touchend', ontouchend, false);

  c.addEventListener('touchmove', ontouchmove, false);



  window.addEventListener('load',init, false);

  window.addEventListener('resize',init, false);



})();



  

