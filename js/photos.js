// Photo gallery functionality
class PhotoGallery {
  constructor() {
    this.photos = [];
    this.currentIndex = 0;
    this.isLoading = false;
    this.theme = localStorage.getItem('theme') || 'light';
    this.loadedPhotos = new Set(); // Track which photos have been loaded
    this.loadThreshold = 500; // Load next photo when user is this many pixels from bottom
    this.scrollTimeout = null;
    this.isScrolling = false;
    this.scrollIndicator = null;

    this.init();
  }

  async init() {
    this.setupTheme();
    await this.loadPhotos();
    this.setupEventListeners();
    this.renderPhotos();
    await this.handleInitialHash();
    this.scrollIndicator = document.querySelector('.scroll-indicator');
  }

  async handleInitialHash() {
    const hash = window.location.hash.substring(1); // Remove the # symbol
    if (hash) {
      const targetIndex = parseInt(hash);
      if (!isNaN(targetIndex) && targetIndex >= 0 && targetIndex < this.photos.length) {
        // Load photos up to the target index
        while (this.currentIndex <= targetIndex) {
          await this.loadMorePhotos();
        }
        // Scroll to the target photo
        this.scrollToPhoto(targetIndex);
      }
    }
  }

  updateURL() {
    const newHash = this.currentIndex.toString();
    if (window.location.hash !== `#${newHash}`) {
      window.location.hash = newHash;
    }
  }

