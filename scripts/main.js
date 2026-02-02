/**
 * Main JavaScript - Vanilla JS (no jQuery)
 * Modernized from jQuery version
 * ES5 compatible for older minifiers
 */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // Theme Toggle (Dark Mode)
    // ==========================================
    
    var themeToggles = document.querySelectorAll('.theme-toggle');
    var htmlElement = document.documentElement;
    var THEME_KEY = 'theme-preference';
    
    /**
     * Get the user's theme preference
     * Priority: localStorage > system preference > light
     * @returns {string} 'dark' or 'light'
     */
    function getThemePreference() {
      var stored = localStorage.getItem(THEME_KEY);
      if (stored) {
        return stored;
      }
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    }
    
    /**
     * Apply theme to the document and update button labels
     * @param {string} theme - 'dark' or 'light'
     */
    function applyTheme(theme) {
      // Always set the data-theme attribute to enable manual override of system preference
      htmlElement.setAttribute('data-theme', theme);
      
      // Update button labels to describe what clicking will do (for all theme toggles)
      var label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      themeToggles.forEach(function(toggle) {
        toggle.setAttribute('aria-label', label);
        toggle.setAttribute('title', label);
      });
    }
    
    /**
     * Toggle between light and dark themes
     */
    function toggleTheme() {
      var currentTheme = htmlElement.getAttribute('data-theme');
      var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem(THEME_KEY, newTheme);
    }
    
    // Initialize theme on page load
    applyTheme(getThemePreference());
    
    // Listen for theme toggle button clicks (all theme toggles)
    themeToggles.forEach(function(toggle) {
      toggle.addEventListener('click', toggleTheme);
    });
    
    // Listen for system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        // When system preference changes, follow it and clear any manual override
        localStorage.removeItem(THEME_KEY);
        applyTheme(e.matches ? 'dark' : 'light');
      });
    }

    // ==========================================
    // Portfolio Navigation (SPA-like with History API)
    // ==========================================

    // Cache DOM elements
    var categoryLinks = document.querySelectorAll('.category-list a');
    var categoriesSection = document.querySelector('.categories');
    var socialSection = document.querySelector('.social');
    var portfolioSection = document.querySelector('.portfolio');
    var homeCategoryList = document.querySelector('.home .category-list');
    var menuIcon = document.querySelector('.menu-icon');
    var siteNav = document.querySelector('.site-nav');
    
    // Default category (first in list)
    var defaultCategory = 'apps';

    /**
     * Smooth scroll to element
     * @param {Element} element - Target element to scroll to
     * @param {number} offset - Offset from top (default: 0)
     */
    function smoothScrollTo(element, offset) {
      if (offset === undefined) offset = 0;
      if (!element) return;
      
      var targetPosition = element.getBoundingClientRect().top + window.pageYOffset + offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }

    /**
     * Get all valid URL slugs from the category links
     * @returns {Array} Array of valid URL slugs
     */
    function getValidSlugs() {
      var slugs = [];
      Array.prototype.forEach.call(categoryLinks, function(link) {
        var slug = link.getAttribute('data-slug');
        if (slug) slugs.push(slug);
      });
      return slugs;
    }

    /**
     * Get current tab (category ID) from URL path or default to 'apps'
     * URL structure: /, /apps, /content-sites, /graphic, /science
     * @returns {string} Current category ID
     */
    function getCurrentTab() {
      var path = window.location.pathname;
      // Remove trailing slash and get last segment (URL slug)
      var segments = path.replace(/\/$/, '').split('/');
      var lastSegment = segments[segments.length - 1];
      
      // Find the category link that matches this URL slug
      if (lastSegment) {
        var matchingLink = document.querySelector('.category-list a[data-slug="' + lastSegment + '"]');
        if (matchingLink) {
          // Return the category ID, not the slug
          return matchingLink.getAttribute('data-category');
        }
      }
      
      return defaultCategory;
    }

    /**
     * Build URL for a category using its slug
     * @param {string} categoryId - Category ID
     * @returns {string} URL path (e.g., /apps, /content-sites, /graphic, /science)
     */
    function buildCategoryUrl(categoryId) {
      // Get the slug for this category from the link
      var link = document.querySelector('.category-list a[data-category="' + categoryId + '"]');
      var slug = link ? link.getAttribute('data-slug') : categoryId;
      
      // Get base path (handle subdirectory deployments)
      var basePath = '/';
      
      // Check if we're in a subdirectory by looking at the current path
      var path = window.location.pathname;
      var segments = path.replace(/\/$/, '').split('/').filter(Boolean);
      
      // If current path has a category slug at the end, remove it to get base
      var lastSegment = segments[segments.length - 1];
      var validSlugs = getValidSlugs();
      if (validSlugs.indexOf(lastSegment) !== -1) {
        segments.pop();
      }
      
      // Rebuild base path
      if (segments.length > 0) {
        basePath = '/' + segments.join('/') + '/';
      }
      
      return basePath + slug;
    }

    /**
     * Shift portfolio to show the current tab
     */
    function shift() {
      if (categoryLinks.length === 0) return; // Don't bother if not on home page

      var currentTab = getCurrentTab();
      var currentLink = document.querySelector('.category-list a[data-category="' + currentTab + '"]');
      
      if (!currentLink) return;

      // Update selected state on category links
      Array.prototype.forEach.call(categoryLinks, function(link) {
        link.classList.remove('selected');
      });
      currentLink.classList.add('selected');

      // Also update sticky nav if it exists
      var stickyLinks = document.querySelectorAll('.sticky-nav .category-list a');
      Array.prototype.forEach.call(stickyLinks, function(link) {
        if (link.getAttribute('data-category') === currentTab) {
          link.classList.add('selected');
        } else {
          link.classList.remove('selected');
        }
      });

      // Calculate portfolio index and transform
      var homeLinks = document.querySelectorAll('.home .category-list a');
      var homeLinkArray = Array.prototype.slice.call(homeLinks);
      var currentHomeLink = document.querySelector('.home .category-list a[data-category="' + currentTab + '"]');
      var portfolioIndex = homeLinkArray.indexOf(currentHomeLink);

      // Apply transform to all tab sections
      var tabSections = document.querySelectorAll('section[class^="tab-"]');
      Array.prototype.forEach.call(tabSections, function(section) {
        section.style.transform = 'translate3D(-' + (100 * portfolioIndex) + '%, 0, 0)';
      });

      // Accessibility: Hide non-active tabs from screen readers and keyboard navigation
      Array.prototype.forEach.call(tabSections, function(section) {
        var isActive = section.classList.contains('tab-' + currentTab);
        section.setAttribute('aria-hidden', !isActive);
        
        var focusableElements = section.querySelectorAll('a, button, input, select, textarea, [tabindex]');
        Array.prototype.forEach.call(focusableElements, function(el) {
          if (isActive) {
            el.removeAttribute('tabindex');
          } else {
            el.setAttribute('tabindex', '-1');
          }
        });
      });

      // Resize portfolio to fit after transition
      setTimeout(function() {
        Array.prototype.forEach.call(tabSections, function(section) {
          var isActive = section.classList.contains('tab-' + currentTab);
          section.style.height = isActive ? 'auto' : '0px';
        });
        
        var activeSection = document.querySelector('section.tab-' + currentTab);
        if (activeSection && portfolioSection) {
          portfolioSection.style.maxHeight = activeSection.scrollHeight + 'px';
        }
      }, 800);
    }

    /**
     * Handle category link clicks - SPA navigation with History API
     * @param {Event} e - Click event
     */
    function handleCategoryClick(e) {
      e.preventDefault();
      
      var category = this.getAttribute('data-category');
      var url = buildCategoryUrl(category);
      
      // Update URL without page reload using History API
      history.pushState({ category: category }, '', url);
      
      shift();
      smoothScrollTo(categoriesSection, 1);
    }

    /**
     * Create and manage sticky navigation
     */
    function handleStickyNav() {
      if (!categoriesSection || !socialSection) return;

      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var categoriesTop = categoriesSection.getBoundingClientRect().top + scrollTop;
      var socialTop = socialSection.getBoundingClientRect().top + scrollTop;
      var existingStickyNav = document.querySelector('.sticky-nav');

      var shouldShowSticky = scrollTop > categoriesTop &&
                             scrollTop < (socialTop - 100) &&
                             !existingStickyNav;

      var shouldHideSticky = (scrollTop <= categoriesTop || scrollTop >= (socialTop - 100)) &&
                             existingStickyNav;

      if (shouldShowSticky && homeCategoryList) {
        // Create sticky nav
        var stickyNav = document.createElement('div');
        stickyNav.className = 'sticky-nav';
        stickyNav.innerHTML = '<div class="wrapper"><nav class="category-list">' + homeCategoryList.innerHTML + '</nav></div>';
        document.body.appendChild(stickyNav);
        
        // Trigger reflow then add active class for animation
        stickyNav.offsetHeight;
        stickyNav.classList.add('active');

        // Hide original list
        if (homeCategoryList) {
          homeCategoryList.style.opacity = '0';
        }

        // Add click events to sticky nav links
        var stickyNavLinks = stickyNav.querySelectorAll('.category-list a');
        Array.prototype.forEach.call(stickyNavLinks, function(link) {
          link.addEventListener('click', handleCategoryClick);
        });

        // Update selected state
        var currentTab = getCurrentTab();
        Array.prototype.forEach.call(stickyNavLinks, function(link) {
          if (link.getAttribute('data-category') === currentTab) {
            link.classList.add('selected');
          } else {
            link.classList.remove('selected');
          }
        });
      } else if (shouldHideSticky) {
        existingStickyNav.parentNode.removeChild(existingStickyNav);
        if (homeCategoryList) {
          homeCategoryList.style.opacity = '1';
        }
      }
    }

    /**
     * Handle mobile menu toggle
     */
    function handleMenuToggle() {
      if (!siteNav || !menuIcon) return;
      
      var isExpanded = siteNav.classList.contains('active');
      if (isExpanded) {
        siteNav.classList.remove('active');
      } else {
        siteNav.classList.add('active');
      }
      menuIcon.setAttribute('aria-expanded', !isExpanded);
    }

    // Initialize
    shift();

    // Event Listeners
    
    // Category link clicks
    if (categoryLinks.length > 0) {
      Array.prototype.forEach.call(categoryLinks, function(link) {
        link.addEventListener('click', handleCategoryClick);
      });
    }

    // Handle browser back/forward with History API
    window.addEventListener('popstate', function(e) {
      if (categoryLinks.length === 0) return;
      shift();
    });

    // Smooth scroll to contact section
    var contactLinks = document.querySelectorAll('a[href="#contact"]');
    Array.prototype.forEach.call(contactLinks, function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var contactSection = document.getElementById('contact');
        smoothScrollTo(contactSection, 1);
      });
    });

    // Sticky portfolio nav on scroll
    var scrollTimeout = null;
    document.addEventListener('scroll', function() {
      // Throttle scroll handler
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(function() {
        scrollTimeout = null;
        handleStickyNav();
      }, 16); // ~60fps
    }, { passive: true });

    // Mobile menu toggle
    if (menuIcon) {
      menuIcon.addEventListener('click', handleMenuToggle);
    }

  });
})();
