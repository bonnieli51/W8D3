// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  const grid = new Array(8);

  for (let i = 0; i < grid.length; i++){
    grid[i] = new Array(8);
  }

  grid[3][3] = new Piece("white");
  grid[4][4] = new Piece("white");

  grid[3][4] = new Piece("black");
  grid[4][3] = new Piece("black");

  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
    //[1,-1]
    //pos[0] y || pos[1] x
    if ((pos[0] > 7 || pos[0] < 0) || (pos[1] > 7 || pos[1] < 0)) {
      return false;
    } else {
      return true;
    }

};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
    if (!this.isValidPos(pos)) {
      throw new Error('Not valid pos!');
    }
    return this.grid[pos[0]][pos[1]];
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  if (this.getPiece(pos) !== undefined) {
    return this.getPiece(pos).color === color;
  }
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  if (this.getPiece(pos) !== undefined) {
    return true;
  } else {
    return false;
  }
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip){
  //pos = starting position
  //color = own color
  //dir = which way to go
  let flipped = [];
  let nextPos = [pos[0] + dir[0], pos[1] + dir[1]];
  if (!this.isValidPos(nextPos)) {
    return [];
  }

  if (!this.isOccupied(nextPos)) {
    return [];
  }
  if (this.isMine(nextPos, color) && piecesToFlip !== undefined) {
    return piecesToFlip;
  }  
  if (this.isMine(nextPos, color) && piecesToFlip === undefined) {
    return [];
  }

  if (piecesToFlip === undefined) {
      flipped = [];
  } else {
      flipped = piecesToFlip;
  }
  flipped.push(nextPos);
  flipped = this._positionsToFlip(nextPos, color, dir, flipped);

  return flipped;
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
    if (!this.isOccupied(pos)) {
      for (let i = 0 ; i < Board.DIRS.length; i ++) {
        let positions = this._positionsToFlip(pos, color, Board.DIRS[i])
          if (positions.length > 0){
            return true;
          }
      }
      return false;
    }
    return false;
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (!this.validMove(pos, color)) {
    throw new Error("Invalid move!");
  }else {
    this.grid[pos[0]][pos[1]] = new Piece(color);
    for (let i = 0 ; i < Board.DIRS.length; i ++) {
      let positions = this._positionsToFlip(pos, color, Board.DIRS[i])
        if (positions.length > 0) {
          for (let j = 0 ; j < positions.length; j ++) {
            this.grid[positions[j][0]][positions[j][1]] = new Piece(color);
          }
        }  
    }
  }
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let arr = [];
  for (let i = 0; i < this.grid.length; i++) {
    for (let j = 0; j < this.grid[i].length; j++) {
        if (this.validMove([i,j], color)) {
          arr.push([i,j]);
        }
    }
  }
  return arr;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  if (this.validMoves(color).length === 0){
    return false;
  } else {
    return true;
  }
};


/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  if (this.hasMove("black")=== false && this.hasMove("white") === false) {
    return true;
  }else{
    return false;
  }
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  console.log('  0  1  2  3  4  5  6  7 ')
  for (let i = 0; i < this.grid.length; i++) { 
    let row = ""
    row += i
    for (let j = 0; j < this.grid[i].length; j++) {
       
      if (this.isOccupied([i,j])) {
        let piece = this.getPiece([i,j]).toString();
          row += " " + piece + " "
       } else {
        row +=  ' _ ';
       }
    }
    console.log(row)
  }

};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE