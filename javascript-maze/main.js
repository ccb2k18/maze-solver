
var nRows = 15;
var nCols = 30;
var maze = null;
var infoButton = null;

var modeTexts = ["wall select/delete", "select start block", "select end block"];

function changeModeText(mode) {

	document.getElementById("mode-view").innerText = "Mode: " + modeTexts[mode[0]];
}

var mode = [0, changeModeText];

// the ai of the maze
var ai = null;

function main() {

	// create the maze
	maze = new MazeStructure(nRows, nCols);
	for (let i = 0; i < maze.size(); i++) {

		maze.setAt(i, new Block(maze, mode, i, false, "maze-structure", nCols));
		if ((i + 1) % nCols == 0) {

			document.getElementById("maze-structure").appendChild(document.createElement("br"));
		}
	}
	// create an info button to toggle on and off the instructions displaying
	infoButton = new ToggleButton(document.getElementById("info-icon"), document.getElementById("instructions"), "p-text-hidden", "p-text");

	// create the ai
	ai = new MazeAI(maze);
	// add listeners for different keys
	document.addEventListener("keyup", function (event) {

		if (event.key == "s") {

			mode[0] = 1;
		} else if (event.key == "e") {

			mode[0] = 2;
		} else if (event.key == "Escape") {

			mode[0] = 0;
		} else if (event.key == "c") {

			maze.clearBlocks();
		} else if (event.key == "Enter") {

			ai.clearPath();
			ai.findSolution();
		}
		mode[1](mode);
		

	});

	document.addEventListener("click", function (event) {

		ai.clearPath();
	})
}


window.addEventListener("load", main);