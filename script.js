 // Existing script for the navigation bar
        const hamburgerButton = document.getElementById('hamburger-button');
        const closeButton = document.getElementById('close-button');
        const mobileMenu = document.getElementById('mobile-menu');

        function openMenu() {
            mobileMenu.classList.remove('translate-x-full');
            mobileMenu.classList.add('pop-animation');
        }

        function closeMenu() {
            mobileMenu.classList.add('translate-x-full');
            mobileMenu.classList.remove('pop-animation');
        }

        hamburgerButton.addEventListener('click', openMenu);
        closeButton.addEventListener('click', closeMenu);

        // Existing script for the hero section typing effect
        document.addEventListener('DOMContentLoaded', () => {
            const typingTextElement = document.getElementById('typing-text');
            const textToType = "Data Analytics";
            let charIndex = 1;
            let isDeleting = false;
            let typingSpeed = 200; // Speed of 0.1 seconds (100 milliseconds)

            function typeWriter() {
                if (isDeleting) {
                    typingTextElement.textContent = textToType.substring(0, charIndex - 1);
                    charIndex--;
                    if (charIndex === 1) {
                        isDeleting = false;
                    }
                } else {
                    typingTextElement.textContent = textToType.substring(0, charIndex + 1);
                    charIndex++;
                    if (charIndex === textToType.length) {
                        isDeleting = true;
                    }
                }

                setTimeout(typeWriter, typingSpeed);
            }
            
            typeWriter();
        });

        // --- New 3D Charts Script ---
        const CHART_COLORS = [
            0xff00ff, // Magenta
            0x00ffff, // Cyan
            0x00ff88, // Green
        ];

        // Chart Data
        const chartData = [
            { category: 'Jun', values: [120, 280, 160] },
            { category: 'Jul', values: [180, 300, 200] },
            { category: 'Aug', values: [160, 260, 180] },
            { category: 'Sep', values: [100, 200, 150] }
        ];

        const chartLabels = ['Oranges', 'Apples', 'Lemons'];

        function createScene(containerId) {
            const container = document.getElementById(containerId);
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);

            // Add lighting
            const ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
            scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(1, 1, 1).normalize();
            scene.add(directionalLight);

            // Handle responsiveness
            function onWindowResize() {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
            window.addEventListener('resize', onWindowResize, false);

            return { scene, camera, renderer };
        }

        // 3D Column Chart
        function createColumnChart(containerId) {
            const { scene, camera, renderer } = createScene(containerId);
            camera.position.set(20, 150, 250);
            camera.lookAt(new THREE.Vector3(0, 0, 0));

            const group = new THREE.Group();
            scene.add(group);

            const barWidth = 40;
            const barDepth = 40;
            const spaceBetween = 20;

            chartData.forEach((data, i) => {
                const categoryGroup = new THREE.Group();
                const totalWidth = (data.values.length * barWidth) + ((data.values.length - 1) * 5);
                const startX = -(totalWidth / 2);
                
                data.values.forEach((value, j) => {
                    const geometry = new THREE.BoxGeometry(barWidth, value, barDepth);
                    const material = new THREE.MeshLambertMaterial({ color: CHART_COLORS[j] });
                    const bar = new THREE.Mesh(geometry, material);
                    bar.position.set(startX + (j * (barWidth + 5)), value / 2, 0);
                    bar.name = `bar-${i}-${j}`;
                    bar.userData = { value: value, label: chartLabels[j] };
                    categoryGroup.add(bar);
                });
                categoryGroup.position.x = (i - chartData.length / 2 + 0.5) * (totalWidth + spaceBetween);
                group.add(categoryGroup);
            });

            // Animation loop
            function animate() {
                requestAnimationFrame(animate);
                group.rotation.y += 0.005;
                renderer.render(scene, camera);
            }
            animate();
        }

        // 3D Bar Chart
        function createBarChart(containerId) {
            const { scene, camera, renderer } = createScene(containerId);
            camera.position.set(250, 150, 250);
            camera.lookAt(new THREE.Vector3(0, 0, 0));

            const group = new THREE.Group();
            scene.add(group);

            const barHeight = 40;
            const barDepth = 40;
            const spaceBetween = 20;

            chartData.forEach((data, i) => {
                const categoryGroup = new THREE.Group();
                const totalHeight = (data.values.length * barHeight) + ((data.values.length - 1) * 5);
                const startY = -(totalHeight / 2);

                data.values.forEach((value, j) => {
                    const geometry = new THREE.BoxGeometry(value, barHeight, barDepth);
                    const material = new THREE.MeshLambertMaterial({ color: CHART_COLORS[j] });
                    const bar = new THREE.Mesh(geometry, material);
                    bar.position.set(value / 2, startY + (j * (barHeight + 5)), 0);
                    bar.name = `bar-${i}-${j}`;
                    bar.userData = { value: value, label: chartLabels[j] };
                    categoryGroup.add(bar);
                });
                categoryGroup.position.y = (i - chartData.length / 2 + 0.5) * (totalHeight + spaceBetween);
                group.add(categoryGroup);
            });

            // Animation loop
            function animate() {
                requestAnimationFrame(animate);
                group.rotation.y += 0.005;
                renderer.render(scene, camera);
            }
            animate();
        }

        // 3D Pie Chart
        function createPieChart(containerId) {
            const { scene, camera, renderer } = createScene(containerId);
            camera.position.set(0, 0, 150);
            camera.lookAt(new THREE.Vector3(0, 0, 0));

            const group = new THREE.Group();
            scene.add(group);

            const pieData = [
                { value: 22, color: CHART_COLORS[1], label: 'Oranges' },
                { value: 46, color: CHART_COLORS[0], label: 'Apples' },
                { value: 32, color: CHART_COLORS[2], label: 'Lemons' }
            ];
            const total = pieData.reduce((sum, item) => sum + item.value, 0);
            let startAngle = 0;

            pieData.forEach(item => {
                const angle = (item.value / total) * Math.PI * 2;
                const geometry = new THREE.CylinderGeometry(50, 50, 10, 32, 1, false, startAngle, angle);
                const material = new THREE.MeshLambertMaterial({ color: item.color });
                const segment = new THREE.Mesh(geometry, material);
                segment.rotation.x = Math.PI / 2;
                segment.position.x = Math.sin(startAngle + angle / 2) * 5; // A little offset for 3D effect
                segment.position.y = Math.cos(startAngle + angle / 2) * 5; // A little offset for 3D effect
                group.add(segment);
                startAngle += angle;
            });

            // Animation loop
            function animate() {
                requestAnimationFrame(animate);
                group.rotation.z += 0.01;
                renderer.render(scene, camera);
            }
            animate();
        }

        // Initialize charts and fade-in animation on window load
        window.onload = function() {
            createColumnChart('column-chart-container');
            createBarChart('bar-chart-container');
            createPieChart('pie-chart-container');

            // Fade-in animation for skill cards and certifications
            const fadeElements = document.querySelectorAll('.fade-in');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            }, { threshold: 0.2 });

            fadeElements.forEach(el => observer.observe(el));
        };


        // portfolio js --------------------------------------------------
         // JavaScript for scroll-fade animation
        document.addEventListener('DOMContentLoaded', () => {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.2
            };

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.fade-in').forEach(element => {
                observer.observe(element);
            });
        });
        
        // JavaScript for creating the particle effect in the background
        document.addEventListener('DOMContentLoaded', () => {
            const particleContainer = document.querySelector('.particle-bg');
            const numParticles = 50;

            for (let i = 0; i < numParticles; i++) {
                const particle = document.createElement('div');
                const size = Math.random() * 3 + 1; // Particle size between 1px and 4px
                const x = Math.random() * 100; // Position X from 0 to 100%
                const y = Math.random() * 100; // Position Y from 0 to 100%
                const duration = Math.random() * 10 + 5; // Animation duration between 5s and 15s
                const delay = Math.random() * 5; // Animation delay

                particle.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background-color: rgba(0, 255, 255, 0.1);
                    border-radius: 50%;
                    left: ${x}%;
                    top: ${y}%;
                    animation: floatParticle ${duration}s infinite ease-in-out alternate;
                    animation-delay: ${delay}s;
                `;
                particleContainer.appendChild(particle);
            }

            // CSS keyframes for the particle animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes floatParticle {
                    0% { transform: translate(0, 0) scale(1); opacity: 0.1; }
                    50% { transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(1.2); opacity: 0.3; }
                    100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
                }
            `;
            document.head.appendChild(style);
        });

        // service section ------------------------------------ 
         // JavaScript for scroll-fade animation
        document.addEventListener('DOMContentLoaded', () => {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.2
            };

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.fade-in').forEach(element => {
                observer.observe(element);
            });
        });
        
        // JavaScript for creating the particle effect in the background
        document.addEventListener('DOMContentLoaded', () => {
            const particleContainer = document.querySelector('.particle-bg');
            const numParticles = 50;

            for (let i = 0; i < numParticles; i++) {
                const particle = document.createElement('div');
                const size = Math.random() * 3 + 1; // Particle size between 1px and 4px
                const x = Math.random() * 100; // Position X from 0 to 100%
                const y = Math.random() * 100; // Position Y from 0 to 100%
                const duration = Math.random() * 10 + 5; // Animation duration between 5s and 15s
                const delay = Math.random() * 5; // Animation delay

                particle.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background-color: rgba(0, 255, 255, 0.1);
                    border-radius: 50%;
                    left: ${x}%;
                    top: ${y}%;
                    animation: floatParticle ${duration}s infinite ease-in-out alternate;
                    animation-delay: ${delay}s;
                `;
                particleContainer.appendChild(particle);
            }

            // CSS keyframes for the particle animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes floatParticle {
                    0% { transform: translate(0, 0) scale(1); opacity: 0.1; }
                    50% { transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(1.2); opacity: 0.3; }
                    100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
                }
            `;
            document.head.appendChild(style);
        });


        // image code 
        document.addEventListener('DOMContentLoaded', function() {
            const galleryItems = document.querySelectorAll('.gallery-item');
            const modal = document.getElementById('imageModal');
            const modalImage = document.getElementById('modalImage');
            const closeModal = document.getElementById('closeModal');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const dots = document.querySelectorAll('.dot');
            
            let currentImageIndex = 0;
            let currentImages = [];

            // Filter images by category
            dots.forEach(dot => {
                dot.addEventListener('click', function() {
                    const category = this.getAttribute('data-category');
                    
                    // Remove active class from all dots
                    dots.forEach(d => d.classList.remove('active'));
                    // Add active class to clicked dot
                    this.classList.add('active');
                    
                    // Filter images
                    if (category === 'all') {
                        galleryItems.forEach(item => {
                            item.style.display = 'block';
                        });
                    } else {
                        galleryItems.forEach(item => {
                            if (item.getAttribute('data-category') === category) {
                                item.style.display = 'block';
                            } else {
                                item.style.display = 'none';
                            }
                        });
                    }
                });
            });

            // Open modal with clicked image
            galleryItems.forEach((item, index) => {
                item.addEventListener('click', function() {
                    currentImages = Array.from(galleryItems);
                    currentImageIndex = index;
                    updateModalImage();
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            });

            // Close modal
            closeModal.addEventListener('click', function() {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });

            // Close modal when clicking outside
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });

            // Navigation buttons
            prevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
                updateModalImage();
            });

            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                currentImageIndex = (currentImageIndex + 1) % currentImages.length;
                updateModalImage();
            });

            // Keyboard navigation
            document.addEventListener('keydown', function(e) {
                if (modal.classList.contains('active')) {
                    if (e.key === 'Escape') {
                        modal.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    } else if (e.key === 'ArrowLeft') {
                        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
                        updateModalImage();
                    } else if (e.key === 'ArrowRight') {
                        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
                        updateModalImage();
                    }
                }
            });

            function updateModalImage() {
                const imageSrc = currentImages[currentImageIndex].querySelector('.gallery-image').src;
                const imageAlt = currentImages[currentImageIndex].querySelector('.gallery-image').alt;
                modalImage.src = imageSrc;
                modalImage.alt = imageAlt;
            }
        });


        // contact code 
          document.addEventListener('DOMContentLoaded', function() {
            const contactForm = document.getElementById('contactForm');
            const formMessage = document.getElementById('formMessage');
            const submitBtn = document.getElementById('submitBtn');
            const btnText = document.getElementById('btnText');
            const btnLoading = document.getElementById('btnLoading');

            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(contactForm);
                const name = formData.get('name');
                const email = formData.get('email');
                const phone = formData.get('phone') || 'Not provided';
                const subject = formData.get('subject');
                const message = formData.get('message');
                
                // Validation
                if (!name || !email || !subject || !message) {
                    showMessage('Please fill in all required fields.', 'error');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    showMessage('Please enter a valid email address.', 'error');
                    return;
                }
                
                // Show loading state
                setLoadingState(true);
                
                // Send email using EmailJS
                emailjs.send(
                    'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
                    'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
                    {
                        to_email: 'rohitshahi540@gmail.com',
                        from_name: name,
                        from_email: email,
                        phone: phone,
                        subject: subject,
                        message: message,
                        timestamp: new Date().toLocaleString()
                    }
                )
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    showMessage('Thank you! Your message has been sent successfully. I will get back to you soon.', 'success');
                    contactForm.reset();
                })
                .catch(function(error) {
                    console.error('FAILED...', error);
                    showMessage('Sorry, there was an error sending your message. Please try again later or contact me directly at rohitshahi540@gmail.com', 'error');
                })
                .finally(function() {
                    setLoadingState(false);
                    
                    // Clear message after 5 seconds
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                        formMessage.className = 'form-message';
                    }, 5000);
                });
            });
            
            function isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }
            
            function showMessage(text, type) {
                formMessage.textContent = text;
                formMessage.className = `form-message ${type}`;
                formMessage.style.display = 'block';
                
                // Scroll to message
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            
            function setLoadingState(isLoading) {
                if (isLoading) {
                    submitBtn.disabled = true;
                    btnText.style.display = 'none';
                    btnLoading.style.display = 'inline-block';
                } else {
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline-block';
                    btnLoading.style.display = 'none';
                }
            }
            
            // Add input validation on blur
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    validateField(this);
                });
                
                input.addEventListener('input', function() {
                    // Clear error when user starts typing
                    if (this.classList.contains('error')) {
                        this.classList.remove('error');
                        const errorElement = this.nextElementSibling;
                        if (errorElement && errorElement.classList.contains('error-text')) {
                            errorElement.remove();
                        }
                    }
                });
            });
            
            function validateField(field) {
                if (field.hasAttribute('required') && !field.value.trim()) {
                    showFieldError(field, 'This field is required');
                    return false;
                }
                
                if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
                    showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
                
                return true;
            }
            
            function showFieldError(field, message) {
                field.classList.add('error');
                
                // Remove existing error message
                const existingError = field.nextElementSibling;
                if (existingError && existingError.classList.contains('error-text')) {
                    existingError.remove();
                }
                
                // Create error message
                const errorElement = document.createElement('div');
                errorElement.className = 'error-text';
                errorElement.style.color = '#ff0066';
                errorElement.style.fontSize = '0.9rem';
                errorElement.style.marginTop = '5px';
                errorElement.textContent = message;
                
                field.parentNode.insertBefore(errorElement, field.nextSibling);
            }
        });

        // video section code 
         document.addEventListener('DOMContentLoaded', function() {
            const videoCards = document.querySelectorAll('.video-card');
            const fullscreenOverlay = document.getElementById('fullscreenOverlay');
            const fullscreenVideo = document.getElementById('fullscreenVideo');
            const closeButton = document.getElementById('closeButton');
            const body = document.body;

            // Function to open video in fullscreen
            function openFullscreen(videoSrc) {
                fullscreenVideo.src = videoSrc;
                fullscreenOverlay.style.display = 'flex';
                body.style.overflow = 'hidden';
                
                // Attempt to play the video automatically
                fullscreenVideo.play().catch(error => {
                    console.log('Autoplay prevented:', error);
                    // User interaction might be required for autoplay
                });
            }

            // Function to close fullscreen
            function closeFullscreen() {
                fullscreenOverlay.style.display = 'none';
                fullscreenVideo.pause();
                fullscreenVideo.src = '';
                body.style.overflow = 'auto';
            }

            // Add click event to each video card
            videoCards.forEach(card => {
                card.addEventListener('click', function() {
                    const videoSrc = this.getAttribute('data-video');
                    openFullscreen(videoSrc);
                });
            });

            // Close fullscreen when close button is clicked
            closeButton.addEventListener('click', function(e) {
                e.stopPropagation();
                closeFullscreen();
            });

            // Close fullscreen when clicking outside the video
            fullscreenOverlay.addEventListener('click', function(e) {
                if (e.target === fullscreenOverlay) {
                    closeFullscreen();
                }
            });

            // Close fullscreen with Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && fullscreenOverlay.style.display === 'flex') {
                    closeFullscreen();
                }
            });

            // Handle video ended event
            fullscreenVideo.addEventListener('ended', function() {
                // Optionally auto-close when video ends
                // closeFullscreen();
            });

            // Handle video errors
            fullscreenVideo.addEventListener('error', function() {
                console.error('Error loading video');
                // You could show an error message here
            });

            // Preload videos for better performance
            function preloadVideos() {
                videoCards.forEach(card => {
                    const videoSrc = card.getAttribute('data-video');
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.as = 'video';
                    link.href = videoSrc;
                    document.head.appendChild(link);
                });
            }

            // Start preloading when page is loaded
            window.addEventListener('load', preloadVideos);
        });

        // --------------------- 
         // Create floating particles
        document.addEventListener('DOMContentLoaded', function() {
            createParticles();
            
            // Add interactive hover effects
            const socialCards = document.querySelectorAll('.social-card');
            
            socialCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.zIndex = '10';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.zIndex = '1';
                });
            });
            
            // Add random glitch effect to website name
            const websiteName = document.querySelector('.website-name');
            let glitchTimeout;
            
            function triggerGlitch() {
                const originalText = websiteName.textContent;
                const glitchText = originalText.split('').map(char => 
                    Math.random() > 0.7 ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) : char
                ).join('');
                
                websiteName.textContent = glitchText;
                
                setTimeout(() => {
                    websiteName.textContent = originalText;
                }, 100);
                
                glitchTimeout = setTimeout(triggerGlitch, 3000 + Math.random() * 5000);
            }
            
            // Start glitch effect after initial load
            setTimeout(triggerGlitch, 2000);
        });
        
        function createParticles() {
            const footer = document.querySelector('.cyberpunk-footer');
            const particleCount = 20;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                const size = Math.random() * 4 + 1;
                const posX = Math.random() * 100;
                const posY = Math.random() * 100;
                const delay = Math.random() * 6;
                const duration = 6 + Math.random() * 4;
                
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${posX}%`;
                particle.style.top = `${posY}%`;
                particle.style.animationDelay = `${delay}s`;
                particle.style.animationDuration = `${duration}s`;
                
                footer.appendChild(particle);
            }
        }

        // add some more js analytics-container

