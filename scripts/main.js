$(document).ready(function() {
  
  var canvas = $('.board').get(0);
  var context = canvas.getContext('2d');
  
  var stepTimer = undefined;
  var running = false;
  var interval = 50; // ms
  
  var radius = canvas.width/2;
  var dart_r = 3;
  var throws = 0;
  var hits = 0;
  var pi = 0.0; // pi estimate 
  
  
  /* Draws dart at (x, y) */
  function draw(x, y, color) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(x, y, dart_r, 0, 2 * Math.PI);
    context.fill();
  };
  
  
  /* Draw board */
  function drawBoard() {
    context.beginPath();
    context.fillStyle = '#ffffff';
    context.rect(0, 0, canvas.width, canvas.height);
    context.fill();
    context.beginPath();
    context.strokeStyle = '#00ff00';
    context.arc(canvas.width/2, canvas.height/2, radius, 0, 2 * Math.PI);
    context.stroke();
    context.beginPath();
    context.strokeStyle = '#ff0000';
    context.rect(0, 0, canvas.width, canvas.height);
    context.stroke();
  };
  drawBoard();
  
  
  /* Throws dart at (x, y) */
  function step(x, y) {
    var dx = x - canvas.width/2;
    var dy = y - canvas.height/2;
    //console.log(dx, dy);
    
    /* is it hit or miss? */
    if (Math.abs(dx) < radius && Math.abs(dy) < radius) {
      ++throws;
      $('.throwpi-throws').text(throws);
    }
    
    if ((dx*dx + dy*dy) < (radius*radius)) {
      ++hits;
      $('.throwpi-hits').text(hits);
      draw(x, y, '#00ff00');
    } else {
      draw(x, y, '#ff0000');
    }
    
    pi = calculatePi(throws, hits);
    $('.throwpi-pi').text(Number(pi).toFixed(5));
    
    
  };
  
  
  /* Automatically throws a dart */
  function shoot() {
    if (!running) return;
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
    step(x, y);
  };
  
  
  /* Calculates pi based on the number of hits and misses */
  function calculatePi(throws, hits) {
    return (4.0 * hits) / (throws > 0 ? throws : 1);
  };
  
  
  /* Random automatic throw */
  $('.throwpi-step').click(function() {
    shoot();
  });
  
  
  /* Resets the board */
  $('.throwpi-reset').click(function() {
    clearInterval(stepTimer);
    running = false;
    
    throws = 0;
    hits = 0;
    pi = 0.0;
    $('.throwpi-throws').text(throws);
    $('.throwpi-hits').text(hits);
    $('.throwpi-pi').text(pi);
    drawBoard();
  });
  
  
  /* Starts/stops automatic throwing */
  $('.throwpi-start-stop').click(function() {
    if (!running) {
      stepTimer = setInterval(shoot, interval);
      running = true;
    } else {
      clearInterval(stepTimer);
      running = false;
    }
  });
  
  
  /* Gets the cursor position inside the canvas */
  function getMousePos(e, client) {
    var rect = client.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };
  
  
  /* Services the click event (manual dart throw) */
  $('.board').mousedown(function(e) {
    var pos = getMousePos(e, canvas);
    step(pos.x, pos.y);
    //console.log(pos);
  });
  
});
