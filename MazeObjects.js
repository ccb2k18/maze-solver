
// block object for maze that represents a position in the maze matrix
class Block {

	static startBlock = null;
	static endBlock = null;
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
		Block.startBlock = element;
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
		Block.endBlock = element;
	}

	constructor(prevStart, prevEnd, globalMode, index, isWall, divIDString, nRows, nCols) {

		// index in the array
		this.index = index;
		// row number and column number for checking maze boundaries
		this.rowNum = Math.floor(index / nRows);
		this.colNum = index % nCols; 
		this.element = document.createElement("div");
		this.element.setAttribute("class", "free");
		document.getElementById(divIDString).appendChild(this.element);
		// add event listener for clicks
		this.element.addEventListener("click", function () {

			Block.changeBlock(prevStart, prevEnd, globalMode, this);
		});
	}

	isTraversable() {

		return (this.element.getAttribute("class") != "wall");
	}

	equals(otherBlock) {

		return (this.index == otherBlock.index);
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

	clearBlocks() {

		for (let i = 0; i < maze.size(); i++) {

				this.mazeMatrix[i].element.setAttribute("class", "free");
			}
	}

	size() {

		return this.nRows * this.nCols;
	}
}

class MazeAI {

	constructor(maze) {

		// the maze structure
		this.maze = maze;
		// keep track of visited blocks in a hash table
		this.visitedBlocks = new HashTable(this.maze.nRows * this.maze.nCols * 5);

	}

	// determine index of above block
	indexOfUpBlock(blockRow, blockCol) {

		return (blockRow - 1) * this.maze.nRows + blockCol;
	}

	// determine index of right block
	indexOfRightBlock(blockRow, blockCol) {

		return blockRow * this.maze.nRows + (blockCol + 1);
	}

	// determine index of below block
	indexOfDownBlock(blockRow, blockCol) {

		return (blockRow + 1) * this.maze.nRows + blockCol;
	}

	// determine index of left block
	indexOfRightBlock(blockRow, blockCol) {

		return blockRow * this.maze.nRows + (blockCol - 1);
	}

	// returns true if the coordinate is outside of the maze
	isOutOfBounds(blockRow, blockCol) {

		return blockRow < -1 || blockRow >= this.maze.nRows || blockCol < -1 && blockCol >= this.maze.nCols;
	}

	// returns true if we haven't visited it before
	haveNotVisited(block) {

		return (this.visitedBlocks.getElementAt(block.index.toString()) == null);
	}

	findSolution() {

		// a JavaScript array implemented as a stack for saving our solution path if it exists
		var pathStack = new Array();
		// retrieve the start block
		var startBlock = Blocks.startBlock;
		// began recursion here
		var solved = traverse(startBlock, pathStack);
		if (solved) {

			return pathStack;
		} else {

			return null;
		}
	}

	traverse(block, pathStack) {

		// our policy is: up right down left

		// first check if we reached the end
		if (block.equals(Blocks.endBlock)) {

			// add the end to the stack
			pathStack.push(block);
			return true;
		}

		// first we check up
		if (!isOutOfBounds(indexOfUpBlock(block)) && haveNotVisited(block) && block.isTraversable()) {


		}

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