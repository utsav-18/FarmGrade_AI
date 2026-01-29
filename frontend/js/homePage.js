        const uploadArea = document.getElementById('uploadArea');
        const uploadBtn = document.getElementById('uploadBtn');
        const cameraBtn = document.getElementById('cameraBtn');
        const emptyState = document.getElementById('emptyState');
        const resultsView = document.getElementById('resultsView');
        const confidenceBar = document.getElementById('confidenceBar');
        
        const sampleData = [
            { grade: 'A+', confidence: 95, crop: 'Tender Coconut', price: '₹25-30', icon: '🥥' },
            { grade: 'A', confidence: 88, crop: 'Turmeric', price: '₹80-95', icon: '🌿' },
            { grade: 'B+', confidence: 82, crop: 'Tender Coconut', price: '₹18-22', icon: '🥥' },
            { grade: 'A-', confidence: 85, crop: 'Turmeric', price: '₹70-80', icon: '🌿' }
        ];
        
        function showResults() {
            const data = sampleData[Math.floor(Math.random() * sampleData.length)];
            
            emptyState.style.display = 'none';
            resultsView.classList.add('show');
            
            document.getElementById('cropIcon').textContent = data.icon;
            document.getElementById('gradeDisplay').textContent = data.grade;
            document.getElementById('confidenceDisplay').textContent = data.confidence + '%';
            document.getElementById('cropDisplay').textContent = data.crop;
            document.getElementById('priceDisplay').textContent = data.price;
            
            setTimeout(() => {
                confidenceBar.style.width = data.confidence + '%';
            }, 200);
        }
        
        function handleUpload() {
            uploadArea.classList.add('uploading');
            setTimeout(() => {
                showResults();
                uploadArea.classList.remove('uploading');
            }, 1200);
        }
        
        uploadBtn.addEventListener('click', handleUpload);
        cameraBtn.addEventListener('click', handleUpload);
        uploadArea.addEventListener('click', handleUpload);
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--sage-medium)';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'var(--ash)';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            handleUpload();
        });

    

        // Stunning Agricultural Canvas Background
        const canvas = document.getElementById('bgCanvas');
        const ctx = canvas.getContext('2d');
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let mouse = { x: width / 2, y: height / 2 };
        
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
        
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        
        // Stunning Aurora-style waves
        class AuroraWave {
            constructor(index) {
                this.index = index;
                this.offset = index * 100;
                this.speed = 0.0003 + index * 0.0001;
                this.amplitude = 60 + index * 20;
                this.yBase = height * 0.2 + index * 80;
                this.hue = 150 + index * 10;
            }
            
            draw(time) {
                ctx.beginPath();
                ctx.moveTo(0, this.yBase);
                
                for (let x = 0; x <= width; x += 3) {
                    const wave1 = Math.sin((x * 0.003) + (time * this.speed) + this.offset) * this.amplitude;
                    const wave2 = Math.sin((x * 0.002) + (time * this.speed * 0.5) + this.offset) * (this.amplitude * 0.5);
                    const y = this.yBase + wave1 + wave2;
                    ctx.lineTo(x, y);
                }
                
                ctx.lineTo(width, height);
                ctx.lineTo(0, height);
                ctx.closePath();
                
                const gradient = ctx.createLinearGradient(0, this.yBase - this.amplitude, 0, this.yBase + this.amplitude);
                gradient.addColorStop(0, `hsla(${this.hue}, 70%, 50%, 0.04)`);
                gradient.addColorStop(0.5, `hsla(${this.hue}, 70%, 55%, 0.08)`);
                gradient.addColorStop(1, `hsla(${this.hue}, 70%, 60%, 0.02)`);
                
                ctx.fillStyle = gradient;
                ctx.fill();
                
                // Glowing edge
                ctx.strokeStyle = `hsla(${this.hue}, 80%, 65%, 0.15)`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        }
        
        // Glowing leaf particles with trails
        class GlowingLeaf {
            constructor() {
                this.reset();
                this.trail = [];
                this.maxTrail = 15;
            }
            
            reset() {
                this.x = Math.random() * width;
                this.y = -30;
                this.size = Math.random() * 10 + 6;
                this.speedY = Math.random() * 0.8 + 0.4;
                this.speedX = Math.random() * 0.6 - 0.3;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.03;
                this.hue = 140 + Math.random() * 40;
                this.brightness = Math.random() * 30 + 50;
                this.glowIntensity = Math.random() * 0.5 + 0.5;
            }
            
            update() {
                this.trail.push({ x: this.x, y: this.y });
                if (this.trail.length > this.maxTrail) {
                    this.trail.shift();
                }
                
                this.y += this.speedY;
                this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
                this.rotation += this.rotationSpeed;
                
                // Interact with mouse
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    this.x -= (dx / dist) * force * 2;
                    this.y -= (dy / dist) * force * 2;
                }
                
                if (this.y > height + 30 || this.x < -30 || this.x > width + 30) {
                    this.reset();
                    this.trail = [];
                }
            }
            
            draw() {
                // Draw trail
                ctx.strokeStyle = `hsla(${this.hue}, 60%, ${this.brightness}%, 0.2)`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                this.trail.forEach((point, i) => {
                    const alpha = (i / this.trail.length) * 0.3;
                    if (i === 0) {
                        ctx.moveTo(point.x, point.y);
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }
                });
                ctx.stroke();
                
                // Glow effect
                const glowGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
                glowGradient.addColorStop(0, `hsla(${this.hue}, 85%, ${this.brightness}%, ${0.3 * this.glowIntensity})`);
                glowGradient.addColorStop(0.5, `hsla(${this.hue}, 85%, ${this.brightness}%, ${0.15 * this.glowIntensity})`);
                glowGradient.addColorStop(1, `hsla(${this.hue}, 85%, ${this.brightness}%, 0)`);
                
                ctx.fillStyle = glowGradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw leaf
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                
                ctx.fillStyle = `hsla(${this.hue}, 75%, ${this.brightness}%, 0.5)`;
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.bezierCurveTo(this.size * 0.6, -this.size * 0.4, this.size * 0.6, this.size * 0.4, 0, this.size);
                ctx.bezierCurveTo(-this.size * 0.6, this.size * 0.4, -this.size * 0.6, -this.size * 0.4, 0, -this.size);
                ctx.fill();
                
                // Leaf highlight
                ctx.strokeStyle = `hsla(${this.hue}, 90%, ${this.brightness + 20}%, 0.4)`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.lineTo(0, this.size);
                ctx.stroke();
                
                ctx.restore();
            }
        }
        
        // Energy particles that react to mouse
        class EnergyParticle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 3 + 1;
                this.baseX = this.x;
                this.baseY = this.y;
                this.speed = Math.random() * 0.5 + 0.2;
                this.angle = Math.random() * Math.PI * 2;
                this.hue = 160 + Math.random() * 30;
                this.pulse = Math.random() * Math.PI * 2;
            }
            
            update() {
                this.pulse += 0.05;
                const pulseSize = Math.sin(this.pulse) * 1 + 1;
                
                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 200) {
                    const force = (200 - dist) / 200;
                    this.x += (dx / dist) * force * 3;
                    this.y += (dy / dist) * force * 3;
                } else {
                    // Return to base
                    this.x += (this.baseX - this.x) * 0.05;
                    this.y += (this.baseY - this.y) * 0.05;
                }
                
                this.currentSize = this.size * pulseSize;
            }
            
            draw() {
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.currentSize * 4);
                gradient.addColorStop(0, `hsla(${this.hue}, 85%, 65%, 0.4)`);
                gradient.addColorStop(0.5, `hsla(${this.hue}, 85%, 65%, 0.2)`);
                gradient.addColorStop(1, `hsla(${this.hue}, 85%, 65%, 0)`);
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.currentSize * 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Golden light rays
        class LightRay {
            constructor() {
                this.x = width * (0.7 + Math.random() * 0.3);
                this.y = height * (0.1 + Math.random() * 0.2);
                this.length = Math.random() * 200 + 150;
                this.angle = Math.PI * 0.4 + Math.random() * 0.3;
                this.opacity = Math.random() * 0.08 + 0.04;
                this.width = Math.random() * 60 + 40;
                this.speed = Math.random() * 0.0002 + 0.0001;
            }
            
            update(time) {
                this.currentOpacity = this.opacity * (Math.sin(time * this.speed) * 0.5 + 0.5);
            }
            
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                
                const gradient = ctx.createLinearGradient(0, 0, this.length, 0);
                gradient.addColorStop(0, `rgba(212, 160, 23, ${this.currentOpacity})`);
                gradient.addColorStop(0.5, `rgba(253, 185, 19, ${this.currentOpacity * 0.6})`);
                gradient.addColorStop(1, `rgba(212, 160, 23, 0)`);
                
                ctx.fillStyle = gradient;
                ctx.fillRect(0, -this.width / 2, this.length, this.width);
                
                ctx.restore();
            }
        }
        
        // Create stunning elements
        const auroraWaves = [new AuroraWave(0), new AuroraWave(1), new AuroraWave(2)];
        const glowingLeaves = [];
        const energyParticles = [];
        const lightRays = [];
        
        for (let i = 0; i < 20; i++) glowingLeaves.push(new GlowingLeaf());
        for (let i = 0; i < 80; i++) energyParticles.push(new EnergyParticle());
        for (let i = 0; i < 8; i++) lightRays.push(new LightRay());
        
        // Connect nearby energy particles
        function drawConnections() {
            for (let i = 0; i < energyParticles.length; i++) {
                for (let j = i + 1; j < energyParticles.length; j++) {
                    const dx = energyParticles[i].x - energyParticles[j].x;
                    const dy = energyParticles[i].y - energyParticles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        const opacity = (1 - distance / 120) * 0.15;
                        ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(energyParticles[i].x, energyParticles[i].y);
                        ctx.lineTo(energyParticles[j].x, energyParticles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Mouse glow effect
        function drawMouseGlow() {
            const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
            gradient.addColorStop(0, 'rgba(251, 191, 36, 0.08)');
            gradient.addColorStop(0.5, 'rgba(251, 191, 36, 0.04)');
            gradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 150, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Animation loop
        let time = 0;
        function animate() {
            time += 1;
            ctx.clearRect(0, 0, width, height);
            
            // Background layers
            auroraWaves.forEach(wave => wave.draw(time));
            
            // Light rays
            lightRays.forEach(ray => {
                ray.update(time);
                ray.draw();
            });
            
            // Energy particles and connections
            energyParticles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            drawConnections();
            
            // Glowing leaves
            glowingLeaves.forEach(leaf => {
                leaf.update();
                leaf.draw();
            });
            
            // Mouse interaction glow
            drawMouseGlow();
            
            requestAnimationFrame(animate);
        }
        
        animate();