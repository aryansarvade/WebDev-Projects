var boxes = $(".box");
//array of all boxes
var resetBtn = $("#reset-btn");
var turnO = true;
const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

var winnerFound = false;

$("#message").hide();
function start() {
  boxes.on("click", function () {
    console.log("box clicked");
    if (turnO === true) {
      $(this).text("O");
      turnO = false;
    } else {
      $(this).text("X");
      turnO = true;
    }
    $(this).off("click"); //to not overwrite a clicked box by clicking it again
    checkWinner();
  });
}

function checkWinner() {
  //we check the winner by going thru all the winning patterns
  //and checking if their boxes have the same pattern or not
  for (var i = 0; i < winPatterns.length; i++) {
    var pattern = winPatterns[i];
    var box1 = boxes[pattern[0]].innerText;
    var box2 = boxes[pattern[1]].innerText;
    var box3 = boxes[pattern[2]].innerText;
    if (box1 !== "" && box2 !== "" && box3 != "") {
      if (box1 === box2 && box2 === box3) {
        console.log("winner " + box1);
        $("#message")
          .text("🏆 Winner is " + box1)
          .slideDown();
        var audio = new Audio("./win.mp3");
        audio.play();
        boxes.off("click"); //disable further clicking of boxes
        winnerFound = true;
      }
    }
  }
}

$("#reset-btn").on("click", function () {
  turnO = true;
  $("#message").slideUp();
  boxes.each(function () {
    $(this).text("");
  });
  start();
});

start();
