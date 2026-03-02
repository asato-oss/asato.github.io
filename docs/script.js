document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.sidebar-link');
  const pages = document.querySelectorAll('.page');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const tocList = document.getElementById('toc-list');
  const tocContainer = document.getElementById('toc');

  let tocHeadings = [];

  function buildToc(pageEl) {
    tocList.innerHTML = '';
    tocHeadings = [];

    if (!pageEl) return;

    const headings = pageEl.querySelectorAll('h2, h3');
    if (headings.length === 0) {
      tocContainer.style.display = 'none';
      return;
    }
    tocContainer.style.display = '';

    headings.forEach((heading, i) => {
      const id = heading.id || `section-${i}`;
      heading.id = id;

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${id}`;
      a.className = 'toc-link' + (heading.tagName === 'H3' ? ' toc-h3' : '');
      a.textContent = heading.textContent.replace(/\s*(ICATU|EMPRESA|SOMENTE ICATU|VISÃO RH|VISÃO ICATU)\s*/g, '').trim();
      a.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      li.appendChild(a);
      tocList.appendChild(li);
      tocHeadings.push({ el: heading, link: a });
    });

    updateTocHighlight();
  }

  function updateTocHighlight() {
    if (tocHeadings.length === 0) return;

    const scrollY = window.scrollY + 100;
    let activeIndex = 0;

    for (let i = tocHeadings.length - 1; i >= 0; i--) {
      if (tocHeadings[i].el.offsetTop <= scrollY) {
        activeIndex = i;
        break;
      }
    }

    tocHeadings.forEach(({ link }, i) => {
      link.classList.toggle('active', i === activeIndex);
    });
  }

  function navigateTo(id) {
    pages.forEach(p => p.classList.remove('active'));
    links.forEach(l => l.classList.remove('active'));

    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    const activeLink = document.querySelector(`.sidebar-link[data-page="${id}"]`);
    if (activeLink) activeLink.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'instant' });
    closeSidebar();

    buildToc(target);
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  }

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = link.dataset.page;
      window.location.hash = pageId;
      navigateTo(pageId);
    });
  });

  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  });

  overlay.addEventListener('click', closeSidebar);

  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
    scrollTimeout = requestAnimationFrame(updateTocHighlight);
  });

  const hash = window.location.hash.slice(1);
  navigateTo(hash || 'primeiro-acesso');

  window.addEventListener('hashchange', () => {
    navigateTo(window.location.hash.slice(1));
  });
});
