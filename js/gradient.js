/**
 * gradient.js - Handles SVG gradient effects and animations
 */

class GradientManager {
    constructor() {
        this.svg = document.getElementById('gradient-canvas');
        this.defs = this.svg.querySelector('defs');
        this.mainGradient = document.getElementById('background-gradient');
        this.gradientRect = this.svg.querySelector('rect');
        this.changeGradientButton = document.getElementById('change-gradient');
        
        // Available gradient presets
        this.gradientPresets = [
            // Violet Dream
            {
                name: 'Violet Dream',
                stops: [
                    { offset: '0%', color: '#4158D0' },
                    { offset: '50%', color: '#C850C0' },
                    { offset: '100%', color: '#FFCC70' }
                ],
                angle: 135
            },
            // Ocean Breeze
            {
                name: 'Ocean Breeze',
                stops: [
                    { offset: '0%', color: '#0093E9' },
                    { offset: '50%', color: '#42C2FF' },
                    { offset: '100%', color: '#80D0C7' }
                ],
                angle: 90
            },
            // Sunset Vibes
            {
                name: 'Sunset Vibes',
                stops: [
                    { offset: '0%', color: '#FF3CAC' },
                    { offset: '50%', color: '#784BA0' },
                    { offset: '100%', color: '#2B86C5' }
                ],
                angle: 225
            },
            // Emerald Forest
            {
                name: 'Emerald Forest',
                stops: [
                    { offset: '0%', color: '#004D40' },
                    { offset: '50%', color: '#00897B' },
                    { offset: '100%', color: '#B2DFDB' }
                ],
                angle: 180
            },
            // Coral Reef
            {
                name: 'Coral Reef',
                stops: [
                    { offset: '0%', color: '#FF7E5F' },
                    { offset: '50%', color: '#FF9966' },
                    { offset: '100%', color: '#FFCF9C' }
                ],
                angle: 45
            },
            // Northern Lights
            {
                name: 'Northern Lights',
                stops: [
                    { offset: '0%', color: '#43cea2' },
                    { offset: '50%', color: '#185a9d' },
                    { offset: '100%', color: '#111F4D' }
                ],
                angle: 315
            },
            // Cosmic Purple
            {
                name: 'Cosmic Purple',
                stops: [
                    { offset: '0%', color: '#8E2DE2' },
                    { offset: '25%', color: '#6A14F1' },
                    { offset: '50%', color: '#8214B3' },
                    { offset: '75%', color: '#AA0BB7' },
                    { offset: '100%', color: '#4A00E0' }
                ],
                angle: 225
            },
            // Golden Horizon
            {
                name: 'Golden Horizon',
                stops: [
                    { offset: '0%', color: '#F2994A' },
                    { offset: '25%', color: '#F9C449' },
                    { offset: '50%', color: '#F7B733' },
                    { offset: '75%', color: '#ED8F03' },
                    { offset: '100%', color: '#FC4A1A' }
                ],
                angle: 90
            },
            // Deep Ocean
            {
                name: 'Deep Ocean',
                stops: [
                    { offset: '0%', color: '#000428' },
                    { offset: '20%', color: '#001C53' },
                    { offset: '40%', color: '#003087' },
                    { offset: '60%', color: '#0050AB' },
                    { offset: '80%', color: '#0078D4' },
                    { offset: '100%', color: '#004e92' }
                ],
                angle: 135
            },
            // Neon City
            {
                name: 'Neon City',
                stops: [
                    { offset: '0%', color: '#FE01FC' },
                    { offset: '25%', color: '#AE18FF' },
                    { offset: '50%', color: '#01FFFF' },
                    { offset: '75%', color: '#00FF74' },
                    { offset: '100%', color: '#FE01FC' }
                ],
                angle: 45
            },
            // Aurora Sky
            {
                name: 'Aurora Sky',
                stops: [
                    { offset: '0%', color: '#1e3c72' },
                    { offset: '20%', color: '#2a5298' },
                    { offset: '40%', color: '#3674cb' },
                    { offset: '60%', color: '#5d93e1' },
                    { offset: '80%', color: '#6699ff' },
                    { offset: '100%', color: '#2a5298' }
                ],
                angle: 315
            },
            // Rainbow Fusion
            {
                name: 'Rainbow Fusion',
                stops: [
                    { offset: '0%', color: '#FF0000' },
                    { offset: '16.6%', color: '#FF8F00' },
                    { offset: '33.3%', color: '#FFFF00' },
                    { offset: '50%', color: '#00FF00' },
                    { offset: '66.6%', color: '#00FFFF' },
                    { offset: '83.3%', color: '#0000FF' },
                    { offset: '100%', color: '#8B00FF' }
                ],
                angle: 180
            }
        ];
        
        // Available transition effects
        this.transitionEffects = [
            'fade',           // Simple fade transition
            'radialExpand',   // Expand from center
            'sweep',          // Sweep from left to right
            'blinds',         // Vertical blinds effect
            'pixelate',       // Pixelate effect
            'ripple',         // Ripple effect
            'spiral'          // Spiral transition
        ];
        
        // Current gradient index
        this.currentGradientIndex = 0;
        
        // Current transition effect index
        this.currentTransitionIndex = 0;
        
        // Keep track of transition animations
        this.transitionElements = [];
        
        // Track ongoing animation frames for proper cancelation
        this.animationFrameIds = {};
        
        // Flag to track if a transition is in progress
        this.transitionInProgress = false;
        
        this.init();
    }
    
