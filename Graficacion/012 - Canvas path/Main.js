window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

  context.beginPath();

  context.lineWidth = 5;
  for (let y = 10; y < 300; y += 10) {
    context.moveTo(10, y);
    context.lineTo(500, y);
  }
  context.stroke();

  context.beginPath();
  context.fillStyle = "rgba(0, 30, 200, 0.75)";
  context.moveTo(50, 410);
  context.lineTo(10, 470);
  context.lineTo(90, 470);
  context.fill();

  context.beginPath();
  context.strokeStyle = "rgba(210, 30, 10, 0.75)";
  context.moveTo(150, 410);
  context.lineTo(110, 470);
  context.lineTo(190, 470);
  context.stroke();

  context.beginPath();
  context.strokeStyle = "rgba(60, 180, 10, 0.75)";
  context.moveTo(250, 410);
  context.lineTo(210, 470);
  context.lineTo(290, 470);
  context.closePath();
  context.stroke();
});
