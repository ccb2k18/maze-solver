
var nRows = 15;
var nCols = 30;
var maze = null;
var infoButton = null;
var selectingStates = new Array(2);

// reference to previously selected start block
var prevStart = [null];
// reference to previously selected end block
var prevEnd = [null];

var modeTexts = ["wall select/delete", "select start block", "select end block"];

function changeModeText(mode) {

	document.getElementById("mode-view").innerText = "Mode: " + modeTexts[mode[0]];
}

var mode = [0, changeModeText];
function main() {

	// create the maze
	maze = new MazeStructure(nRows, nCols);
	for (let i = 0; i < maze.size(); i++) {

		maze.setAt(i, new Block(prevStart, prevEnd, mode, i, false, "maze-structure"));
		if ((i + 1) % nCols == 0) {

			document.getElementById("maze-structure").appendChild(document.createElement("br"));
		}
	}
	// create an info button to toggle on and off the instructions displaying
	infoButton = new ToggleButton(document.getElementById("info-icon"), document.getElementById("instructions"), "p-text-hidden", "p-text");

	// add listeners for different keys
	document.addEventListener("keyup", function (event) {

		if (event.key == "s") {

			mode[0] = 1;
		} else if (event.key == "e") {

			mode[0] = 2;
		} else if (event.key == "Escape") {

			mode[0] = 0;
		} else if (event.key == "c") {

			for (let i = 0; i < maze.size(); i++) {

				maze.getAt(i).element.setAttribute("class", "free");
			}
		}
		mode[1](mode);
		

	});
}


window.addEventListener("load", main);