    init() {
        // Apply initial gradient
        this.applyGradient(this.gradientPresets[0]);
        
        // Set up event listeners
        document.getElementById('change-gradient').addEventListener('click', () => {
            this.changeGradient();
        });
        
        // Set up animations for the gradient
        this.setupAnimations();
    }
    
    applyGradient(gradientPreset) {
        // Calculate x and y positions based on angle for linearGradient
        const angle = gradientPreset.angle * (Math.PI / 180);
        const x1 = 50 - 50 * Math.cos(angle) + '%';
        const y1 = 50 - 50 * Math.sin(angle) + '%';
        const x2 = 50 + 50 * Math.cos(angle) + '%';
        const y2 = 50 + 50 * Math.sin(angle) + '%';
        
        // Update the gradient attributes
        this.mainGradient.setAttribute('x1', x1);
        this.mainGradient.setAttribute('y1', y1);
        this.mainGradient.setAttribute('x2', x2);
        this.mainGradient.setAttribute('y2', y2);
        
        // Remove existing stops
        while (this.mainGradient.firstChild) {
            this.mainGradient.removeChild(this.mainGradient.firstChild);
        }
        
        // Add new stops
        gradientPreset.stops.forEach(stop => {
            const stopEl = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stopEl.setAttribute('offset', stop.offset);
            stopEl.setAttribute('stop-color', stop.color);
            this.mainGradient.appendChild(stopEl);
        });
        
        // Update button style to ensure it contrasts with the current gradient
        this.updateButtonStyle(gradientPreset.stops.map(stop => stop.color));
        
        // Emit gradient changed event with the new colors
        this.emitGradientChangedEvent(gradientPreset.stops.map(stop => stop.color));
    }
    
    // Calculate the average brightness of the gradient colors
    calculateAverageBrightness(colors) {
        let totalBrightness = 0;
        
        colors.forEach(color => {
            // Extract RGB components
            let r, g, b;
            
            // Handle hex colors
            if (color.startsWith('#')) {
                r = parseInt(color.slice(1, 3), 16);
                g = parseInt(color.slice(3, 5), 16);
                b = parseInt(color.slice(5, 7), 16);
            } 
            // Handle rgb/rgba colors
            else if (color.startsWith('rgb')) {
                const values = color.match(/\d+/g).map(Number);
                r = values[0];
                g = values[1];
                b = values[2];
            } 
            else {
                // Default fallback if color format isn't recognized
                r = g = b = 128;
            }
            
            // Calculate perceived brightness using the formula:
            // (0.299*R + 0.587*G + 0.114*B)
            // This formula considers human eye sensitivity to different colors
            const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            totalBrightness += brightness;
        });
        
        // Return average brightness between 0 and 1
        return totalBrightness / colors.length;
    }
    
    // Generate a color that contrasts with the gradient
    generateContrastColor(colors) {
        const brightness = this.calculateAverageBrightness(colors);
        
        // For darker gradients, use bright button colors
        // For lighter gradients, use darker button colors
        if (brightness < 0.5) {
            // For dark backgrounds - create a bright button with dark text
            return {
                background: 'rgba(255, 255, 255, 0.85)',
                text: '#000000',
                border: 'none',
                glow: '0 0 15px rgba(255, 255, 255, 0.7)'
            };
        } else {
            // For light backgrounds - create a dark button with light text
            return {
                background: 'rgba(0, 0, 0, 0.75)',
                text: '#ffffff',
                border: 'none',
                glow: '0 0 15px rgba(0, 0, 0, 0.7)'
            };
        }
    }
    
    // Update the button style based on the current gradient
    updateButtonStyle(colors) {
        if (!this.changeGradientButton) return;
        
        const contrastStyle = this.generateContrastColor(colors);
        
        // Apply the styles to the button
        this.changeGradientButton.style.background = contrastStyle.background;
        this.changeGradientButton.style.color = contrastStyle.text;
        this.changeGradientButton.style.border = contrastStyle.border;
        this.changeGradientButton.style.boxShadow = contrastStyle.glow;
        
        // Update the after pseudo-element background color
        const buttonStyle = document.createElement('style');
        buttonStyle.innerHTML = `
            #change-gradient::after {
                background: ${contrastStyle.text === '#000000' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
            }
        `;
        
        // Remove any previous style element we might have added
        const oldStyle = document.getElementById('button-dynamic-style');
        if (oldStyle) {
            oldStyle.remove();
        }
        
        // Add the new style element with an ID so we can find it later
        buttonStyle.id = 'button-dynamic-style';
        document.head.appendChild(buttonStyle);
    }
    
