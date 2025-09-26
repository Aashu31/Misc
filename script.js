// DOM Elements
const storybook = document.getElementById('storybook');
const royalDiaryScene = document.getElementById('royalDiaryScene');
const candleNightScene = document.getElementById('candleNightScene');
const backgroundMusic = document.getElementById('backgroundMusic');
const celebrationMusic = document.getElementById('celebrationMusic');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

// Current page index
let currentPage = 1;
const totalPages = 4;
let musicInitialized = false;

// Initialize the website
function initWebsite() {
    createStars();
    createHearts();
    createMusicControl();
    
    // Show first page
    showPage(currentPage);
    
    // Initialize music after user interaction
    document.addEventListener('click', initializeMusic, { once: true });
    document.addEventListener('touchstart', initializeMusic, { once: true });
}

// Create music control button
function createMusicControl() {
    const musicControl = document.createElement('button');
    musicControl.className = 'music-control';
    musicControl.innerHTML = '🔇';
    musicControl.title = 'Toggle Music';
    
    musicControl.addEventListener('click', function() {
        if (backgroundMusic.paused && celebrationMusic.paused) {
            // Play appropriate music based on current scene
            if (royalDiaryScene.style.display === 'flex') {
                celebrationMusic.play().catch(e => console.log('Music play prevented'));
                this.innerHTML = '🔊';
            } else {
                backgroundMusic.play().catch(e => console.log('Music play prevented'));
                this.innerHTML = '🔊';
            }
        } else {
            // Pause all music
            backgroundMusic.pause();
            celebrationMusic.pause();
            this.innerHTML = '🔇';
        }
    });
    
    document.body.appendChild(musicControl);
}

// Initialize music after user interaction
function initializeMusic() {
    if (musicInitialized) return;
    
    musicInitialized = true;
    
    // Set music volumes
    backgroundMusic.volume = 0.3;
    celebrationMusic.volume = 0.5;
    
    // Try to play background music
    backgroundMusic.play().then(() => {
        console.log('Background music started');
        document.querySelector('.music-control').innerHTML = '🔊';
    }).catch(e => {
        console.log('Background music play prevented, will play after user interaction');
        // Music will play on next user interaction
    });
}

// Create starry background
function createStars() {
    const container = document.querySelector('.stars-container');
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 3;
        const speed = Math.random() * 3 + 1;
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDuration = `${speed}s`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(star);
    }
}

// Create floating hearts
function createHearts() {
    const container = document.querySelector('.floating-hearts');
    const heartCount = 20;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.fontSize = `${Math.random() * 2 + 1}rem`;
        heart.style.animationDelay = `${Math.random() * 8}s`;
        
        container.appendChild(heart);
    }
}

// Show specific page
function showPage(pageNumber) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the requested page
    const page = document.getElementById(`page${pageNumber}`);
    if (page) {
        page.classList.add('active');
    }
}

// Go to next page
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        showPage(currentPage);
        
        // Special effects for specific pages
        if (currentPage === 4) {
            // Proposal page - add special effects
            createConstellation();
        }
        
        // Play page turn sound
        playPageTurnSound();
    }
}

// Page turn sound
function playPageTurnSound() {
    // Simple page turn sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 200;
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    oscillator.stop(audioContext.currentTime + 0.3);
}

// Create constellation effect
function createConstellation() {
    const container = document.querySelector('.constellation');
    const starCount = 15;
    
    // Clear existing stars
    container.innerHTML = '';
    
    // Create stars
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star-point';
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(star);
    }
    
    // Create connections between stars
    setTimeout(() => {
        const stars = container.querySelectorAll('.star-point');
        for (let i = 0; i < stars.length - 1; i++) {
            if (Math.random() > 0.7) { // 70% chance to connect
                createConnection(stars[i], stars[i + 1]);
            }
        }
    }, 100);
}

// Create connection line between two stars
function createConnection(star1, star2) {
    const container = document.querySelector('.constellation');
    const line = document.createElement('div');
    line.className = 'connection-line';
    
    const x1 = parseFloat(star1.style.left);
    const y1 = parseFloat(star1.style.top);
    const x2 = parseFloat(star2.style.left);
    const y2 = parseFloat(star2.style.top);
    
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    line.style.width = `${distance}%`;
    line.style.left = `${x1}%`;
    line.style.top = `${y1}%`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.opacity = '0';
    
    container.appendChild(line);
    
    // Animate line appearance
    setTimeout(() => {
        line.style.transition = 'opacity 1s ease-in-out';
        line.style.opacity = '0.3';
    }, 500);
}

