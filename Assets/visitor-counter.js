/**
 * Visitor Counter JavaScript
 * Tracks unique visitors and displays count on the site
 */

class VisitorCounter {
  constructor() {
    this.apiEndpoint = '/apps/visitor-counter';
    this.visitorId = this.generateVisitorId();
    this.isUnique = this.checkUniqueVisitor();
    this.counters = new Map();
    
    this.init();
  }
  
  /**
   * Generate a unique visitor ID
   */
  generateVisitorId() {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
  }
  
  /**
   * Check if this is a unique visitor (new session)
   */
  checkUniqueVisitor() {
    const hasVisited = sessionStorage.getItem('has_visited');
    if (!hasVisited) {
      sessionStorage.setItem('has_visited', 'true');
      return true;
    }
    return false;
  }
  
  /**
   * Initialize the visitor counter
   */
  init() {
    this.trackVisitor();
    this.updateCounters();
    
    // Update counters every 30 seconds
    setInterval(() => {
      this.updateCounters();
    }, 30000);
  }
  
  /**
   * Track the current visitor
   */
  async trackVisitor() {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitorId: this.visitorId,
          isUnique: this.isUnique
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        this.counters.set('total', data.visitorCount);
        this.counters.set('unique', data.uniqueVisitors);
        this.updateDisplay();
      }
    } catch (error) {
      console.log('Visitor counter API not available, using demo data');
      this.useDemoData();
    }
  }
  
  /**
   * Update counters from API
   */
  async updateCounters() {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        this.counters.set('total', data.visitorCount);
        this.counters.set('unique', data.uniqueVisitors);
        this.updateDisplay();
      }
    } catch (error) {
      // Silently fail - demo data will be used
    }
  }
  
  /**
   * Use demo data when API is not available
   */
  useDemoData() {
    const baseTotal = Math.floor(Math.random() * 1000) + 500;
    const baseUnique = Math.floor(baseTotal * 0.7);
    
    this.counters.set('total', baseTotal);
    this.counters.set('unique', baseUnique);
    this.updateDisplay();
  }
  
  /**
   * Animate counter numbers
   */
  animateCounter(element, targetValue, duration = 2000) {
    const startValue = parseInt(element.textContent.replace(/[^\d]/g, '')) || 0;
    const increment = (targetValue - startValue) / (duration / 16);
    let currentValue = startValue;
    
    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        currentValue = targetValue;
        clearInterval(timer);
      }
      element.textContent = Math.floor(currentValue).toLocaleString();
    }, 16);
  }
  
  /**
   * Update the display with current counter values
   */
  updateDisplay() {
    const totalElement = document.getElementById('total-visitors');
    const uniqueElement = document.getElementById('unique-visitors');
    const lastUpdatedElement = document.getElementById('last-updated');
    
    if (totalElement && this.counters.has('total')) {
      this.animateCounter(totalElement, this.counters.get('total'));
    }
    
    if (uniqueElement && this.counters.has('unique')) {
      this.animateCounter(uniqueElement, this.counters.get('unique'));
    }
    
    if (lastUpdatedElement) {
      lastUpdatedElement.textContent = new Date().toLocaleTimeString();
    }
  }
  
  /**
   * Get current visitor count
   */
  getVisitorCount() {
    return {
      total: this.counters.get('total') || 0,
      unique: this.counters.get('unique') || 0
    };
  }
}

// Initialize visitor counter when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Only initialize if we're on a page with visitor counter
  if (document.querySelector('.visitor-counter-section')) {
    window.visitorCounter = new VisitorCounter();
  }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VisitorCounter;
}