    emitGradientChangedEvent(colors) {
        // Create and dispatch custom event with gradient colors
        const event = new CustomEvent('gradientChanged', {
            detail: {
                colors: colors
            }
        });
        document.dispatchEvent(event);
    }
    
    changeGradient() {
        // If a transition is already in progress, finish it immediately
        if (this.transitionInProgress) {
            this.finishCurrentTransition();
        }
        
        // Cycle through gradient presets
        this.currentGradientIndex = (this.currentGradientIndex + 1) % this.gradientPresets.length;
        
        // Cycle through transition effects
        this.currentTransitionIndex = (this.currentTransitionIndex + 1) % this.transitionEffects.length;
        
        // Get next gradient and transition effect
        const nextGradient = this.gradientPresets[this.currentGradientIndex];
        const transition = this.transitionEffects[this.currentTransitionIndex];
        
        // Apply next gradient with the selected transition effect
        this.applyGradientWithTransition(nextGradient, transition);
    }
    
    finishCurrentTransition() {
        // Cancel all active animation frames
        Object.values(this.animationFrameIds).forEach(id => {
            if (id) {
                cancelAnimationFrame(id);
            }
        });
        this.animationFrameIds = {};
        
        // Apply current gradient immediately and clean up
        const currentGradient = this.gradientPresets[this.currentGradientIndex];
        this.applyGradient(currentGradient);
        this.cleanupTransitionElements();
    }
    
    applyGradientWithTransition(gradientPreset, transitionEffect) {
        // Set transition in progress flag
        this.transitionInProgress = true;
        
        // Clean up any existing transition elements
        this.cleanupTransitionElements();
        
        // Apply the transition effect
        switch(transitionEffect) {
            case 'radialExpand':
                this.transitionRadialExpand(gradientPreset);
                break;
            case 'sweep':
                this.transitionSweep(gradientPreset);
                break;
            case 'blinds':
                this.transitionBlinds(gradientPreset);
                break;
            case 'pixelate':
                this.transitionPixelate(gradientPreset);
                break;
            case 'ripple':
                this.transitionRipple(gradientPreset);
                break;
            case 'spiral':
                this.transitionSpiral(gradientPreset);
                break;
            case 'fade':
            default:
                this.transitionFade(gradientPreset);
                break;
        }
        
        // Show transition name as a temporary notification
        this.showTransitionNotification(transitionEffect, gradientPreset.name);
    }
    
    showTransitionNotification(effect, gradientName) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('gradient-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'gradient-notification';
            document.body.appendChild(notification);
            
            // Style the notification
            notification.style.position = 'fixed';
            notification.style.bottom = '80px';
            notification.style.left = '50%';
            notification.style.transform = 'translateX(-50%)';
            notification.style.backgroundColor = 'rgba(0,0,0,0.7)';
            notification.style.color = 'white';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '20px';
            notification.style.fontFamily = 'Arial, sans-serif';
            notification.style.fontSize = '14px';
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            notification.style.zIndex = '1000';
        }
        
        // Update notification text
        notification.textContent = `${gradientName} - ${effect} effect`;
        
