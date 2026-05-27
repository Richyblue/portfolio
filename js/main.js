$(function() {

  // 📱 Detect Mobile
  const isMobile = window.innerWidth <= 768;

  // =========================
  // Desktop Section System
  // =========================
  let current = 0;
  let total = 6;
  let animating = false;

  // =========================
  // Custom Cursor
  // =========================
  if (!isMobile) {

    $(document).on('mousemove', function(e) {

      $('#cursor').css({
        left: e.clientX,
        top: e.clientY
      });

      setTimeout(function() {

        $('#cursor-ring').css({
          left: e.clientX,
          top: e.clientY
        });

      }, 60);

    });

    $('a, button, .nav-dot, .project-card, .service-card, .social-btn, .btn-glow, .btn-outline-glow')
    .on('mouseenter', function() {

      $('#cursor').css({
        transform: 'translate(-50%,-50%) scale(2.5)',
        background: 'var(--accent2)'
      });

      $('#cursor-ring').css({
        width: '60px',
        height: '60px',
        opacity: '.3'
      });

    }).on('mouseleave', function() {

      $('#cursor').css({
        transform: 'translate(-50%,-50%) scale(1)',
        background: 'var(--accent)'
      });

      $('#cursor-ring').css({
        width: '38px',
        height: '38px',
        opacity: '.7'
      });

    });

  }

  // =========================
  // MOBILE MODE
  // =========================
  if (isMobile) {

    // Show all sections naturally
    $('.section').css({
      display: 'block',
      opacity: 1,
      visibility: 'visible',
      position: 'relative',
      transform: 'none',
      minHeight: 'auto',
      height: 'auto'
    });

    // Remove active logic
    $('.section').addClass('active');

    // Disable body lock
    $('body').css({
      overflowY: 'auto'
    });

  }

  // =========================
  // DESKTOP SECTION NAVIGATION
  // =========================
  if (!isMobile) {

    // Go To Section
    window.goTo = function(idx) {

      if (animating || idx === current || idx < 0 || idx >= total) return;

      animating = true;

      const dir = idx > current ? 1 : -1;

      const $cur = $('#sec-' + current);
      const $next = $('#sec-' + idx);

      // Animate Out
      gsap.to($cur.find('.section-content'), {

        y: dir * -50,
        opacity: 0,
        duration: .4,
        ease: 'power2.in',

        onComplete: function() {

          $cur.removeClass('active');

          $cur.find('.section-content').css({
            opacity: 0,
            transform: 'translateY(30px)'
          });

        }

      });

      // Animate In
      $next.addClass('active');

      gsap.fromTo(
        $next.find('.section-content'),

        {
          y: dir * 60,
          opacity: 0
        },

        {
          y: 0,
          opacity: 1,
          duration: .6,
          ease: 'power3.out',
          delay: .25,

          onComplete: function() {

            animating = false;
            onSectionActive(idx);

          }

        }

      );

      // Update Nav
      $('.nav-dot').removeClass('active');

      $('[data-section="' + idx + '"]').addClass('active');

      current = idx;

    };

    // =========================
    // Nav Dots
    // =========================
    $('.nav-dot').on('click', function() {

      goTo(parseInt($(this).data('section'), 10));

    });

    // =========================
    // Wheel Scroll
    // =========================
    // Wheel scroll (Desktop only)
if (!isMobile) {

  let lastWheel = 0;

  $(window).on('wheel', function(e) {

    const now = Date.now();

    if (now - lastWheel < 800) return;

    lastWheel = now;

    if (e.originalEvent.deltaY > 0) {
      goTo(current + 1);
    } else {
      goTo(current - 1);
    }

  });

}

    // =========================
    // Touch Support
    // =========================
    // Touch support (Desktop only)
if (!isMobile) {

  let touchStartY = 0;

  $(document).on('touchstart', function(e) {

    touchStartY = e.originalEvent.touches[0].clientY;

  });

  $(document).on('touchend', function(e) {

    const diff = touchStartY - e.originalEvent.changedTouches[0].clientY;

    if (Math.abs(diff) > 40) {

      if (diff > 0) goTo(current + 1);
      else goTo(current - 1);

    }

  });

}

    // =========================
    // Keyboard
    // =========================
    $(document).on('keydown', function(e) {

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        goTo(current + 1);
      }

      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        goTo(current - 1);
      }

    });

  }

  // =========================
  // Section Animations
  // =========================
  function onSectionActive(idx) {

    if (idx === 3) {

      $('.counter').each(function() {

        const $this = $(this);
        const target = parseInt($this.data('target'), 10);

        $({ n: 0 }).animate({ n: target }, {

          duration: 1600,
          easing: 'swing',

          step: function() {

            $this.text(Math.floor(this.n));

          },

          complete: function() {

            $this.text(target);

          }

        });

      });

      $('.skill-bar-fill').each(function() {

        $(this).css('width', $(this).data('width') + '%');

      });

    }

  }

  // 📱 Mobile Counter & Skill Animation
if (isMobile) {

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        // Counter Animation
        $(entry.target).find('.counter').each(function() {

          const $this = $(this);

          // Prevent repeat animation
          if ($this.hasClass('animated')) return;

          $this.addClass('animated');

          const target = parseInt($this.data('target'), 10);

          $({ n: 0 }).animate({ n: target }, {

            duration: 1600,
            easing: 'swing',

            step: function() {

              $this.text(Math.floor(this.n));

            },

            complete: function() {

              $this.text(target);

            }

          });

        });

        // Skill Bars
        $(entry.target).find('.skill-bar-fill').each(function() {

          const $this = $(this);

          if ($this.hasClass('animated')) return;

          $this.addClass('animated');

          $this.css({
            width: $this.data('width') + '%',
            transition: 'width 1.5s ease'
          });

        });

      }

    });

  }, {
    threshold: 0.3
  });

  $('.section').each(function() {
    observer.observe(this);
  });

}

  // =========================
  // Initial Animations
  // =========================
  if (!isMobile) {

    gsap.fromTo('#sec-0 .section-content',

      {
        y: 50,
        opacity: 0
      },

      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: .3
      }

    );

  }

  // Project Popup Modal 
  function openModal(card) {
    const $c = $(card);
    const title = $c.data('title');
    const img   = $c.data('img');
	const tags = String($c.data('tags') || '').split(',');
    const desc  = $c.data('desc');
    const role  = $c.data('role');
    const year  = $c.data('year');
    const stack = $c.data('stack');
    const live  = $c.data('live');
    const gh    = $c.data('github');

    $('#modal-img').attr('src', img);
    $('#modal-title').text(title);
    $('#modal-desc').text(desc);
    $('#modal-role').text(role);
    $('#modal-year').text(year);
    $('#modal-stack').text(stack);
    $('#modal-live').attr('href', live);
    $('#modal-preview').attr('src', live);
    $('#modal-github').attr('href', gh);

    const chipsHtml = tags.map(t => `<span class="modal-chip">${$.trim(t)}</span>`).join('');
    $('#modal-chips').html(chipsHtml);

    $('#proj-modal').addClass('open');
    $('body').css('overflow', 'hidden');
  }

  function closeModal() {

    $('#proj-modal').removeClass('open');
  
    $('body').css('overflow', '');
  
    // Stop iframe when modal closes
    $('#modal-preview').attr('src', '');
  
  }

  $(document).on('click', '.project-card', function() { openModal(this); });
  $('#modal-close, #modal-backdrop').on('click', closeModal);
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

});