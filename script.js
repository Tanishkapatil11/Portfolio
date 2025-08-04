// Theme Management
class ThemeManager {
  constructor() {
    this.init();
  }

  init() {
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
    
    // Add event listener to theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  setTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    this.updateThemeIcon(theme);
  }

  toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
}

// Navigation Management
class NavigationManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupSmoothScrolling();
    this.setupActiveNavigation();
    this.setupMobileMenu();
  }

  setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  setupActiveNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    const updateActiveNav = () => {
      const scrollPos = window.scrollY + 100;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call
  }

  setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
      mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
      });
    }
  }
}

// Contact Form Management
class ContactFormManager {
  constructor() {
    this.init();
  }

  init() {
    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
      this.setupRealTimeValidation();
    }
  }

  setupRealTimeValidation() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    this.clearError(field);

    // Required field validation
    if (!value) {
      isValid = false;
      errorMessage = `${this.getFieldLabel(fieldName)} is required.`;
    } else {
      // Specific validations
      switch (fieldName) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
          }
          break;
        case 'name':
          if (value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters long.';
          }
          break;
        case 'message':
          if (value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long.';
          }
          break;
      }
    }

    if (!isValid) {
      this.showError(field, errorMessage);
    }

    return isValid;
  }

  clearError(field) {
    const errorElement = document.getElementById(`${field.name}Error`);
    if (errorElement) {
      errorElement.textContent = '';
    }
    field.classList.remove('error');
  }

  showError(field, message) {
    const errorElement = document.getElementById(`${field.name}Error`);
    if (errorElement) {
      errorElement.textContent = message;
    }
    field.classList.add('error');
  }

  getFieldLabel(fieldName) {
    const labels = {
      name: 'Full Name',
      email: 'Email Address',
      subject: 'Subject',
      message: 'Message'
    };
    return labels[fieldName] || fieldName;
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const inputs = form.querySelectorAll('.form-input');
    
    let isFormValid = true;

    // Validate all fields
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      this.submitForm(formData);
    } else {
      this.showNotification('Please correct the errors above.', 'error');
    }
  }

  async submitForm(formData) {
    try {
      // Show loading state
      const submitBtn = document.querySelector('.contact-form button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="btn-icon">⏳</span><span>Sending...</span>';
      submitBtn.disabled = true;

      // Simulate form submission (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success message
      this.showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
      
      // Reset form
      document.getElementById('contactForm').reset();

      // Restore button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

    } catch (error) {
      console.error('Form submission error:', error);
      this.showNotification('Something went wrong. Please try again later.', 'error');
      
      // Restore button
      const submitBtn = document.querySelector('.contact-form button[type="submit"]');
      submitBtn.innerHTML = '<span class="btn-icon">📤</span><span>Send Message</span>';
      submitBtn.disabled = false;
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? 'hsl(142, 76%, 36%)' : type === 'error' ? 'hsl(0, 84%, 60%)' : 'hsl(217, 91%, 50%)'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: var(--shadow-lg);
      display: flex;
      align-items: center;
      gap: 1rem;
      z-index: 10000;
      max-width: 400px;
      animation: slideIn 0.3s ease-out;
    `;

    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    `;

    closeBtn.addEventListener('click', () => {
      notification.remove();
    });

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }
}

// Resource Download Management
class ResourceManager {
  constructor() {
    this.init();
  }

  init() {
    // This would be implemented with actual download links
    console.log('Resource manager initialized');
  }

  downloadResource(resourceId) {
    // In a real implementation, this would handle actual file downloads
    const resourceMap = {
      'paper1': 'deep-learning-computer-vision-survey.pdf',
      'paper2': 'neural-network-architectures-autonomous-systems.pdf',
      'paper3': 'machine-learning-medical-imaging.pdf',
      'slides1': 'cs229-machine-learning-slides.zip',
      'assignments1': 'cs231n-cnn-assignments.zip',
      'handbook1': 'introduction-computer-vision-handbook.pdf',
      'lab1': 'ai-lab-setup-guide.pdf',
      'lab2': 'computer-vision-lab-experiments.zip'
    };

    const filename = resourceMap[resourceId];
    if (filename) {
      // Simulate download
      this.showDownloadNotification(filename);
      
      // In a real implementation, you would:
      // window.open(`/downloads/${filename}`, '_blank');
    }
  }

  showDownloadNotification(filename) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: hsl(142, 76%, 36%);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      animation: slideUp 0.3s ease-out;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span>📥</span>
        <span>Downloading ${filename}</span>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }
}

// Animation and Scroll Effects
class AnimationManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupCounterAnimations();
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animatedElements = document.querySelectorAll('.content-card, .achievement-card, .resource-category');
    animatedElements.forEach(el => observer.observe(el));
  }

  setupCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const countUp = (element, target) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = Math.floor(current) + (target >= 100 ? '+' : '');
      }, 30);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          const target = parseInt(entry.target.textContent);
          entry.target.classList.add('counted');
          countUp(entry.target, target);
        }
      });
    });

    counters.forEach(counter => observer.observe(counter));
  }
}

// Global Functions (called from HTML)
function downloadCV() {
  // In a real implementation, this would trigger a CV download
  window.open('/cv-emily-carter.pdf', '_blank');
}

function scrollToContact() {
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    const offsetTop = contactSection.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

function downloadResource(resourceId) {
  if (window.resourceManager) {
    window.resourceManager.downloadResource(resourceId);
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .form-input.error {
    border-color: hsl(0, 84%, 60%);
    box-shadow: 0 0 0 3px hsl(0, 84%, 60%, 0.1);
  }

  @media (max-width: 768px) {
    .nav-links.mobile-open {
      display: flex;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--background);
      border: 1px solid var(--border);
      border-top: none;
      flex-direction: column;
      padding: 1rem;
      gap: 1rem;
    }
  }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
  window.navigationManager = new NavigationManager();
  window.contactFormManager = new ContactFormManager();
  window.resourceManager = new ResourceManager();
  window.animationManager = new AnimationManager();
});