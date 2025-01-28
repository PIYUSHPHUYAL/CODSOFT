// Game constants and state
const EMPTY = '';
const PLAYER_X = 'X';
const PLAYER_O = 'O';
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

class TicTacToe {
    constructor() {
        this.board = Array(9).fill(EMPTY);
        this.currentPlayer = PLAYER_O; // Human starts
        this.isGameActive = true;
        
        // DOM elements
        this.boardEl = document.getElementById('board');
        this.statusEl = document.getElementById('status');
        this.resetBtn = document.getElementById('reset');
        
        // Bind event handlers
        this.handleCellClick = this.handleCellClick.bind(this);
        this.resetGame = this.resetGame.bind(this);
        
        // Set up event listeners
        this.resetBtn.addEventListener('click', this.resetGame);
        
        // Initialize the game
        this.initializeBoard();
    }
    
    initializeBoard() {
        this.boardEl.innerHTML = '';
        
        // Create board cells
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.addEventListener('click', this.handleCellClick);
            this.boardEl.appendChild(cell);
        }
        
        this.updateStatus("Your turn! You're playing as O");
    }
    
    handleCellClick(event) {
        const clickedIndex = parseInt(event.target.dataset.index);
        
        // Ignore clicks if game is over or cell is taken
        if (!this.isGameActive || this.board[clickedIndex] !== EMPTY) {
            return;
        }
        
        // Make player's move
        this.makeMove(clickedIndex);
        
        // If game isn't over, let AI make its move
        if (this.isGameActive) {
            setTimeout(() => this.makeAIMove(), 600);
        }
    }
    
    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.boardEl.children[index].textContent = this.currentPlayer;
        
        if (this.checkWinner()) {
            const winner = this.currentPlayer === PLAYER_O ? 'You win!' : 'AI wins!';
            this.updateStatus(winner);
            this.isGameActive = false;
            return;
        }
        
        if (this.isBoardFull()) {
            this.updateStatus("It's a draw!");
            this.isGameActive = false;
            return;
        }
        
        // Switch players
        this.currentPlayer = this.currentPlayer === PLAYER_O ? PLAYER_X : PLAYER_O;
        
        if (this.currentPlayer === PLAYER_O) {
            this.updateStatus("Your turn");
        } else {
            this.updateStatus("AI is thinking...");
        }
    }
    
    makeAIMove() {
        const bestMove = this.findBestMove();
        if (bestMove !== null) {
            this.makeMove(bestMove);
        }
    }
    
    findBestMove() {
        let bestScore = -Infinity;
        let bestMove = null;
        
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === EMPTY) {
                this.board[i] = PLAYER_X;
                const score = this.minimax(0, false, -Infinity, Infinity);
                this.board[i] = EMPTY;
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        return bestMove;
    }
    
    minimax(depth, isMaximizing, alpha, beta) {
        // Check terminal states
        if (this.checkWinner()) {
            return isMaximizing ? -10 + depth : 10 - depth;
        }
        
        if (this.isBoardFull()) {
            return 0;
        }
        
        const currentPlayer = isMaximizing ? PLAYER_X : PLAYER_O;
        let bestScore = isMaximizing ? -Infinity : Infinity;
        
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === EMPTY) {
                // Try this move
                this.board[i] = currentPlayer;
                const score = this.minimax(depth + 1, !isMaximizing, alpha, beta);
                this.board[i] = EMPTY;
                
                // Update best score
                if (isMaximizing) {
                    bestScore = Math.max(score, bestScore);
                    alpha = Math.max(alpha, score);
                } else {
                    bestScore = Math.min(score, bestScore);
                    beta = Math.min(beta, score);
                }
                
                // Alpha-beta pruning
                if (beta <= alpha) {
                    break;
                }
            }
        }
        
        return bestScore;
    }
    
    checkWinner() {
        return WINNING_COMBINATIONS.some(([a, b, c]) => {
            return this.board[a] !== EMPTY &&
                   this.board[a] === this.board[b] &&
                   this.board[a] === this.board[c];
        });
    }
    
    isBoardFull() {
        return this.board.every(cell => cell !== EMPTY);
    }
    
    updateStatus(message) {
        this.statusEl.textContent = message;
    }
    
    resetGame() {
        this.board = Array(9).fill(EMPTY);
        this.currentPlayer = PLAYER_O;
        this.isGameActive = true;
        this.initializeBoard();
    }
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});