        // Show and then hide the notification
        notification.style.opacity = '1';
        setTimeout(() => {
            notification.style.opacity = '0';
        }, 2000);
    }
    
    cleanupTransitionElements() {
        // Remove any transition elements
        this.transitionElements.forEach(el => {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        this.transitionElements = [];
        
        // Reset transition flag
        this.transitionInProgress = false;
    }
    
    transitionFade(gradientPreset) {
        // Simple fade transition
        this.gradientRect.style.opacity = '0';
        
        setTimeout(() => {
            // Apply new gradient
            this.applyGradient(gradientPreset);
            
            // Fade in new gradient
            this.gradientRect.style.opacity = '1';
        }, 500);
    }
    
    transitionRadialExpand(gradientPreset) {
        const svgWidth = this.svg.clientWidth;
        const svgHeight = this.svg.clientHeight;
        
        // Calculate the diagonal length for proper expansion coverage
        const maxDiagonal = Math.sqrt((svgWidth * svgWidth) + (svgHeight * svgHeight));
        const maxRadiusPercent = (maxDiagonal / Math.min(svgWidth, svgHeight)) * 100;
        
        // Create a radial gradient for the transition
        const transitionGradId = 'transition-gradient-radial';
        const transitionGrad = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
        transitionGrad.setAttribute('id', transitionGradId);
        transitionGrad.setAttribute('cx', '50%');
        transitionGrad.setAttribute('cy', '50%');
        transitionGrad.setAttribute('r', '0%');
        
        // Add stops to the radial gradient
        gradientPreset.stops.forEach(stop => {
            const stopEl = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stopEl.setAttribute('offset', stop.offset);
            stopEl.setAttribute('stop-color', stop.color);
            transitionGrad.appendChild(stopEl);
        });
        
        this.defs.appendChild(transitionGrad);
        
        // Create overlay rectangle with the new radial gradient
        const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        overlay.setAttribute('width', '100%');
        overlay.setAttribute('height', '100%');
        overlay.setAttribute('fill', `url(#${transitionGradId})`);
        
        this.svg.appendChild(overlay);
        this.transitionElements.push(overlay);
        this.transitionElements.push(transitionGrad);
        
        // Animate the radius expansion with better timing and completion handling
        let radius = 0;
        let lastTimestamp = null;
        
        const animateRadius = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const elapsed = timestamp - lastTimestamp;
            lastTimestamp = timestamp;
            
            // Smooth animation speed regardless of frame rate (2% per 16ms)
            const increment = Math.min(5, (elapsed / 16) * 2);
            radius += increment;
            transitionGrad.setAttribute('r', `${radius}%`);
            
            if (radius < maxRadiusPercent * 1.1) { // Extra 10% to ensure complete coverage
                this.animationFrameIds.radial = requestAnimationFrame(animateRadius);
            } else {
                // Animation complete, apply the actual gradient and ensure clean state
                setTimeout(() => {
                    // Double check that the gradient is fully applied
                    this.applyGradient(gradientPreset);
                    delete this.animationFrameIds.radial;
                    this.cleanupTransitionElements();
                }, 50); // Small delay to ensure rendering is complete
            }
        };
        
        // Start the animation
        this.animationFrameIds.radial = requestAnimationFrame(animateRadius);
    }
    
    transitionSweep(gradientPreset) {
        // Create a clip path for the sweep effect
        const clipPathId = 'sweep-clip-path';
        const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', clipPathId);
        
        // Create a rectangle that will be animated for the sweep
        const clipRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        clipRect.setAttribute('x', '-100%');
        clipRect.setAttribute('y', '0');
        clipRect.setAttribute('width', '100%');
        clipRect.setAttribute('height', '100%');
        clipPath.appendChild(clipRect);
        
        this.defs.appendChild(clipPath);
        
        // Create an overlay with the new gradient
        const tempGradientId = 'temp-sweep-gradient';
        const tempGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        tempGradient.setAttribute('id', tempGradientId);
        
        // Set gradient angle
        const angle = gradientPreset.angle * (Math.PI / 180);
        tempGradient.setAttribute('x1', 50 - 50 * Math.cos(angle) + '%');
        tempGradient.setAttribute('y1', 50 - 50 * Math.sin(angle) + '%');
        tempGradient.setAttribute('x2', 50 + 50 * Math.cos(angle) + '%');
        tempGradient.setAttribute('y2', 50 + 50 * Math.sin(angle) + '%');
        
        // Add stops
        gradientPreset.stops.forEach(stop => {
            const stopEl = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stopEl.setAttribute('offset', stop.offset);
            stopEl.setAttribute('stop-color', stop.color);
            tempGradient.appendChild(stopEl);
        });
        
        this.defs.appendChild(tempGradient);
        
        // Create overlay rectangle
        const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        overlay.setAttribute('width', '100%');
        overlay.setAttribute('height', '100%');
        overlay.setAttribute('fill', `url(#${tempGradientId})`);
        overlay.setAttribute('clip-path', `url(#${clipPathId})`);
        
        this.svg.appendChild(overlay);
        
        // Track transition elements
        this.transitionElements.push(clipPath);
        this.transitionElements.push(tempGradient);
        this.transitionElements.push(overlay);
        
        // Animate the sweep with improved completion handling
        let position = -100;
        let lastTimestamp = null;
        
        const animateSweep = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const elapsed = timestamp - lastTimestamp;
            lastTimestamp = timestamp;
            
            // Smooth animation speed
            const increment = Math.min(6, (elapsed / 16) * 3);
            position += increment;
            clipRect.setAttribute('x', `${position}%`);
            
            if (position < 100) {
                this.animationFrameIds.sweep = requestAnimationFrame(animateSweep);
            } else {
                // When sweep is complete, apply the actual gradient
                setTimeout(() => {
                    this.applyGradient(gradientPreset);
                    delete this.animationFrameIds.sweep;
                    this.cleanupTransitionElements();
                }, 50);
            }
        };
        
        // Start the animation
        this.animationFrameIds.sweep = requestAnimationFrame(animateSweep);
    }
    
    transitionBlinds(gradientPreset) {
        const numBlinds = 10;
        const blindWidth = 100 / numBlinds;
        
        // Create temporary gradient
        const tempGradientId = 'temp-blinds-gradient';
        const tempGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        tempGradient.setAttribute('id', tempGradientId);
        
        // Set gradient angle and stops
        const angle = gradientPreset.angle * (Math.PI / 180);
        tempGradient.setAttribute('x1', 50 - 50 * Math.cos(angle) + '%');
        tempGradient.setAttribute('y1', 50 - 50 * Math.sin(angle) + '%');
        tempGradient.setAttribute('x2', 50 + 50 * Math.cos(angle) + '%');
        tempGradient.setAttribute('y2', 50 + 50 * Math.sin(angle) + '%');
        
        gradientPreset.stops.forEach(stop => {
            const stopEl = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stopEl.setAttribute('offset', stop.offset);
            stopEl.setAttribute('stop-color', stop.color);
            tempGradient.appendChild(stopEl);
        });
        
        this.defs.appendChild(tempGradient);
        this.transitionElements.push(tempGradient);
        
        // Create a group for blinds
        const blindsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        blindsGroup.setAttribute('class', 'blinds-group');
        this.svg.appendChild(blindsGroup);
        this.transitionElements.push(blindsGroup);
        
        // Create individual blind rectangles
        const blinds = [];
        for (let i = 0; i < numBlinds; i++) {
            const blind = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            blind.setAttribute('x', `${i * blindWidth}%`);
            blind.setAttribute('y', '0');
            blind.setAttribute('width', `${blindWidth}%`);
            blind.setAttribute('height', '0%');
            blind.setAttribute('fill', `url(#${tempGradientId})`);
            blindsGroup.appendChild(blind);
            blinds.push(blind);
        }
        
        // Animate blinds opening with proper frame tracking
        let height = 0;
        let lastTimestamp = null;
        
        const animateBlinds = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const elapsed = timestamp - lastTimestamp;
            lastTimestamp = timestamp;
            
            // Smooth animation speed (2% per 16ms)
            const increment = Math.min(4, (elapsed / 16) * 2);
            height += increment;
            
            let complete = true;
            blinds.forEach((blind, index) => {
                // Stagger the blinds animation
                const delay = index * 2;
                const blindHeight = Math.max(0, Math.min(100, height - delay));
                blind.setAttribute('height', `${blindHeight}%`);
                
                if (blindHeight < 100) {
                    complete = false;
                }
            });
            
            if (!complete) {
                this.animationFrameIds.blinds = requestAnimationFrame(animateBlinds);
            } else {
                // Ensure animation completes before cleanup
                setTimeout(() => {
                    this.applyGradient(gradientPreset);
                    delete this.animationFrameIds.blinds;
                    this.cleanupTransitionElements();
                }, 50);
            }
        };
        
        // Start the animation
        this.animationFrameIds.blinds = requestAnimationFrame(animateBlinds);
    }
    
    transitionPixelate(gradientPreset) {
        const numCols = 20;
        const numRows = 15;
        const cellWidth = 100 / numCols;
        const cellHeight = 100 / numRows;
        
        // Create temporary gradient
        const tempGradientId = 'temp-pixel-gradient';
        const tempGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        tempGradient.setAttribute('id', tempGradientId);
        
        // Set gradient angle and stops
        const angle = gradientPreset.angle * (Math.PI / 180);
        tempGradient.setAttribute('x1', 50 - 50 * Math.cos(angle) + '%');
        tempGradient.setAttribute('y1', 50 - 50 * Math.sin(angle) + '%');
        tempGradient.setAttribute('x2', 50 + 50 * Math.cos(angle) + '%');
        tempGradient.setAttribute('y2', 50 + 50 * Math.sin(angle) + '%');
        
        gradientPreset.stops.forEach(stop => {
            const stopEl = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stopEl.setAttribute('offset', stop.offset);
            stopEl.setAttribute('stop-color', stop.color);
            tempGradient.appendChild(stopEl);
        });
        
        this.defs.appendChild(tempGradient);
        this.transitionElements.push(tempGradient);
        
        // Create a group for pixels
        const pixelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        pixelGroup.setAttribute('class', 'pixel-group');
        this.svg.appendChild(pixelGroup);
        this.transitionElements.push(pixelGroup);
        
        // Create grid of cells with improved animation tracking
        const cells = [];
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const cell = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                cell.setAttribute('x', `${col * cellWidth}%`);
                cell.setAttribute('y', `${row * cellHeight}%`);
                cell.setAttribute('width', '0%');
                cell.setAttribute('height', '0%');
                cell.setAttribute('fill', `url(#${tempGradientId})`);
                
                pixelGroup.appendChild(cell);
                cells.push({
                    element: cell,
                    row,
                    col,
                    delay: Math.random() * 30,
                    growing: true
                });
            }
        }
        
        // Animate cells with proper frame tracking
        let time = 0;
        let lastTimestamp = null;
        
        const animateCells = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const elapsed = timestamp - lastTimestamp;
            lastTimestamp = timestamp;
            
            // Smooth animation speed
            time += elapsed * 0.1;
            
            let complete = true;
            cells.forEach(cell => {
                if (time > cell.delay) {
                    let width = parseFloat(cell.element.getAttribute('width')) || 0;
                    let height = parseFloat(cell.element.getAttribute('height')) || 0;
                    
                    if (cell.growing) {
                        // Smooth growth rate
                        const growth = Math.min(10, (elapsed / 16) * 5);
                        width = Math.min(cellWidth, width + growth);
                        height = Math.min(cellHeight, height + growth);
                        
                        cell.element.setAttribute('width', `${width}%`);
                        cell.element.setAttribute('height', `${height}%`);
                        
                        if (width >= cellWidth && height >= cellHeight) {
                            cell.growing = false;
                        } else {
                            complete = false;
                        }
                    }
                } else {
                    complete = false;
                }
            });
            
            if (!complete) {
                this.animationFrameIds.pixelate = requestAnimationFrame(animateCells);
            } else {
                // Ensure animation completes before cleanup
                setTimeout(() => {
                    this.applyGradient(gradientPreset);
                    delete this.animationFrameIds.pixelate;
                    this.cleanupTransitionElements();
                }, 50);
            }
        };
        
        // Start the animation
        this.animationFrameIds.pixelate = requestAnimationFrame(animateCells);
    }
    
    transitionRipple(gradientPreset) {
        const svgWidth = this.svg.clientWidth;
        const svgHeight = this.svg.clientHeight;
        
        // Calculate proper maximum radius based on screen size
        const maxRadius = Math.sqrt(svgWidth * svgWidth + svgHeight * svgHeight) / 2;
        const numRipples = 5;
        
        // Create temporary gradient
        const tempGradientId = 'temp-ripple-gradient';
        const tempGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        tempGradient.setAttribute('id', tempGradientId);
        
        // Set gradient angle and stops
        const angle = gradientPreset.angle * (Math.PI / 180);
        tempGradient.setAttribute('x1', 50 - 50 * Math.cos(angle) + '%');
        tempGradient.setAttribute('y1', 50 - 50 * Math.sin(angle) + '%');
        tempGradient.setAttribute('x2', 50 + 50 * Math.cos(angle) + '%');
        tempGradient.setAttribute('y2', 50 + 50 * Math.sin(angle) + '%');
        
        gradientPreset.stops.forEach(stop => {
            const stopEl = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stopEl.setAttribute('offset', stop.offset);
            stopEl.setAttribute('stop-color', stop.color);
            tempGradient.appendChild(stopEl);
        });
        
        this.defs.appendChild(tempGradient);
        this.transitionElements.push(tempGradient);
        
        // Create ripple group
        const rippleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        rippleGroup.setAttribute('class', 'ripple-group');
        this.svg.appendChild(rippleGroup);
        this.transitionElements.push(rippleGroup);
        
        // Create ripple elements with improved tracking
        const ripples = [];
        for (let i = 0; i < numRipples; i++) {
            const clipPathId = `ripple-clip-${i}`;
            const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
            clipPath.setAttribute('id', clipPathId);
            this.defs.appendChild(clipPath);
            this.transitionElements.push(clipPath);
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', '50%');
            circle.setAttribute('cy', '50%');
            circle.setAttribute('r', '0');
            clipPath.appendChild(circle);
            
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('width', '100%');
            rect.setAttribute('height', '100%');
            rect.setAttribute('fill', `url(#${tempGradientId})`);
            rect.setAttribute('clip-path', `url(#${clipPathId})`);
            rippleGroup.appendChild(rect);
            
            ripples.push({
                circle,
                rect,
                delay: i * 15,
                radius: 0
            });
        }
        
        // Animate ripples with proper frame tracking
        let lastTimestamp = null;
        
        const animateRipples = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const elapsed = timestamp - lastTimestamp;
            lastTimestamp = timestamp;
            
            // Smooth animation speed
            const increment = Math.min(maxRadius / 30, (elapsed / 16) * (maxRadius / 60));
            
            let complete = true;
            ripples.forEach((ripple, index) => {
                if (ripple.delay <= 0) {
                    ripple.radius += increment;
                    if (ripple.radius <= maxRadius * 1.2) {
                        complete = false;
                        ripple.circle.setAttribute('r', ripple.radius);
                    }
                } else {
                    ripple.delay -= elapsed;
                    complete = false;
                }
            });
            
            if (!complete) {
                this.animationFrameIds.ripple = requestAnimationFrame(animateRipples);
            } else {
                // Ensure animation completes before cleanup
                setTimeout(() => {
                    this.applyGradient(gradientPreset);
                    delete this.animationFrameIds.ripple;
                    this.cleanupTransitionElements();
                }, 50);
            }
        };
        
        // Start the animation
        this.animationFrameIds.ripple = requestAnimationFrame(animateRipples);
    }
    
    transitionSpiral(gradientPreset) {
        const svgWidth = this.svg.clientWidth;
        const svgHeight = this.svg.clientHeight;
        
        // Create a group for the spiral elements
        const spiralGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        spiralGroup.setAttribute('class', 'spiral-group');
        this.svg.appendChild(spiralGroup);
        this.transitionElements.push(spiralGroup);
        
        // Create a clip path for masking
        const clipPathId = 'spiral-clip-path';
        const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', clipPathId);
        this.defs.appendChild(clipPath);
        this.transitionElements.push(clipPath);
        
        // Create clip path content - will be animated
        const clipPathContent = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        clipPathContent.setAttribute('d', 'M0,0');
        clipPath.appendChild(clipPathContent);
        
        // Create a temporary gradient for the spiral
        const tempGradientId = 'temp-spiral-gradient';
        const tempGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        tempGradient.setAttribute('id', tempGradientId);
        
        // Set gradient angle - making it dynamic based on animation
        const baseAngle = gradientPreset.angle * (Math.PI / 180);
        tempGradient.setAttribute('x1', 50 - 50 * Math.cos(baseAngle) + '%');
        tempGradient.setAttribute('y1', 50 - 50 * Math.sin(baseAngle) + '%');
        tempGradient.setAttribute('x2', 50 + 50 * Math.cos(baseAngle) + '%');
        tempGradient.setAttribute('y2', 50 + 50 * Math.sin(baseAngle) + '%');
        
        // Add stops with enhanced colors
        gradientPreset.stops.forEach((stop, index) => {
            const stopEl = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stopEl.setAttribute('offset', stop.offset);
            
            // Create more vibrant colors for the transition
            const color = this.enhanceColor(stop.color, 0.2);
            stopEl.setAttribute('stop-color', color);
            tempGradient.appendChild(stopEl);
        });
        
        this.defs.appendChild(tempGradient);
        this.transitionElements.push(tempGradient);
        
        // Create overlay rectangle with the spiral clip path
        const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        overlay.setAttribute('width', '100%');
        overlay.setAttribute('height', '100%');
        overlay.setAttribute('fill', `url(#${tempGradientId})`);
        overlay.setAttribute('clip-path', `url(#${clipPathId})`);
        
        spiralGroup.appendChild(overlay);
        
        // Parameters for the spiral
        const centerX = svgWidth / 2;
        const centerY = svgHeight / 2;
        const maxRadius = Math.max(svgWidth, svgHeight) * 1.5;
        let angle = 0;
        let radius = 0;
        const increment = 0.2; // Spiral tightness
        let pathData = `M ${centerX},${centerY} `;
        let lastTimestamp = null;
        
        // Animate the spiral drawing with proper frame tracking
        const animateSpiral = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const elapsed = timestamp - lastTimestamp;
            lastTimestamp = timestamp;
            
            // Smooth animation speed
            const angleIncrement = Math.min(0.2, (elapsed / 16) * 0.1);
            const radiusIncrement = Math.min(increment, (elapsed / 16) * 0.1);
            
            angle += angleIncrement;
            radius += radiusIncrement;
            
            if (radius <= maxRadius) {
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                
                // Add point to the path
                pathData += `L ${x},${y} `;
                clipPathContent.setAttribute('d', pathData);
                
                // Rotate the gradient for dynamic effect
                const rotatedAngle = baseAngle + angle * 0.02;
                tempGradient.setAttribute('x1', 50 - 50 * Math.cos(rotatedAngle) + '%');
                tempGradient.setAttribute('y1', 50 - 50 * Math.sin(rotatedAngle) + '%');
                tempGradient.setAttribute('x2', 50 + 50 * Math.cos(rotatedAngle) + '%');
                tempGradient.setAttribute('y2', 50 + 50 * Math.sin(rotatedAngle) + '%');
                
                // Shift colors during animation
                const stops = tempGradient.querySelectorAll('stop');
                if (stops.length > 0) {
                    const shiftAmount = Math.sin(angle * 0.05) * 0.1;
                    stops.forEach((stop, idx) => {
                        const currentColor = stop.getAttribute('stop-color');
                        const shiftedColor = this.shiftColor(currentColor, shiftAmount * (idx + 1));
                        stop.setAttribute('stop-color', shiftedColor);
                    });
                }
                
                this.animationFrameIds.spiral = requestAnimationFrame(animateSpiral);
            } else {
                // Complete the path by connecting back to center
                pathData += `L ${centerX},${centerY} `;
                clipPathContent.setAttribute('d', pathData);
                
                // Ensure animation completes before cleanup
                setTimeout(() => {
                    this.applyGradient(gradientPreset);
                    delete this.animationFrameIds.spiral;
                    this.cleanupTransitionElements();
                }, 300);
            }
        };
        
        // Start the animation
        this.animationFrameIds.spiral = requestAnimationFrame(animateSpiral);
    }
    
    // Helper function to enhance colors for transitions
    enhanceColor(color, amount) {
        // Check if the color is in hex format
        if (color.startsWith('#')) {
            // Convert hex to RGB
            let r = parseInt(color.slice(1, 3), 16);
            let g = parseInt(color.slice(3, 5), 16);
            let b = parseInt(color.slice(5, 7), 16);
            
            // Enhance saturation (simple method - make colors more vibrant)
            // This is a simplified approach, not true HSL conversion
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            
            // Only enhance if the color isn't already fully saturated
            if (max !== min) {
                const saturationIncrease = amount * (255 - (max - min));
                if (r !== max && r !== min) {
                    r = Math.max(0, Math.min(255, r + (r > 128 ? saturationIncrease : -saturationIncrease)));
                }
                if (g !== max && g !== min) {
                    g = Math.max(0, Math.min(255, g + (g > 128 ? saturationIncrease : -saturationIncrease)));
                }
                if (b !== max && b !== min) {
                    b = Math.max(0, Math.min(255, b + (b > 128 ? saturationIncrease : -saturationIncrease)));
                }
            }
            
            // Convert back to hex
            return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
        }
        
        // Handle RGB or RGBA colors
        if (color.startsWith('rgb')) {
            const values = color.match(/\d+/g).map(Number);
            if (values.length >= 3) {
                const r = values[0];
                const g = values[1];
                const b = values[2];
                const a = values.length === 4 ? values[3] : 1;
                
                // Same enhancement logic as above
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                
                let newR = r, newG = g, newB = b;
                if (max !== min) {
                    const saturationIncrease = amount * (255 - (max - min));
                    if (r !== max && r !== min) {
                        newR = Math.max(0, Math.min(255, r + (r > 128 ? saturationIncrease : -saturationIncrease)));
                    }
                    if (g !== max && g !== min) {
                        newG = Math.max(0, Math.min(255, g + (g > 128 ? saturationIncrease : -saturationIncrease)));
                    }
                    if (b !== max && b !== min) {
                        newB = Math.max(0, Math.min(255, b + (b > 128 ? saturationIncrease : -saturationIncrease)));
                    }
                }
                
                return values.length === 4 
                    ? `rgba(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)}, ${a})` 
                    : `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)})`;
            }
        }
        
        // If color format is not recognized, return original
        return color;
    }
    
    // Helper function to shift color hue for animations
    shiftColor(color, amount) {
        // Convert color to RGB
        let r, g, b, a = 1;
        
        // Handle hex colors
        if (color.startsWith('#')) {
            r = parseInt(color.slice(1, 3), 16);
            g = parseInt(color.slice(3, 5), 16);
            b = parseInt(color.slice(5, 7), 16);
        } 
        // Handle rgb/rgba colors
        else if (color.startsWith('rgb')) {
            const values = color.match(/\d+/g).map(Number);
            r = values[0];
            g = values[1];
            b = values[2];
            if (values.length === 4) {
                a = values[3];
            }
        } 
        // If color format not recognized, return original
        else {
            return color;
        }
        
        // Convert RGB to HSL - simplified version
        const max = Math.max(r, g, b) / 255;
        const min = Math.min(r, g, b) / 255;
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            if (max === r / 255) {
                h = (g / 255 - b / 255) / d + (g < b ? 6 : 0);
            } else if (max === g / 255) {
                h = (b / 255 - r / 255) / d + 2;
            } else {
                h = (r / 255 - g / 255) / d + 4;
            }
            h /= 6;
        }
        
        // Shift hue
        h = (h + amount) % 1;
        if (h < 0) h += 1;
        
        // Convert back to RGB - simplified
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        
        r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
        g = Math.round(hue2rgb(p, q, h) * 255);
        b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
        
        // Return in the appropriate format
        if (color.startsWith('#')) {
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        } else {
            return a !== 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
        }
    }
    
    setupAnimations() {
        // Create a subtle pulse animation for the gradient
        let time = 0;
        const animate = () => {
            time += 0.005;
            
            // Subtle modification to the gradient stops for animation
            const stops = this.mainGradient.querySelectorAll('stop');
            if (stops && stops.length >= 3) {
                // Create slight movement in the middle stop
                const middleOffset = 50 + 5 * Math.sin(time) + '%';
                stops[1].setAttribute('offset', middleOffset);
                
                // Add subtle color shifting to all stops for a more dynamic effect
                stops.forEach((stop, index) => {
                    if (index > 0 && index < stops.length - 1) {  // Only middle stops
                        const currentColor = stop.getAttribute('stop-color');
                        const shiftAmount = Math.sin(time + index * 0.5) * 0.02;
                        const shiftedColor = this.shiftColor(currentColor, shiftAmount);
                        stop.setAttribute('stop-color', shiftedColor);
                    }
                });
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    // Create a radial gradient overlay
    createRadialOverlay(posX, posY) {
        // Calculate position as percentage
        const x = (posX / window.innerWidth) * 100;
        const y = (posY / window.innerHeight) * 100;
        
        // Check if overlay already exists, remove if it does
        const existingOverlay = this.svg.querySelector('#radial-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Create radial gradient in defs
        const radialGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
        radialGradient.setAttribute('id', 'radial-highlight');
        radialGradient.setAttribute('cx', x + '%');
        radialGradient.setAttribute('cy', y + '%');
        radialGradient.setAttribute('r', '30%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', 'rgba(255,255,255,0.3)');
        stop1.setAttribute('stop-opacity', '0.5');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', 'rgba(255,255,255,0)');
        stop2.setAttribute('stop-opacity', '0');
        
        radialGradient.appendChild(stop1);
        radialGradient.appendChild(stop2);
        this.defs.appendChild(radialGradient);
        
        // Create overlay rectangle
        const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        overlay.setAttribute('id', 'radial-overlay');
        overlay.setAttribute('width', '100%');
        overlay.setAttribute('height', '100%');
        overlay.setAttribute('fill', 'url(#radial-highlight)');
        overlay.setAttribute('pointer-events', 'none');
        
        this.svg.appendChild(overlay);
    }
}

// Export the gradient manager instance
const gradientManager = new GradientManager();
window.gradientManager = gradientManager;
