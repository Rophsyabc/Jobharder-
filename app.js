document.addEventListener('DOMContentLoaded', () => {
  // --- UI Elements ---
  const previewBar = document.getElementById('previewBar');
  const closePreviewBar = document.getElementById('closePreviewBar');
  const restorePreviewBar = document.getElementById('restorePreviewBar');
  const installGuideBtn = document.getElementById('installGuideBtn');
  const closeGuideModal = document.getElementById('closeGuideModal');
  const guideModal = document.getElementById('guideModal');
  const downloadXmlBtn = document.getElementById('downloadXmlBtn');
  
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const toastContainer = document.getElementById('toastContainer');
  
  const videoCards = document.querySelectorAll('.video-card');
  const videoLightbox = document.getElementById('videoLightbox');
  const lightboxVideoTitle = document.getElementById('lightboxVideoTitle');
  const closeVideoLightbox = document.getElementById('closeVideoLightbox');

  // --- Reading Progress Bar ---
  const progressBar = document.getElementById('reading-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

  // ---- MOBILE HAMBURGER & DRAWER TOGGLE ----
  var hbg = document.getElementById('hamburger');
  var nav = document.getElementById('mainNav');
  var overlay = document.getElementById('mobileOverlay');

  function closeMenu() {
    if (hbg) hbg.classList.remove('open');
    if (nav) nav.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    if (nav) {
      nav.querySelectorAll('.nav-dropdown.expanded').forEach(function(d) {
        d.classList.remove('expanded');
      });
    }
  }

  function openMenu() {
    if (hbg) hbg.classList.add('open');
    if (nav) nav.classList.add('open');
    if (overlay) overlay.classList.add('open');
  }

  // ---- HAMBURGER CLICK ----
  if (hbg) {
    hbg.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation(); // CRITICAL: Stop event from bubbling
      var isOpened = nav && nav.classList.contains('open');
      if (isOpened) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  // ---- OVERLAY CLICK ----
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeMenu();
      }
    });
  }

  // ---- CLOSE ON ESCAPE KEY ----
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('open')) {
      closeMenu();
    }
  });

  // ---- SWIPE TO CLOSE (Improved) ----
  var touchStartX = 0;
  if (nav) {
    nav.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    nav.addEventListener('touchend', function(e) {
      var touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      
      if (diff > 100 && !e.target.classList.contains('mob-arrow')) { 
        closeMenu();
      }
    }, {passive: true});
  }

  // ---- MOBILE ACCORDION DROPDOWNS ----
  if (nav) {
    nav.querySelectorAll('.nav-dropdown').forEach(function(dropdown) {
      var parentLink = dropdown.querySelector(':scope > a');
      var subMenu = dropdown.querySelector(':scope > .dropdown-menu');
      if (!parentLink || !subMenu) return;

      if (!parentLink.querySelector('.mob-arrow')) {
        var arrow = document.createElement('span');
        arrow.className = 'mob-arrow';
        arrow.setAttribute('aria-hidden', 'true');
        arrow.innerHTML = '&#9660;';
        parentLink.appendChild(arrow);
      }

      if (parentLink.getAttribute('href') === '#') {
        parentLink.setAttribute('href', 'javascript:void(0)');
      }

      parentLink.addEventListener('click', function(e) {
        if (window.innerWidth <= 900 || (nav && nav.classList.contains('open'))) {
          e.preventDefault();
          e.stopPropagation();
          var currentlyExpanded = dropdown.classList.contains('expanded');
          nav.querySelectorAll('.nav-dropdown.expanded').forEach(function(other) {
            if (other !== dropdown) other.classList.remove('expanded');
          });
          dropdown.classList.toggle('expanded', !currentlyExpanded);
        }
      });
    });

    nav.querySelectorAll('a[href^="#"]').forEach(function(anchorLink) {
      var href = anchorLink.getAttribute('href');
      if (!href || href === '#' || href === '#!' || href === 'javascript:void(0)') return;
      if (anchorLink.matches('.nav-dropdown > a')) return;

      anchorLink.addEventListener('click', function() {
        if (nav && nav.classList.contains('open')) {
          closeMenu();
        }
      });
    });
  }

  // --- Table of Contents (TOC) Generator ---
  const postBody = document.getElementById('post-body');
  const tocList = document.getElementById('toc-list');
  const tocToggle = document.getElementById('toc-toggle');
  const tocContainer = document.getElementById('toc-container');

  if (postBody && tocList) {
    const headings = postBody.querySelectorAll('h2, h3');
    if (headings.length > 0) {
      headings.forEach((heading, idx) => {
        const id = 'heading-' + idx;
        heading.setAttribute('id', id);

        const li = document.createElement('li');
        if (heading.tagName.toLowerCase() === 'h3') {
          li.className = 'toc-h3';
        }
        const a = document.createElement('a');
        a.href = '#' + id;
        a.textContent = heading.textContent;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          heading.scrollIntoView({ behavior: 'smooth' });
        });
        li.appendChild(a);
        tocList.appendChild(li);
      });
    } else if (tocContainer) {
      tocContainer.style.display = 'none';
    }

    if (tocToggle) {
      tocToggle.addEventListener('click', () => {
        if (tocList.style.display === 'none') {
          tocList.style.display = 'block';
          tocToggle.textContent = 'Collapse ▲';
        } else {
          tocList.style.display = 'none';
          tocToggle.textContent = 'Expand ▼';
        }
      });
    }
  }

  // --- Live Match Simulation ---
  const liveTime = document.getElementById('live-time');
  const liveHome = document.getElementById('live-home');
  const liveAway = document.getElementById('live-away');
  
  let matchMinute = 74;
  let homeScore = 0;
  let awayScore = 0;
  
  const simulateLiveMatch = () => {
    if (!liveTime) return;
    setInterval(() => {
      if (matchMinute < 90) {
        matchMinute++;
        liveTime.textContent = `${matchMinute}'`;
        
        if (Math.random() < 0.03) {
          const isHomeGoal = Math.random() > 0.5;
          if (isHomeGoal) {
            homeScore++;
            liveHome.textContent = homeScore;
            showToast('⚽ GOAL! Enugu United scores!');
            highlightScore(liveHome);
          } else {
            awayScore++;
            liveAway.textContent = awayScore;
            showToast('⚽ GOAL! Kano City scores!');
            highlightScore(liveAway);
          }
        }
      } else if (matchMinute === 90) {
        matchMinute++;
        liveTime.textContent = 'FT';
        liveTime.classList.remove('live');
        showToast('🏁 Full Time: Enugu United ' + homeScore + ' - ' + awayScore + ' Kano City');
      }
    }, 8000);
  };
  
  const highlightScore = (element) => {
    if (!element) return;
    element.style.color = 'var(--accent)';
    element.style.transform = 'scale(1.4)';
    element.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      element.style.color = '';
      element.style.transform = '';
    }, 1500);
  };
  
  simulateLiveMatch();

  // --- Preview Bar Toolbar Logic ---
  if (closePreviewBar && previewBar && restorePreviewBar) {
    closePreviewBar.addEventListener('click', () => {
      previewBar.classList.add('hidden');
      document.body.style.paddingTop = '0px';
      setTimeout(() => {
        restorePreviewBar.classList.add('visible');
      }, 300);
    });
  }
  
  if (restorePreviewBar && previewBar) {
    restorePreviewBar.addEventListener('click', () => {
      restorePreviewBar.classList.remove('visible');
      previewBar.classList.remove('hidden');
      const isMobile = window.innerWidth <= 900;
      document.body.style.paddingTop = isMobile ? '90px' : '50px';
    });
  }

  // Modal Open/Close
  if (installGuideBtn && guideModal) {
    installGuideBtn.addEventListener('click', () => {
      guideModal.classList.add('open');
    });
  }
  
  const closeModal = () => {
    if (guideModal) guideModal.classList.remove('open');
  };
  
  if (closeGuideModal) closeGuideModal.addEventListener('click', closeModal);
  if (guideModal) {
    guideModal.addEventListener('click', (e) => {
      if (e.target === guideModal) closeModal();
    });
  }

  // XML File Downloader
  if (downloadXmlBtn) {
    downloadXmlBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = 'theme.xml';
      link.download = 'theme.xml';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('📥 Downloading theme.xml. Save it and upload to Blogger!');
    });
  }

  // --- Video Lightbox Logic ---
  videoCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-video-title');
      if (lightboxVideoTitle) lightboxVideoTitle.textContent = title;
      if (videoLightbox) videoLightbox.classList.add('open');
    });
  });
  
  const closeLightbox = () => {
    if (videoLightbox) videoLightbox.classList.remove('open');
  };
  
  if (closeVideoLightbox) closeVideoLightbox.addEventListener('click', closeLightbox);
  if (videoLightbox) {
    videoLightbox.addEventListener('click', (e) => {
      if (e.target === videoLightbox) closeLightbox();
    });
  }

  // --- Newsletter Form Submission ---
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail ? newsletterEmail.value.trim() : '';
      if (email) {
        showToast(`✉️ Subscribed: ${email}`);
        if (newsletterEmail) newsletterEmail.value = '';
      }
    });
  }

  // --- Custom Toast System ---
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">✓</span>
      <span class="toast-message">${message}</span>
    `;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4000);
  }

  // --- Handle active navigation states ---
  const navLinks = document.querySelectorAll('#mainNav a');
  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      if (link.parentElement.classList.contains('nav-dropdown')) {
        return; 
      }

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const href = link.getAttribute('href');
      if (href && href !== '#' && href !== 'javascript:void(0)') {
         if (nav && nav.classList.contains('open')) {
            closeMenu();
         }
      }
    });
  });
});
