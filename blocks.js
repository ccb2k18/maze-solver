
// block object for maze that represents a position in the maze matrix
class Block {

	// this method determines how to change blocks based on the current user mode
	static changeBlock(prevStart, prevEnd, mode, element) {

		if (mode[0] == 0) {

			Block.changeWall(mode, element);
		} else if (mode[0] == 1) {

			Block.selectStart(prevStart, mode, element);
		} else if (mode[0] == 2) {

			Block.selectEnd(prevEnd, mode, element);
		}
		mode[1](mode);
	}

	// change the block to a wall or not a wall
	static changeWall(mode, element) {

		if (element.getAttribute("class") == "wall") {

			element.setAttribute("class", "free");
		} else if (element.getAttribute("class") == "free") {

			element.setAttribute("class", "wall");
		}
	}

	// select the starting block (this can only be done once)
	static selectStart(prevStart, mode, element) {

		element.setAttribute("class", "start");
		// we are now back to wall select/delete mode
		mode[0] = 0;
		// if there was a previous start
		if (prevStart[0] != null) {

			prevStart[0].setAttribute("class", "free");
		}
		prevStart[0] = element;
	}

	// select the ending block (this can only be done once)
	static selectEnd(prevEnd, mode, element) {

		element.setAttribute("class", "end");
		// we are now back to wall select/delete mode
		mode[0] = 0;
		// if there was a previous start
		if (prevEnd[0] != null) {

			prevEnd[0].setAttribute("class", "free");
		}
		prevEnd[0] = element;
	}

	constructor(prevStart, prevEnd, globalMode, index, isWall, divIDString) {

		// index in the array
		this.index = index;
		this.element = document.createElement("div");
		this.element.setAttribute("class", "free");
		document.getElementById(divIDString).appendChild(this.element);
		// add event listener for clicks
		this.element.addEventListener("click", function () {

			Block.changeBlock(prevStart, prevEnd, globalMode, this);
		});
	}
}


class MazeStructure {

	// convert the maze into a 1-dimensional structure given the matrix shape
	constructor(nRows, nCols) {

		this.nRows = nRows;
		this.nCols = nCols;
		this.mazeMatrix = new Array(nRows*nCols);
	}

	setAt(index, value) {

		this.mazeMatrix[index] = value;
	}

	getAt(index) {

		return this.mazeMatrix[index];
	}

	size() {

		return this.nRows * this.nCols;
	}
}


class ToggleButton {

	static action(btn, element, trueClass, falseClass) {

		if (element.getAttribute("class") == trueClass) {

			element.setAttribute("class", falseClass);
		} else {

			element.setAttribute("class", trueClass);
		}
	}
	constructor(btn, element, trueClass, falseClass) {

		this.btn = btn;
		this.btn.addEventListener("click", function() {

			ToggleButton.action(this, element, trueClass, falseClass);
		});
	}
}

class KeyListener {

	static listen(event, keyCode) {

		if (event.key == keyCode) {

			return true;
		} else {

			return false;
		}
	}
	constructor(keyCode) {

		this.state = false;
		document.addEventListener("keyup", function (event) {

			KeyListener.listen(event, keyCode);
		})
	}

	isKeyUp() { return this.state; }
}

class ModeHandler {

	constructor(element, keysArray) {

		this.element = element;
		this.keysArray = keysArray;
	}
}