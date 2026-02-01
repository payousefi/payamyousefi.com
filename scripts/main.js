/**
 * Main JavaScript - Vanilla JS (no jQuery)
 * Modernized from jQuery version
 * ES5 compatible for older minifiers
 */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {

    // Cache DOM elements
    var categoryLinks = document.querySelectorAll('.category-list a');
    var categoriesSection = document.querySelector('.categories');
    var socialSection = document.querySelector('.social');
    var portfolioSection = document.querySelector('.portfolio');
    var homeCategoryList = document.querySelector('.home .category-list');
    var menuIcon = document.querySelector('.menu-icon');
    var siteNav = document.querySelector('.site-nav');

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
     * Get current tab from URL hash or default to 'apps'
     * @returns {string} Current tab name
     */
    function getCurrentTab() {
      var hash = window.location.hash.replace('#', '');
      var matchingLink = document.querySelector('.category-list a[href="#' + hash + '"]');
      return (hash && matchingLink) ? hash : 'apps';
    }

    /**
     * Shift portfolio to show the current tab
     */
    function shift() {
      if (categoryLinks.length === 0) return; // Don't bother if not on home page

      var currentTab = getCurrentTab();
      var currentLink = document.querySelector('.category-list a[href="#' + currentTab + '"]');
      
      if (!currentLink) return;

      // Update selected state on category links
      Array.prototype.forEach.call(categoryLinks, function(link) {
        link.classList.remove('selected');
      });
      currentLink.classList.add('selected');

      // Also update sticky nav if it exists
      var stickyLinks = document.querySelectorAll('.sticky-nav .category-list a');
      Array.prototype.forEach.call(stickyLinks, function(link) {
        if (link.getAttribute('href') === '#' + currentTab) {
          link.classList.add('selected');
        } else {
          link.classList.remove('selected');
        }
      });

      // Calculate portfolio index and transform
      var homeLinks = document.querySelectorAll('.home .category-list a');
      var homeLinkArray = Array.prototype.slice.call(homeLinks);
      var currentHomeLink = document.querySelector('.home .category-list a[href="#' + currentTab + '"]');
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
     * Handle category link clicks
     * @param {Event} e - Click event
     */
    function handleCategoryClick(e) {
      e.preventDefault();
      var href = this.getAttribute('href');
      window.location.hash = href;
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
        stickyNav.innerHTML = '<div class="wrapper"><div class="category-list">' + homeCategoryList.innerHTML + '</div></div>';
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
          if (link.getAttribute('href') === '#' + currentTab) {
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

    // Hash change (browser back/forward)
    window.addEventListener('hashchange', function(e) {
      if (categoryLinks.length === 0) return;
      e.preventDefault();
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
