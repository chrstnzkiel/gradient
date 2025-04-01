/**
 * loader.js - Handles the loading screen animation and transition
 */

class LoaderManager {
    static get CONSTANTS() {
        return {
            LOADING_DURATION: 2500,
            FADE_OUT_DURATION: 800,
            ANIMATION_INTERVAL: 30,
            PARTICLE_COUNT: 25,
        };
    }
    
    constructor() {
        try {
            this.loadingScreen = document.getElementById('loading-screen');
            this.mainContent = document.getElementById('main-content');
            
            if (!this.loadingScreen || !this.mainContent) {
                throw new Error('Required loading screen elements not found');
            }
            
            this.loadingDuration = LoaderManager.CONSTANTS.LOADING_DURATION;
            this.particles = [];
            this.animationFrame = null;
            
            this.init();
        } catch (error) {
            console.error('LoaderManager initialization failed:', error);
            this.handleLoaderError();
        }
    }
    
    init() {
        try {
            this.createEnhancedLoadingAnimation();
            
            document.addEventListener('DOMContentLoaded', () => {
                this.startLoadingSequence();
            });
        } catch (error) {
            console.error('Error during loader initialization:', error);
            this.handleLoaderError();
        }
    }
    
    createEnhancedLoadingAnimation() {
        try {
            const animationContainer = document.createElement('div');
            animationContainer.className = 'loader-animation-container';
            
            for (let i = 0; i < LoaderManager.CONSTANTS.PARTICLE_COUNT; i++) {
                const particle = document.createElement('div');
                particle.className = 'loader-particle';
                
                const size = 5 + Math.random() * 15;
                const posX = 50 + (Math.random() - 0.5) * 80;
                const posY = 50 + (Math.random() - 0.5) * 80;
                const depth = Math.random();
                
                const hue = Math.floor(Math.random() * 60) + 220;
                
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${posX}%`;
                particle.style.top = `${posY}%`;
                particle.style.backgroundColor = `hsla(${hue}, 80%, 60%, ${0.4 + depth * 0.5})`;
                particle.style.transform = `scale(${0.6 + depth * 0.8})`;
                particle.style.animationDuration = `${3 + Math.random() * 3}s`;
                particle.style.animationDelay = `${Math.random() * 2}s`;
                
                this.particles.push({
                    element: particle,
                    posX,
                    posY,
                    depth,
                    speed: 0.3 + Math.random() * 0.7,
                    angle: Math.random() * Math.PI * 2,
                    size
                });
                
                animationContainer.appendChild(particle);
            }
            
            const loaderText = document.createElement('div');
            loaderText.className = 'loader-text';
            loaderText.textContent = 'LOADING';
            animationContainer.appendChild(loaderText);
            
            const pulsingCircle = document.createElement('div');
            pulsingCircle.className = 'pulsing-circle';
            animationContainer.appendChild(pulsingCircle);
            
            while (this.loadingScreen.firstChild) {
                this.loadingScreen.removeChild(this.loadingScreen.firstChild);
            }
            
            this.loadingScreen.appendChild(animationContainer);
            
            const progressContainer = document.createElement('div');
            progressContainer.className = 'progress-container';
            
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressContainer.appendChild(progressBar);
            
            this.loadingScreen.appendChild(progressContainer);
            this.progressBar = progressBar;
            
            this.animateParticles();
        } catch (error) {
            console.error('Error creating enhanced loading animation:', error);
            this.createSimpleLoader();
        }
    }
    
    createSimpleLoader() {
        const simpleLoader = document.createElement('div');
        simpleLoader.className = 'loader';
        
        const loaderText = document.createElement('p');
        loaderText.textContent = 'Loading...';
        
        while (this.loadingScreen.firstChild) {
            this.loadingScreen.removeChild(this.loadingScreen.firstChild);
        }
        
        this.loadingScreen.appendChild(simpleLoader);
        this.loadingScreen.appendChild(loaderText);
    }
    
    animateParticles() {
        try {
            let progress = 0;
            const totalFrames = this.loadingDuration / LoaderManager.CONSTANTS.ANIMATION_INTERVAL;
            let frameCount = 0;
            
            const updateAnimation = () => {
                this.particles.forEach(particle => {
                    particle.angle += particle.speed * 0.02;
                    
                    const orbitRadius = 20 * particle.depth;
                    const newX = particle.posX + Math.cos(particle.angle) * orbitRadius;
                    const newY = particle.posY + Math.sin(particle.angle) * orbitRadius;
                    
                    particle.element.style.left = `${newX}%`;
                    particle.element.style.top = `${newY}%`;
                    
                    const sizePulse = 1 + 0.2 * Math.sin(progress * 0.1);
                    particle.element.style.transform = `scale(${(0.6 + particle.depth * 0.8) * sizePulse})`;
                });
                
                frameCount++;
                progress = Math.min(100, (frameCount / totalFrames) * 100);
                if (this.progressBar) {
                    this.progressBar.style.width = `${progress}%`;
                }
                
                if (frameCount < totalFrames) {
                    this.animationFrame = setTimeout(updateAnimation, LoaderManager.CONSTANTS.ANIMATION_INTERVAL);
                }
            };
            
            updateAnimation();
        } catch (error) {
            console.error('Error in loading animation:', error);
            if (this.animationFrame) {
                clearTimeout(this.animationFrame);
            }
        }
    }
    
    startLoadingSequence() {
        try {
            this.loadingScreen.style.opacity = '1';
            this.mainContent.style.opacity = '0';
            
            setTimeout(() => {
                this.completeLoading();
            }, this.loadingDuration);
        } catch (error) {
            console.error('Error starting loading sequence:', error);
            this.handleLoaderError();
        }
    }
    
    completeLoading() {
        try {
            this.addCompletionAnimation();
            
            this.loadingScreen.style.opacity = '0';
            
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                
                this.mainContent.style.opacity = '1';
                
                if (!window.gradientManager) {
                    console.log('Initializing gradient manager after load');
                    window.gradientManager = new GradientManager();
                }
                
                this.dispatchLoadingCompleteEvent();
                
                if (this.animationFrame) {
                    clearTimeout(this.animationFrame);
                }
            }, LoaderManager.CONSTANTS.FADE_OUT_DURATION);
        } catch (error) {
            console.error('Error completing loading sequence:', error);
            this.handleLoaderError();
        }
    }
    
    addCompletionAnimation() {
        try {
            const flourish = document.createElement('div');
            flourish.className = 'completion-flourish';
            this.loadingScreen.appendChild(flourish);
            
            for (let i = 0; i < 3; i++) {
                const ripple = document.createElement('div');
                ripple.className = 'completion-ripple';
                ripple.style.animationDelay = `${i * 0.15}s`;
                this.loadingScreen.appendChild(ripple);
            }
        } catch (error) {
            console.error('Error adding completion animation:', error);
        }
    }
    
    dispatchLoadingCompleteEvent() {
        try {
            const loadingCompleteEvent = new CustomEvent('loadingComplete');
            document.dispatchEvent(loadingCompleteEvent);
        } catch (error) {
            console.error('Error dispatching loading complete event:', error);
        }
    }
    
    handleLoaderError() {
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'none';
        }
        
        if (this.mainContent) {
            this.mainContent.style.opacity = '1';
        }
        
        try {
            const loadingCompleteEvent = new CustomEvent('loadingComplete');
            document.dispatchEvent(loadingCompleteEvent);
        } catch (e) {
            console.error('Failed to recover from loader error:', e);
        }
    }
}

const loaderManager = new LoaderManager();