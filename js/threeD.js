/**
 * waveAnimation.js - Handles wave animation for the SVG background
 * (Renamed from threeD.js but keeping the same filename for compatibility)
 */

class WaveAnimationManager {
    constructor() {
        this.svg = document.getElementById('gradient-canvas');
        this.defs = this.svg.querySelector('defs');
        this.waveGroups = [];
        this.numWaves = 4; // Number of wave layers
        this.wavePoints = 12; // Points per wave
        this.timeOffset = 0;
        this.fishes = []; // Array to hold all fish elements
        this.fishCount = 12; // Number of fish to generate
        this.fishTypes = ['normal', 'long', 'round']; // Different fish shapes
        this.currentGradientColors = ['#4158D0', '#C850C0', '#FFCC70']; // Default colors from first gradient
        
        this.init();
    }
    
    init() {
        // Create wave filters
        this.createWaveFilters();
        
        // Create wave layers
        this.createWaveLayers();
        
        // Create fish elements
        this.createFishes();
        
        // Initialize mouse movement tracking for interactive waves
        window.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });
        
        // Initialize touch movement tracking for mobile
        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                this.handleMouseMove(e.touches[0]);
            }
        });
        
        // Listen for gradient changes to update fish colors
        document.addEventListener('gradientChanged', (e) => {
            if (e.detail && e.detail.colors) {
                this.currentGradientColors = e.detail.colors;
                this.updateFishColors();
            }
        });
        
        // Start animation loop
        this.animate();
    }
    
    createWaveFilters() {
        // Create blur filters for waves
        for (let i = 0; i < this.numWaves; i++) {
            const filterId = `wave-blur-${i}`;
            
            // Create filter in defs
            const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            filter.setAttribute('id', filterId);
            
            const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
            feGaussianBlur.setAttribute('stdDeviation', (i + 1) * 0.5);
            filter.appendChild(feGaussianBlur);
            
            this.defs.appendChild(filter);
        }
    }
    
    createWaveLayers() {
        // Remove any existing wave elements
        this.waveGroups.forEach(group => {
            if (group && group.parentNode) {
                group.parentNode.removeChild(group);
            }
        });
        this.waveGroups = [];
        
        // Create group to contain all waves
        const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        mainGroup.setAttribute('class', 'wave-container');
        this.svg.appendChild(mainGroup);
        
        // Create multiple wave layers with different properties
        for (let i = 0; i < this.numWaves; i++) {
            const waveGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            waveGroup.setAttribute('class', 'wave-group');
            
            // Calculate wave properties based on layer index
            const opacity = 0.2 - (i * 0.04); // Decreasing opacity for deeper layers
            const amplitude = 20 - (i * 3); // Decreasing amplitude for deeper layers
            const frequency = 0.005 + (i * 0.002); // Increasing frequency for deeper layers
            const speed = 0.03 - (i * 0.005); // Decreasing speed for deeper layers
            const yPosition = 75 + (i * 8); // Position waves at different heights
            const color = i % 2 === 0 ? 'rgba(255, 255, 255, ' + opacity + ')' : 'rgba(200, 220, 255, ' + opacity + ')';
            
            // Create path element for the wave
            const wavePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            wavePath.setAttribute('fill', color);
            wavePath.setAttribute('filter', `url(#wave-blur-${i})`);
            
            waveGroup.appendChild(wavePath);
            mainGroup.appendChild(waveGroup);
            
            // Store wave properties for animation
            this.waveGroups.push({
                group: waveGroup,
                path: wavePath,
                amplitude,
                frequency,
                speed,
                yPosition,
                phase: Math.random() * Math.PI * 2 // Random starting phase
            });
        }
    }
    
    createFishes() {
        // Remove existing fish
        this.fishes.forEach(fish => {
            if (fish.element && fish.element.parentNode) {
                fish.element.parentNode.removeChild(fish.element);
            }
        });
        this.fishes = [];
        
        // Create group to contain all fishes
        const fishContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        fishContainer.setAttribute('class', 'fish-container');
        fishContainer.setAttribute('id', 'fish-container');
        this.svg.appendChild(fishContainer);
        
        // Generate fish at different depths
        for (let i = 0; i < this.fishCount; i++) {
            // Randomize fish properties
            const size = 10 + Math.random() * 30; // Random size
            const xPos = Math.random() * 100; // Random x position (%)
            const yPos = 30 + Math.random() * 50; // Random y position (%)
            const depth = Math.random(); // Random depth (0-1)
            const speed = 0.02 + Math.random() * 0.08; // Random speed
            const direction = Math.random() > 0.5 ? 1 : -1; // Random direction
            const fishType = this.fishTypes[Math.floor(Math.random() * this.fishTypes.length)]; // Random fish type
            
            // Determine the color based on the current gradient
            const colorIndex = Math.floor(Math.random() * this.currentGradientColors.length);
            const color = this.hexToRgba(this.currentGradientColors[colorIndex], 0.2 + depth * 0.3);
            
            // Create fish element
            const fish = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            fish.setAttribute('class', 'fish');
            
            // Create fish path based on type
            const fishPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            fishPath.setAttribute('fill', color);
            fishPath.setAttribute('d', this.getFishPath(fishType, size));
            
            // Add a subtle glow filter
            const filterId = `fish-glow-${i}`;
            const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            filter.setAttribute('id', filterId);
            
            const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
            feGaussianBlur.setAttribute('stdDeviation', '2');
            feGaussianBlur.setAttribute('result', 'blur');
            filter.appendChild(feGaussianBlur);
            
            const feComposite = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
            feComposite.setAttribute('in', 'SourceGraphic');
            feComposite.setAttribute('in2', 'blur');
            feComposite.setAttribute('operator', 'atop');
            filter.appendChild(feComposite);
            
            this.defs.appendChild(filter);
            fishPath.setAttribute('filter', `url(#${filterId})`);
            
            // Add the fish path to the fish group
            fish.appendChild(fishPath);
            
            // Initial transform
            fish.setAttribute('transform', 
                `translate(${xPos}%, ${yPos}%) scale(${direction}, 1) ` +
                `rotate(${direction > 0 ? 0 : 180}) scale(${0.3 + depth * 0.7})`
            );
            
            // Add to fish container
            fishContainer.appendChild(fish);
            
            // Store fish data for animation
            this.fishes.push({
                element: fish,
                path: fishPath,
                xPos,
                yPos,
                size,
                speed,
                direction,
                depth,
                wobble: Math.random() * Math.PI * 2, // Random starting wobble phase
                wobbleSpeed: 0.05 + Math.random() * 0.1, // Random wobble speed
                wobbleAmount: 0.5 + Math.random() * 2, // Random wobble amount
                colorIndex
            });
        }
    }
    
    // Helper function to get fish path based on type
    getFishPath(type, size) {
        const s = size / 2; // Half size for easier calculations
        
        switch(type) {
            case 'long':
                // Long, streamlined fish
                return `M ${-s} 0 C ${-s*0.7} ${-s*0.5}, ${-s*0.3} ${-s*0.8}, 0 0 C ${s*0.5} ${s*0.3}, ${s*0.8} ${-s*0.2}, ${s} 0 C ${s*0.8} ${s*0.5}, ${s*0.3} ${s}, 0 ${s*0.5} C ${-s*0.5} ${s}, ${-s*0.8} ${s*0.5}, ${-s} 0 Z`;
                
            case 'round':
                // Round, bubble-like fish
                return `M ${-s*0.8} 0 C ${-s*0.8} ${-s*0.8}, ${s*0.8} ${-s*0.8}, ${s*0.8} 0 C ${s*0.8} ${s*0.8}, ${-s*0.8} ${s*0.8}, ${-s*0.8} 0 Z M ${s*0.6} ${-s*0.2} a ${s*0.15} ${s*0.15} 0 1 0 0.1 0 Z`;
                
            case 'normal':
            default:
                // Standard fish shape
                return `M ${-s} 0 L ${-s*0.3} ${-s*0.5} L ${s*0.7} 0 L ${-s*0.3} ${s*0.5} Z M ${s*0.7} 0 L ${s} ${-s*0.5} L ${s} ${s*0.5} Z`;
        }
    }
    
    // Helper to convert hex to rgba
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    // Update fish colors when gradient changes
    updateFishColors() {
        this.fishes.forEach(fish => {
            // Get a color from the current gradient
            const colorIndex = fish.colorIndex || 0;
            const safeIndex = colorIndex % this.currentGradientColors.length;
            const color = this.hexToRgba(this.currentGradientColors[safeIndex], 0.2 + fish.depth * 0.3);
            
            // Update fish color
            fish.path.setAttribute('fill', color);
        });
    }
    
    generateWavePath(waveProps, timeOffset) {
        const { amplitude, frequency, yPosition, phase } = waveProps;
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Calculate points for the wave
        let pathData = `M 0 ${height} `;
        
        // Generate the wave points
        for (let x = 0; x <= width; x += width / this.wavePoints) {
            const y = yPosition + amplitude * Math.sin((x * frequency) + phase + timeOffset);
            pathData += `L ${x} ${y} `;
        }
        
        // Close the path at the bottom of the screen
        pathData += `L ${width} ${height} L 0 ${height} Z`;
        
        return pathData;
    }
    
    handleMouseMove(e) {
        // Calculate mouse position as percentage of screen
        const mouseX = (e.clientX / window.innerWidth);
        const mouseY = (e.clientY / window.innerHeight);
        
        // Add subtle wave distortion based on mouse position
        this.waveGroups.forEach((waveProps, index) => {
            // Adjust amplitude based on mouse Y position (closer to waves = more effect)
            const distanceEffect = Math.max(0, 1 - Math.abs(mouseY - (waveProps.yPosition / window.innerHeight)));
            waveProps.amplitude = (20 - (index * 3)) * (1 + distanceEffect * 0.5);
            
            // Adjust phase speed based on mouse X position
            waveProps.speedModifier = (mouseX - 0.5) * 0.05;
        });
        
        // Make nearby fish react to mouse
        this.fishes.forEach(fish => {
            const fishCenterX = fish.xPos;
            const fishCenterY = fish.yPos;
            
            // Calculate distance from mouse (as percentage of screen)
            const dx = mouseX * 100 - fishCenterX;
            const dy = mouseY * 100 - fishCenterY;
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            // If mouse is close, make fish swim away
            if (distance < 20) {
                // Calculate angle from fish to mouse
                const angle = Math.atan2(dy, dx);
                
                // Apply a repelling force (stronger for closer fish)
                const repelForce = (20 - distance) * 0.05;
                
                // Move fish away from mouse
                fish.xPos -= Math.cos(angle) * repelForce;
                fish.yPos -= Math.sin(angle) * repelForce;
                
                // Keep fish within bounds
                fish.xPos = Math.max(0, Math.min(100, fish.xPos));
                fish.yPos = Math.max(20, Math.min(80, fish.yPos));
            }
        });
        
        // Inform gradient manager to create radial overlay
        if (window.gradientManager) {
            window.gradientManager.createRadialOverlay(e.clientX, e.clientY);
        }
    }
    
    animate() {
        if (!this.svg) return;
        
        // Update time offset for wave animation
        this.timeOffset += 0.02;
        
        // Update each wave
        this.waveGroups.forEach(waveProps => {
            // Calculate speed including any mouse-based modifiers
            const effectiveSpeed = waveProps.speed + (waveProps.speedModifier || 0);
            
            // Update phase for this wave
            waveProps.phase += effectiveSpeed;
            
            // Generate and apply wave path
            const pathData = this.generateWavePath(waveProps, this.timeOffset);
            waveProps.path.setAttribute('d', pathData);
        });
        
        // Animate fish
        const time = performance.now() * 0.001;
        this.fishes.forEach(fish => {
            // Update horizontal position
            fish.xPos += fish.speed * fish.direction;
            
            // Wrap around screen edges
            if (fish.xPos > 110 && fish.direction > 0) {
                fish.xPos = -10;
            } else if (fish.xPos < -10 && fish.direction < 0) {
                fish.xPos = 110;
            }
            
            // Calculate wobble for natural swimming motion
            fish.wobble += fish.wobbleSpeed;
            const wobbleY = Math.sin(fish.wobble) * fish.wobbleAmount;
            
            // Apply wave influence based on fish depth
            // Deeper fish are less affected by waves
            let waveInfluence = 0;
            if (this.waveGroups.length > 0) {
                // Find the nearest wave to the fish's y position
                let nearestWave = this.waveGroups[0];
                let nearestDist = Math.abs(fish.yPos - nearestWave.yPosition);
                
                this.waveGroups.forEach(wave => {
                    const dist = Math.abs(fish.yPos - wave.yPosition);
                    if (dist < nearestDist) {
                        nearestWave = wave;
                        nearestDist = dist;
                    }
                });
                
                // Calculate wave influence
                const influence = Math.max(0, 1 - nearestDist / 20) * (1 - fish.depth * 0.7);
                waveInfluence = Math.sin((fish.xPos / 100 * window.innerWidth * nearestWave.frequency) + 
                                        nearestWave.phase + this.timeOffset) * 
                                 nearestWave.amplitude * influence * 0.5;
            }
            
            // Apply transformation with wobble and wave influence
            fish.element.setAttribute('transform',
                `translate(${fish.xPos}%, ${fish.yPos + wobbleY + waveInfluence}%) ` +
                `scale(${fish.direction}, 1) rotate(${wobbleY * 5}) ` +
                `scale(${0.3 + fish.depth * 0.7})`
            );
        });
        
        // Continue animation loop
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize wave animation manager
const waveAnimationManager = new WaveAnimationManager();
window.waveAnimationManager = waveAnimationManager;

// For compatibility with existing code - redirect any threeDManager references
window.threeDManager = waveAnimationManager;