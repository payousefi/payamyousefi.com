$(document).ready(function() {

  function shift() {
      if($('.category-list a').length==0) return; // Don't bother if not on home page

      var currentTab = (window.location.hash && $('.category-list a[href="#' + window.location.hash.replace('#', '') + '"]').length!=0) ? window.location.hash.replace('#', '') : 'apps';

      $('.category-list a').removeClass('selected');
      $('.category-list a[href="#' + currentTab + '"]').addClass('selected');

      var portfolioIndex = $('.category-list a[href="#' + currentTab + '"]').index();
      $('section[class^="tab-"]').css('transform', 'translate3D(-' + 100*portfolioIndex + '%, 0, 0)');
      
      // Accessibility: Hide non-active tabs from screen readers and keyboard navigation
      $('section[class^="tab-"]').not('section.tab-'+currentTab)
        .attr('aria-hidden', 'true')
        .find('a, button, input, select, textarea, [tabindex]').attr('tabindex', '-1');
      
      // Make active tab accessible
      $('section.tab-'+currentTab)
        .attr('aria-hidden', 'false')
        .find('a, button, input, select, textarea, [tabindex="-1"]').removeAttr('tabindex');
            
      // resize portfolio to fit
      setTimeout(function(){
        $('section[class^="tab-"]').not('section.tab-'+currentTab).css('height', '0px');
        $('section.tab-'+currentTab).css('height','auto');
        $('.portfolio').css('max-height', $('section.tab-'+currentTab).get(0).scrollHeight+'px');
      },800);
      
  }

  // Shift over to initial section
  shift();

  // Switch between category sections
  if($('.category-list a').length!=0){
    $('.category-list a').click(function(e) {
        e.preventDefault();
        window.location.hash = $(this).attr('href'); // change location to new section
        shift();

        // scroll down to top of portfolio area
        $('.categories').velocity('scroll', {duration: 750, easing: 'easeout', offset: 1});
    });
  }

  // Also watch for URL change in browser
  $(window).on('hashchange', function(e) {
      if($('.category-list a').length==0) return; // Don't bother if not on home page
      e.preventDefault();
      shift();
  });
  
  // Smooth scroll to contact section
  $('a[href="#contact"]').click(function(e) {
      e.preventDefault();
      $('#contact').velocity('scroll', {duration: 750, easing: 'easeout', offset: 1});
  });

  //Sticky portfolio nav
  $(document).scroll(function(e) {
      if($('.categories').length==0) return; // Don't bother if not on home page
      if(document.body.scrollTop > $('.categories').offset().top && document.body.scrollTop < ($('.social').offset().top-100) && $('.sticky-nav').length == 0) {
          var stickyNav = document.createElement('div');
          stickyNav.className = 'sticky-nav';
          stickyNav.innerHTML = '<div class="wrapper"><div class="category-list">' + $('.category-list').html(); + '</div></div>';
          $('body').append(stickyNav);
          stickyNav.className = 'sticky-nav active';

          // hide list
          $('.home .category-list').css('opacity', '0');

          // re-add events (b/c HTML re-appended)
          $('.sticky-nav .category-list a').click(function(e) {
              e.preventDefault();
              window.location.hash = $(this).attr('href');
              shift();

              // scroll
              $('.categories').velocity('scroll', {duration: 750, easing: 'easeout', offset: 1});
          });
      } else if((document.body.scrollTop < $('.categories').offset().top || document.body.scrollTop > ($('.social').offset().top)-100) && $('.sticky-nav').length > 0) {
          $('.sticky-nav').remove();
          $('.home .category-list').css('opacity', '1');
      }
  });
  
  $(".menu-icon").click(function(){
    var isExpanded = $(".site-nav").hasClass('active');
    if (isExpanded) {
      $(".site-nav").removeClass('active');
      $(this).attr('aria-expanded', 'false');
    } else {
      $(".site-nav").addClass('active');
      $(this).attr('aria-expanded', 'true');
    }
  });
  
});