// Handle Yes button click
yesBtn.addEventListener('click', function() {
    // Add click effect
    this.style.animation = 'sparkle 0.5s ease-in-out';
    
    // Fade out background music
    fadeOutMusic(backgroundMusic, 1000);
    
    // Show candle night scene
    candleNightScene.style.display = 'block';
    storybook.style.opacity = '0.5';
    
    // Wait 2 seconds then switch to celebration
    setTimeout(() => {
        // Hide storybook and show royal diary
        storybook.style.display = 'none';
        candleNightScene.style.display = 'none';
        royalDiaryScene.style.display = 'flex';
        
        // Start celebration music after 2 seconds
        setTimeout(() => {
            celebrationMusic.currentTime = 0;
            celebrationMusic.play().then(() => {
                console.log('Celebration music started');
                document.querySelector('.music-control').innerHTML = '🔊';
            }).catch(e => {
                console.log('Celebration music play prevented');
            });
        }, 2000);
        
        // Add celebration effects
        createFireworks();
        createConfetti();
    }, 2000);
});

// Handle No button click (with fun movement)
noBtn.addEventListener('click', function() {
    // Move the button around when clicked
    const moveButton = () => {
        const x = Math.random() * (window.innerWidth - 200);
        const y = Math.random() * (window.innerHeight - 100);
        
        this.style.position = 'fixed';
        this.style.left = `${x}px`;
        this.style.top = `${y}px`;
        this.style.transform = 'scale(0.9)';
        
        // Reset transform after animation
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 300);
    };
    
    // Move button on first click
    moveButton();
    
    // Add event listener for subsequent clicks
    this.onclick = moveButton;
});

// Fade out music smoothly
function fadeOutMusic(audioElement, duration) {
    const initialVolume = audioElement.volume;
    const stepTime = 50;
    const steps = duration / stepTime;
    const volumeStep = initialVolume / steps;
    
    const fadeInterval = setInterval(() => {
        if (audioElement.volume > volumeStep) {
            audioElement.volume -= volumeStep;
        } else {
            audioElement.volume = 0;
            audioElement.pause();
            clearInterval(fadeInterval);
        }
    }, stepTime);
}

// Create fireworks celebration
function createFireworks() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createFirework(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 500);
    }
}

// Create a single firework
function createFirework(color) {
    const firework = document.createElement('div');
    firework.style.position = 'fixed';
    firework.style.left = `${Math.random() * 100}%`;
    firework.style.top = `${Math.random() * 100}%`;
    firework.style.width = '5px';
    firework.style.height = '5px';
    firework.style.background = color;
    firework.style.borderRadius = '50%';
    firework.style.boxShadow = `0 0 10px ${color}`;
    firework.style.zIndex = '999';
    
    document.body.appendChild(firework);
    
    // Animate firework explosion
    firework.animate([
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(20)', opacity: 0 }
    ], {
        duration: 1000,
        easing: 'ease-out'
    });
    
    // Remove firework after animation
    setTimeout(() => {
        firework.remove();
    }, 1000);
}

// Create confetti celebration
function createConfetti() {
    const confettiCount = 200;
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 10);
    }
}

// Create a single confetti piece
function createConfettiPiece(color) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = '-10px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.background = color;
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%';
    confetti.style.zIndex = '999';
    
    document.body.appendChild(confetti);
    
    // Animate confetti falling
    const animation = confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'cubic-bezier(0.1, 0.8, 0.1, 1)'
    });
    
    // Remove confetti after animation
    animation.onfinish = () => {
        confetti.remove();
    };
}

// Handle page visibility change (for music)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        backgroundMusic.pause();
        celebrationMusic.pause();
    } else {
        // Don't auto-resume, let user control music
    }
});

// Add click effects for stars
document.addEventListener('click', function(e) {
    createClickStar(e.clientX, e.clientY);
});

// Create star effect on click
function createClickStar(x, y) {
    const star = document.createElement('div');
    star.style.position = 'fixed';
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.style.width = '0px';
    star.style.height = '0px';
    star.style.borderRadius = '50%';
    star.style.background = 'radial-gradient(circle, #fff, #ff6b6b)';
    star.style.zIndex = '1000';
    star.style.pointerEvents = 'none';
    
    document.body.appendChild(star);
    
    // Animate star
    star.animate([
        { width: '0px', height: '0px', opacity: 1 },
        { width: '100px', height: '100px', opacity: 0 }
    ], {
        duration: 1000,
        easing: 'ease-out'
    });
    
    // Remove star after animation
    setTimeout(() => {
        star.remove();
    }, 1000);
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', initWebsite);
