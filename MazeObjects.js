
// block object for maze that represents a position in the maze matrix
class Block {

	static startBlockIndex = null;
	static endBlockIndex = null;
	// this method determines how to change blocks based on the current user mode
	static changeBlock(maze, mode, element, index) {

		if (mode[0] == 0) {

			Block.changeWall(mode, element);
		} else if (mode[0] == 1) {

			Block.selectStart(maze, mode, element, index);
		} else if (mode[0] == 2) {

			Block.selectEnd(maze, mode, element, index);
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
	static selectStart(maze, mode, element, index) {

		element.setAttribute("class", "start");
		// we are now back to wall select/delete mode
		mode[0] = 0;
		// if there was a previous start
		if (Block.startBlockIndex != null && index != Block.startBlockIndex) {

			maze.getAt(Block.startBlockIndex).element.setAttribute("class", "free");
		}
		Block.startBlockIndex = index;
	}

	// select the ending block (this can only be done once)
	static selectEnd(maze, mode, element, index) {

		element.setAttribute("class", "end");
		// we are now back to wall select/delete mode
		mode[0] = 0;
		// if there was a previous end
		if (Block.endBlockIndex != null && index != Block.endBlockIndex) {

			maze.getAt(Block.endBlockIndex).element.setAttribute("class", "free");
		}
		Block.endBlockIndex = index;
	}

	constructor(maze, globalMode, index, isWall, divIDString, nCols) {

		// index in the array
		this.index = index;
		// row number and column number for checking maze boundaries
		this.row = Math.floor(index / nCols);
		this.col = index % nCols; 
		this.element = document.createElement("div");
		this.element.setAttribute("class", "free");
		document.getElementById(divIDString).appendChild(this.element);
		// add event listener for clicks
		this.element.addEventListener("click", function () {

			Block.changeBlock(maze, globalMode, this, index);
		});
	}

	isTraversable() {

		return (this.element.getAttribute("class") != "wall");
	}

	equals(otherBlock) {

		return (this.index == otherBlock.index);
	}

	distanceToBlock(block) {

		return Math.sqrt((this.row-block.row)**2 + (this.col-block.col)**2);
	}

	getRowCol() {

		return [this.row, this.col];
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
		this.pathStack = null;
		// keep track of visited blocks in a hash table
		this.visitedBlocks = new HashTable(this.maze.nRows * this.maze.nCols * 5);

	}

	indexOfUpBlock(block) {

		return (block.row - 1) * this.maze.nCols + block.col;
	}

	indexOfRightBlock(block) {

		return block.row * this.maze.nCols + (block.col + 1);
	}

	indexOfDownBlock(block) {

		return (block.row + 1) * this.maze.nCols + block.col;
	}

	indexOfLeftBlock(block) {

		return block.row * this.maze.nCols + (block.col - 1);
	}

	rowColOfUpBlock(block) {

		return [block.row - 1, block.col];
	}

	rowColOfRightBlock(block) {

		return [block.row, block.col + 1];
	}

	rowColOfDownBlock(block) {

		return [block.row + 1, block.col];
	}

	rowColOfLeftBlock(block) {

		return [block.row, block.col - 1];
	}

	getIndexOfRowCol(blockCoords) {

		return blockCoords[0] * this.maze.nCols + blockCoords[1];
	}

	// returns true if the coordinate is outside of the maze
	isOutOfBounds(blockCoords) {

		var blockRow = blockCoords[0];
		var blockCol = blockCoords[1];
		return blockRow < 0 || blockRow >= this.maze.nRows || blockCol < 0 || blockCol >= this.maze.nCols;
	}

	// returns true if we haven't visited it before
	haveNotVisited(block) {

		return (this.visitedBlocks.getElementAt(block.index.toString()) == null);
	}

	// marks the block as visited so we never go to it again
	markAsVisited(block) {

		this.visitedBlocks.setElementAt(block.index.toString(), block);

	}

	fillPath() {

		for (let i = 1; i < this.pathStack.length - 1; i++) {

			this.pathStack[i].element.setAttribute("class", "path");
		}
	}

	clearPath() {

		if (this.pathStack != null) {

			for (let i = 1; i < this.pathStack.length - 1; i++) {

				this.pathStack[i].element.setAttribute("class", "free");
			}
			this.pathStack = null;
		document.getElementById("ai-message").innerText = "";
		}
	}

	sortBasedOnDistanceToEnd(arrayOfBlocks) {

		var endBlock = this.maze.getAt(Block.endBlockIndex);
		while (true) {

			let numSwaps = 0;
			for (let i = 0; i < arrayOfBlocks.length - 1; i++) {

				if (arrayOfBlocks[i].distanceToBlock(endBlock) > arrayOfBlocks[i+1].distanceToBlock(endBlock)) {

					var tmpBlock = arrayOfBlocks[i];
					arrayOfBlocks[i] = arrayOfBlocks[i+1];
					arrayOfBlocks[i+1] = tmpBlock;
					numSwaps++;
				}
			}
			if (numSwaps == 0) {

				break;
			}
		}
	}

	// returns true if the block is invalid or does not exist
	isValid(blockCoords) {

		if (!this.isOutOfBounds(blockCoords)) {

			var block = this.maze.getAt(this.getIndexOfRowCol(blockCoords));
			if (this.haveNotVisited(block) && block.isTraversable()) {

				return true;
			}
		}
		return false;
	}

	findSolution() {

		// if the start block or end block is not defined we cannot solve the maze
		if (Block.startBlockIndex == null || Block.endBlockIndex == null) {

			return null;
		}
		// a JavaScript array implemented as a stack for saving our solution path if it exists
		var pathStack = new Array();
		// retrieve the start block
		var startBlock = this.maze.getAt(Block.startBlockIndex);
		// began recursion here
		var solved = this.traverse(startBlock, pathStack);
		// clear the hash table
		this.visitedBlocks = null;
		this.visitedBlocks = new HashTable(this.maze.nRows * this.maze.nCols * 5);
		if (solved) {

			this.pathStack = pathStack;
			this.fillPath();
			document.getElementById("ai-message").innerText = "AI: The maze has been solved!";
		} else {

			document.getElementById("ai-message").innerText = "AI: There is no solution path.";
		}
	}

	traverse(block, pathStack) {

		// our policy is: up right down left

		console.log(block);
		// immediately add the block to the visited hashtable
		this.markAsVisited(block);
		// also push this block onto the stack
		pathStack.push(block);

		// first check if we reached the end
		if (block.equals(this.maze.getAt(Block.endBlockIndex))) {

			return true;
		}

		// obtain an array of all four block coords to go to
		var blockCoordsArr = [this.rowColOfUpBlock(block),
			this.rowColOfRightBlock(block), this.rowColOfDownBlock(block),
				this.rowColOfLeftBlock(block)];

		var blocksArr = [];
		// filter out all invalid options
		for (let i = 0; i < blockCoordsArr.length; i++) {

			if (this.isValid(blockCoordsArr[i])) {

				blocksArr.push(this.maze.getAt(this.getIndexOfRowCol(blockCoordsArr[i])));
			}
		}

		// sort the blocks
		this.sortBasedOnDistanceToEnd(blocksArr);


		for (let i = 0; i < blocksArr.length; i++) {

			var solved = this.traverse(blocksArr[i], pathStack);
			if (solved) {

				return true;
			}
		}


		// after we have exhausted all our options we must pop this block from the stack and return
		// to our previous caller
		pathStack.pop();
		return false;	

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