/**
 * app.js - Main application logic that coordinates all components
 * 
 * This file handles:
 * - Initialization of all components
 * - Error handling
 * - Event coordination
 */

class App {
    constructor() {
        // Flag to track initialization state
        this.initialized = false;
        
        // Store component references
        this.components = {
            gradient: null,
            waveAnimation: null,
            loader: null
        };
        
        // Initialize the application
        this.init();
    }
    
    init() {
        try {
            console.log('Initializing Interactive Gradient Background application...');
            
            // Set up error handling
            window.addEventListener('error', this.handleError.bind(this));
            
            // Listen for loading complete event
            document.addEventListener('loadingComplete', () => {
                this.onLoadingComplete();
            });
            
            // Initialize components when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.initializeComponents();
                });
            } else {
                // DOM already loaded
                this.initializeComponents();
            }
            
            // Handle window resize events
            window.addEventListener('resize', this.handleResize.bind(this));
            
            // Apply interactive behaviors
            this.setupInteractions();
            
            console.log('App initialization completed successfully');
        } catch (error) {
            this.handleError(error);
        }
    }
    
    initializeComponents() {
        try {
            // Verify DOM elements exist before initializing
            this.verifyRequiredElements();
            
            // Initialize gradient component if not already done by the script order
            if (window.gradientManager) {
                console.log('Gradient Manager already initialized');
                this.components.gradient = window.gradientManager;
            }
            
            // Initialize wave animation component if not already done by the script order
            if (window.waveAnimationManager) {
                console.log('Wave Animation Manager already initialized');
                this.components.waveAnimation = window.waveAnimationManager;
            }
            
            this.initialized = true;
        } catch (error) {
            this.handleError(error);
        }
    }
    
    verifyRequiredElements() {
        const requiredElements = [
            'gradient-canvas',
            'background-gradient',
            'loading-screen',
            'main-content',
            'change-gradient'
        ];
        
        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            throw new Error(`Missing required DOM elements: ${missingElements.join(', ')}`);
        }
    }
    
    onLoadingComplete() {
        console.log('Loading complete, initializing interactive features');
        try {
            // Initialize any features that should start after loading
            if (this.components.gradient) {
                // Start gradient animations
                console.log('Starting gradient animations');
            }
            
            if (this.components.waveAnimation) {
                // Ensure wave animations are running
                console.log('Wave animation running');
            }
            
            // Add classes for animations that should occur after loading
            document.querySelector('.controls').classList.add('active');
            
        } catch (error) {
            this.handleError(error);
        }
    }
    
    setupInteractions() {
        try {
            // Double click on canvas to regenerate wave animation
            const canvas = document.getElementById('gradient-canvas');
            canvas.addEventListener('dblclick', () => {
                if (this.components.waveAnimation) {
                    this.components.waveAnimation.createWaveLayers();
                }
            });
            
            // Provide user with instructions
            console.info('Interactive Gradient Background ready:');
            console.info('- Click "Change Gradient" to cycle through gradient presets');
            console.info('- Double-click on the background to regenerate wave animations');
            console.info('- Move mouse to interact with the waves and gradient highlights');
        } catch (error) {
            this.handleError(error);
        }
    }
    
    handleResize() {
        // Handle resize events if needed
        if (this.components.waveAnimation) {
            // Recalculate wave paths on resize
            console.log('Window resized, adjusting wave animations');
            this.components.waveAnimation.createWaveLayers();
        }
    }
    
    handleError(error) {
        // Log error to console with detailed information
        console.error('Application Error:', error.message);
        console.error('Stack trace:', error.stack);
        
        // Display user-friendly error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <h3>Something went wrong</h3>
            <p>We encountered an error while setting up the interactive background.</p>
            <p>Error: ${error.message}</p>
            <button onclick="location.reload()">Reload Page</button>
        `;
        
        // Style the error message
        errorMessage.style.position = 'fixed';
        errorMessage.style.top = '20px';
        errorMessage.style.left = '50%';
        errorMessage.style.transform = 'translateX(-50%)';
        errorMessage.style.backgroundColor = 'rgba(255,0,0,0.8)';
        errorMessage.style.color = 'white';
        errorMessage.style.padding = '20px';
        errorMessage.style.borderRadius = '8px';
        errorMessage.style.zIndex = '1001';
        errorMessage.style.textAlign = 'center';
        
        // Add to document
        document.body.appendChild(errorMessage);
        
        // Try to recover if possible
        this.attemptRecovery(error);
        
        return true; // Prevent default error handling
    }
    
    attemptRecovery(error) {
        // Attempt to recover from common errors
        if (error.message.includes('undefined is not an object') || 
            error.message.includes('null')) {
            console.log('Attempting to recover from initialization error...');
            
            // If error is related to DOM elements not being found, retry after a delay
            setTimeout(() => {
                this.initializeComponents();
            }, 1000);
        }
    }
}

// Initialize the application
const app = new App();