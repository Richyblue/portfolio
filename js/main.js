$(function() {

  // State 
  let current = 0;
  let total = 6;
  let animating = false;

  // Custom Cursor 
  $(document).on('mousemove', function(e) {
    $('#cursor').css({ left: e.clientX, top: e.clientY });
    setTimeout(function() {
      $('#cursor-ring').css({ left: e.clientX, top: e.clientY });
    }, 60);
  });
  $('a, button, .nav-dot, .project-card, .service-card, .social-btn, .btn-glow, .btn-outline-glow').on('mouseenter', function() {
    $('#cursor').css({ transform: 'translate(-50%,-50%) scale(2.5)', background: 'var(--accent2)' });
    $('#cursor-ring').css({ width: '60px', height: '60px', opacity: '.3' });
  }).on('mouseleave', function() {
    $('#cursor').css({ transform: 'translate(-50%,-50%) scale(1)', background: 'var(--accent)' });
    $('#cursor-ring').css({ width: '38px', height: '38px', opacity: '.7' });
  });

  // Go to section 
  window.goTo = function(idx) {
    if (animating || idx === current || idx < 0 || idx >= total) return;
    animating = true;
    const dir = idx > current ? 1 : -1;
    const $cur = $('#sec-' + current);
    const $next = $('#sec-' + idx);

    // Animate out current
    gsap.to($cur.find('.section-content'), {
      y: dir * -50, opacity: 0, duration: .4,
      ease: 'power2.in',
      onComplete: function() {
        $cur.removeClass('active');
        $cur.find('.section-content').css({ opacity: 0, transform: 'translateY(30px)' });
      }
    });

    // Animate in next
    $next.addClass('active');
    gsap.fromTo($next.find('.section-content'),
      { y: dir * 60, opacity: 0 },
      { y: 0, opacity: 1, duration: .6, ease: 'power3.out', delay: .25,
        onComplete: function() {
          animating = false;
          onSectionActive(idx);
        }
      }
    );

    // Update nav
    $('.nav-dot').removeClass('active');
    $('[data-section="' + idx + '"]').addClass('active');
    current = idx;
  };

  function onSectionActive(idx) {
    if (idx === 3) {
      // Animate counters
      $('.counter').each(function() {
        const $this = $(this);
        const target = parseInt($this.data('target'), 10);
        $({ n: 0 }).animate({ n: target }, {
          duration: 1600, easing: 'swing',
          step: function() { $this.text(Math.floor(this.n)); },
          complete: function() { $this.text(target); }
        });
      });
      // Animate skill bars
      $('.skill-bar-fill').each(function() {
        $(this).css('width', $(this).data('width') + '%');
      });
    }
  }

  // Nav dots 
  $('.nav-dot').on('click', function() {
    goTo(parseInt($(this).data('section'), 10));
  });

  // // Wheel scroll 
  // let lastWheel = 0;
  // $(window).on('wheel', function(e) {
  //   const now = Date.now();
  //   if (now - lastWheel < 800) return;
  //   lastWheel = now;
  //   if (e.originalEvent.deltaY > 0) goTo(current + 1);
  //   else goTo(current - 1);
  // });

  $(window).on('wheel', function(e) {

    const activeSection = $('#sec-' + current)[0];
  
    const atTop = activeSection.scrollTop === 0;
  
    const atBottom =
      activeSection.scrollHeight - activeSection.scrollTop <= activeSection.clientHeight + 5;
  
    if (e.originalEvent.deltaY > 0 && atBottom) {
      goTo(current + 1);
    }
  
    else if (e.originalEvent.deltaY < 0 && atTop) {
      goTo(current - 1);
    }
  
  });

  // // Touch support 
  // let touchStartY = 0;
  // $(document).on('touchstart', function(e) {
  //   touchStartY = e.originalEvent.touches[0].clientY;
  // });
  // $(document).on('touchend', function(e) {
  //   const diff = touchStartY - e.originalEvent.changedTouches[0].clientY;
  //   if (Math.abs(diff) > 100) {
  //     if (diff > 0) goTo(current + 1);
  //     else goTo(current - 1);
  //   }
  // });

  // 📱 Better Mobile Touch Handling
let touchStartY = 0;

$(document).on('touchstart', function(e) {
  touchStartY = e.originalEvent.touches[0].clientY;
});

$(document).on('touchend', function(e) {

  const touchEndY = e.originalEvent.changedTouches[0].clientY;
  const diff = touchStartY - touchEndY;

  const activeSection = $('#sec-' + current)[0];

  // 🔥 Allow internal scrolling first
  const atTop = activeSection.scrollTop === 0;

  const atBottom =
    activeSection.scrollHeight - activeSection.scrollTop <= activeSection.clientHeight + 5;

  // Swipe Up → Next Section
  if (diff > 100 && atBottom) {
    goTo(current + 1);
  }

  // Swipe Down → Previous Section
  else if (diff < -100 && atTop) {
    goTo(current - 1);
  }

});

  // Keyboard 
  $(document).on('keydown', function(e) {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') goTo(current + 1);
    if (e.key === 'ArrowUp' || e.key === 'PageUp') goTo(current - 1);
  });

  // Initial entrance animation 
  gsap.fromTo('#sec-0 .section-content',
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: .3 }
  );
  gsap.fromTo('#topbar',
    { y: -30, opacity: 0 },
    { y: 0, opacity: 1, duration: .8, ease: 'power3.out', delay: .5 }
  );
  gsap.fromTo('#main-nav',
    { x: 30, opacity: 0 },
    { x: 0, opacity: 1, duration: .8, ease: 'power3.out', delay: .7 }
  );

  // Orb parallax on mouse 
  $(document).on('mousemove', function(e) {
    const cx = e.clientX / window.innerWidth - .5;
    const cy = e.clientY / window.innerHeight - .5;
    gsap.to('.orb-1', { x: cx * 40, y: cy * 40, duration: 2, ease: 'power1.out' });
    gsap.to('.orb-2', { x: cx * -30, y: cy * -30, duration: 2, ease: 'power1.out' });
    gsap.to('.orb-3', { x: cx * 20, y: cy * 20, duration: 2, ease: 'power1.out' });
  });

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
    $('#modal-github').attr('href', gh);

    const chipsHtml = tags.map(t => `<span class="modal-chip">${$.trim(t)}</span>`).join('');
    $('#modal-chips').html(chipsHtml);

    $('#proj-modal').addClass('open');
    $('body').css('overflow', 'hidden');
  }

  function closeModal() {
    $('#proj-modal').removeClass('open');
    $('body').css('overflow', '');
  }

  $(document).on('click', '.project-card', function() { openModal(this); });
  $('#modal-close, #modal-backdrop').on('click', closeModal);
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

});