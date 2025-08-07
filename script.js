class MysteryNumberQuest {
    constructor() {
        this.secretNumber = 0;
        this.attempts = 0;
        this.gameActive = false;
        this.bestScore = localStorage.getItem('mysteryQuestBestScore') || null;
        this.gamesWon = parseInt(localStorage.getItem('mysteryQuestWins')) || 0;
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadGameStats();
        this.startNewQuest();
    }
    
    initializeElements() {
        this.guessInput = document.getElementById('guessInput');
        this.submitButton = document.getElementById('submitGuess');
        this.newGameButton = document.getElementById('newGame');
        this.gameMessage = document.getElementById('gameMessage');
        this.attemptsElement = document.getElementById('attempts');
        this.bestScoreElement = document.getElementById('bestScore');
        this.gamesWonElement = document.getElementById('gamesWon');
        this.crystalBall = document.querySelector('.crystal-ball');
        this.mysteryNumber = document.querySelector('.mystery-number');
    }
    
    setupEventListeners() {
        this.submitButton.addEventListener('click', () => this.makeGuess());
        this.newGameButton.addEventListener('click', () => this.startNewQuest());
        
        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.gameActive) {
                this.makeGuess();
            }
        });
        
        this.guessInput.addEventListener('input', () => {
            this.validateInput();
        });
    }
    
    validateInput() {
        const value = parseInt(this.guessInput.value);
        if (value < 1 || value > 100) {
            this.guessInput.style.borderColor = '#ff4757';
        } else {
            this.guessInput.style.borderColor = 'rgba(0, 255, 255, 0.3)';
        }
    }
    
    startNewQuest() {
        this.secretNumber = Math.floor(Math.random() * 100) + 1;
        this.attempts = 0;
        this.gameActive = true;
        
        this.guessInput.value = '';
        this.guessInput.disabled = false;
        this.guessInput.focus();
        this.submitButton.disabled = false;
        this.newGameButton.style.display = 'none';
        
        this.mysteryNumber.textContent = '?';
        this.showMessage('🔮 The crystal ball holds a secret number... Can you unlock it?', '');
        this.updateAttemptsDisplay();
        
        this.crystalBall.classList.remove('celebration');
        
        // Add some mystical effects
        this.addMysticalParticles();
        
        console.log(`New quest started! Secret number: ${this.secretNumber}`);
    }
    
    makeGuess() {
        if (!this.gameActive) return;
        
        const guess = parseInt(this.guessInput.value);
        
        if (isNaN(guess) || guess < 1 || guess > 100) {
            this.showMessage('⚠️ Enter a valid number between 1 and 100, brave adventurer!', 'error');
            this.guessInput.focus();
            return;
        }
        
        this.attempts++;
        this.updateAttemptsDisplay();
        
        if (guess === this.secretNumber) {
            this.handleVictory();
        } else if (guess < this.secretNumber) {
            const diff = this.secretNumber - guess;
            if (diff <= 5) {
                this.showMessage('🔥 Very close! The number is higher!', 'too-low');
            } else if (diff <= 15) {
                this.showMessage('📈 Close! The number is higher!', 'too-low');
            } else {
                this.showMessage('⬆️ Too low! Aim much higher, seeker!', 'too-low');
            }
        } else {
            const diff = guess - this.secretNumber;
            if (diff <= 5) {
                this.showMessage('🔥 Very close! The number is lower!', 'too-high');
            } else if (diff <= 15) {
                this.showMessage('📉 Close! The number is lower!', 'too-high');
            } else {
                this.showMessage('⬇️ Too high! Aim much lower, seeker!', 'too-high');
            }
        }
        
        this.guessInput.value = '';
        this.guessInput.focus();
    }
    
    handleVictory() {
        this.gameActive = false;
        this.mysteryNumber.textContent = this.secretNumber;
        
        let victoryMessage = '';
        if (this.attempts === 1) {
            victoryMessage = '🌟 INCREDIBLE! First try! You are a true mystic!';
        } else if (this.attempts <= 5) {
            victoryMessage = `🏆 AMAZING! Quest completed in just ${this.attempts} attempts!`;
        } else if (this.attempts <= 10) {
            victoryMessage = `⭐ Well done! Quest completed in ${this.attempts} attempts!`;
        } else {
            victoryMessage = `🎯 Victory achieved in ${this.attempts} attempts! The mystery is solved!`;
        }
        
        this.showMessage(victoryMessage, 'success');
        
        this.guessInput.disabled = true;
        this.submitButton.disabled = true;
        this.newGameButton.style.display = 'block';
        
        this.updateGameStats();
        this.crystalBall.classList.add('celebration');
        this.createVictoryEffect();
    }
    
    showMessage(message, type) {
        this.gameMessage.textContent = message;
        this.gameMessage.className = `game-message ${type}`;
    }
    
    updateAttemptsDisplay() {
        this.attemptsElement.textContent = this.attempts;
    }
    
    updateGameStats() {
        // Update games won
        this.gamesWon++;
        localStorage.setItem('mysteryQuestWins', this.gamesWon.toString());
        this.gamesWonElement.textContent = this.gamesWon;
        
        // Update best score
        if (!this.bestScore || this.attempts < parseInt(this.bestScore)) {
            this.bestScore = this.attempts.toString();
            localStorage.setItem('mysteryQuestBestScore', this.bestScore);
            this.bestScoreElement.textContent = this.bestScore;
            this.bestScoreElement.style.color = '#00ff88';
            setTimeout(() => {
                this.bestScoreElement.style.color = '#00ffff';
            }, 3000);
        }
    }
    
    loadGameStats() {
        this.bestScoreElement.textContent = this.bestScore || '-';
        this.gamesWonElement.textContent = this.gamesWon;
    }
    
    addMysticalParticles() {
        // Add some visual flair when starting new game
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: #00ffff;
                    border-radius: 50%;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    animation: sparkle 1s ease-out forwards;
                    pointer-events: none;
                    z-index: 1000;
                `;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 1000);
            }, i * 100);
        }
    }
    
    createVictoryEffect() {
        // Create victory particles
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                const colors = ['#00ffff', '#ff6b35', '#00ff88'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                const randomX = Math.random() * 400 - 200;
                const randomY = Math.random() * 400 - 200;
                
                particle.style.cssText = `
                    position: fixed;
                    width: 6px;
                    height: 6px;
                    background: ${randomColor};
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    pointer-events: none;
                    z-index: 1001;
                    transform: translate(-50%, -50%);
                    animation: victoryBurst${i} 2s ease-out forwards;
                `;
                
                // Create unique keyframe for each particle
                const keyframeName = `victoryBurst${i}`;
                const keyframes = `
                    @keyframes ${keyframeName} {
                        0% { 
                            transform: translate(-50%, -50%) scale(0); 
                            opacity: 1; 
                        }
                        100% { 
                            transform: translate(-50%, -50%) translateX(${randomX}px) translateY(${randomY}px) scale(1); 
                            opacity: 0; 
                        }
                    }
                `;
                
                // Add keyframes to document
                const style = document.createElement('style');
                style.textContent = keyframes;
                document.head.appendChild(style);
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                    style.remove();
                }, 2000);
            }, i * 50);
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MysteryNumberQuest();
});