  setupTheme() {
    document.body.classList.toggle('dark-theme', this.theme === 'dark');
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.innerHTML = this.theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    
    themeToggle.addEventListener('click', () => {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', this.theme);
      document.body.classList.toggle('dark-theme');
      themeToggle.innerHTML = this.theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
  }

  async loadPhotos() {
    try {
      const response = await fetch('photos/list.json');
      const data = await response.json();
      this.photos = data.photos || [];
      this.sortPhotosByDate();
    } catch (error) {
      console.error('Error loading photos:', error);
      this.photos = [];
    }
  }

  sortPhotosByDate() {
    this.photos.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
  }

  setupEventListeners() {
    // Handle scroll events for dynamic loading and snapping
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });

    // Add keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        this.scrollToNextPhoto();
      } else if (e.key === 'ArrowUp') {
        this.scrollToPrevPhoto();
      }
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      // Clear any existing timeout
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      
      // Set a timeout to detect when resizing stops
      resizeTimeout = setTimeout(() => {
        this.snapToNearestPhoto();
      }, 100);
    });
  }

  handleScroll() {
    // Clear any existing timeout
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Set scrolling state
    this.isScrolling = true;

    // Hide scroll indicator after scrolling
    if (this.scrollIndicator && window.scrollY > 50) {
      this.scrollIndicator.classList.add('hidden');
    }

    // Check if we need to load more photos
    this.checkLoadMore();

    // Set a timeout to detect when scrolling stops
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
      // Only snap if user has scrolled a significant amount
      this.snapToNearestPhoto();
    }, 150); // Increased timeout for more natural feel
  }

  snapToNearestPhoto() {
    const photos = document.querySelectorAll('.photo-item');
    const viewportHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    
    let nearestPhoto = null;
    let minDistance = Infinity;
    let nearestIndex = 0;
    
    photos.forEach((photo, index) => {
      const rect = photo.getBoundingClientRect();
      const photoCenter = rect.top + rect.height / 2;
      const distance = Math.abs(photoCenter - viewportHeight / 2);
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestPhoto = photo;
        nearestIndex = index;
      }
    });
    
    // Only snap if we're reasonably close to a photo (within 30% of viewport height)
    const snapThreshold = viewportHeight * 0.3;
    
    if (nearestPhoto && minDistance < snapThreshold) {
      const targetScroll = nearestPhoto.offsetTop - (viewportHeight - nearestPhoto.offsetHeight) / 2;
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
      
      // Update current index and URL
      this.currentIndex = nearestIndex;
      this.updateURL();
    }
  }

  scrollToNextPhoto() {
    const nextIndex = (this.currentIndex + 1) % this.photos.length;
    this.scrollToPhoto(nextIndex);
  }

  scrollToPrevPhoto() {
    const prevIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
    this.scrollToPhoto(prevIndex);
  }

  scrollToPhoto(index) {
    const photos = document.querySelectorAll('.photo-item');
    if (photos[index]) {
      const viewportHeight = window.innerHeight;
      const targetScroll = photos[index].offsetTop - (viewportHeight - photos[index].offsetHeight) / 2;
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
      this.currentIndex = index;
      this.updateURL();
    }
  }

  checkLoadMore() {
    const scrollBottom = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    
    // If we're close to the bottom and not already loading
    if (documentHeight - scrollBottom < this.loadThreshold && !this.isLoading) {
      this.loadMorePhotos();
    }
  }

  async loadMorePhotos() {
    if (this.isLoading || this.currentIndex >= this.photos.length) return;
    
    this.isLoading = true;
    const container = document.getElementById('photo-container');
    
    // Load next batch of photos
    const batchSize = 3;
    for (let i = 0; i < batchSize && this.currentIndex < this.photos.length; i++) {
      const photo = this.photos[this.currentIndex];
      
      if (!this.loadedPhotos.has(photo.filename)) {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        
        const img = document.createElement('img');
        img.src = `photos/${photo.filename}`;
        img.alt = photo.title || 'Photo';
        
        // Add position counter
        const counter = document.createElement('div');
        counter.className = 'photo-counter';
        counter.textContent = `${this.currentIndex + 1}/${this.photos.length}`;
        
        photoItem.appendChild(img);
        photoItem.appendChild(counter);
        container.appendChild(photoItem);
        
        this.loadedPhotos.add(photo.filename);
      }
      
      this.currentIndex++;
    }
    
    this.isLoading = false;
    return this.currentIndex < this.photos.length; // Return whether there are more photos to load
  }

  renderPhotos() {
    const container = document.getElementById('photo-container');
    container.innerHTML = '';
    this.loadedPhotos.clear();
    this.currentIndex = 0;
    
    // Load initial batch of photos
    this.loadMorePhotos();
  }

  showNextPhoto() {
    const currentPhoto = document.querySelector('.photo-item.active');
    const nextIndex = (this.currentIndex + 1) % this.photos.length;
    const nextPhoto = document.querySelectorAll('.photo-item')[nextIndex];
    
    if (currentPhoto && nextPhoto) {
      // Remove active class from current photo
      currentPhoto.classList.remove('active');
      
      // Add active class to next photo
      nextPhoto.classList.add('active');
      nextPhoto.style.transform = 'translateY(0)';
      
      this.currentIndex = nextIndex;
      this.updateURL();
    }
  }

  showPrevPhoto() {
    const currentPhoto = document.querySelector('.photo-item.active');
    const prevIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
    const prevPhoto = document.querySelectorAll('.photo-item')[prevIndex];
    
    if (currentPhoto && prevPhoto) {
      // Remove active class from current photo
      currentPhoto.classList.remove('active');
      
      // Add active class to previous photo
      prevPhoto.classList.add('active');
      prevPhoto.style.transform = 'translateY(0)';
      
      this.currentIndex = prevIndex;
      this.updateURL();
    }
  }

  showPhoto(index, direction = 'none') {
    // Remove all transition classes first
    document.querySelectorAll('.photo-item').forEach(item => {
      item.classList.remove('active');
      item.style.transform = '';
      item.style.opacity = '';
    });
    
    const photoItem = document.querySelectorAll('.photo-item')[index];
    if (photoItem) {
      photoItem.classList.add('active');
      this.currentIndex = index;
      this.updateURL();
    }
  }
}

// Initialize the gallery
document.addEventListener('DOMContentLoaded', () => {
  new PhotoGallery();
}); 