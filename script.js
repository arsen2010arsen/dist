document.addEventListener('DOMContentLoaded', () => {
  // 1. Hero interactive release preview switcher
  const stageTabs = document.querySelectorAll('.stage-tab');
  const stageImg = document.getElementById('stageImg');
  const stageName = document.getElementById('stageName');
  const stageMeta = document.getElementById('stageMeta');
  const stageLink = document.getElementById('stageLink');

  stageTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active')) return;

      stageTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const { shot, title, meta, href } = tab.dataset;
      if (stageImg && shot) {
        stageImg.style.opacity = '0';
        setTimeout(() => {
          stageImg.src = shot;
          stageImg.alt = title || '';
          stageImg.style.opacity = '1';
        }, 120);
      }
      if (stageName && title) stageName.textContent = title;
      if (stageMeta && meta) stageMeta.textContent = meta;
      if (stageLink && href) stageLink.href = href;
    });
  });

  // 2. Catalog category filter & live search
  const chips = document.querySelectorAll('.chip');
  const searchInput = document.getElementById('searchInput');
  const cards = document.querySelectorAll('.card');
  const emptyState = document.getElementById('emptyState');

  let currentCategory = 'all';
  let searchQuery = '';

  function filterProjects() {
    let visibleCount = 0;

    cards.forEach((card) => {
      const cat = card.dataset.cat || '';
      const search = (card.dataset.search || '').toLowerCase();
      const title = (card.querySelector('.card-head h3')?.textContent || '').toLowerCase();
      const sub = (card.querySelector('.card-sub')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.card-desc')?.textContent || '').toLowerCase();

      const matchesCategory = currentCategory === 'all' || cat.split(' ').includes(currentCategory);
      const matchesSearch =
        !searchQuery ||
        title.includes(searchQuery) ||
        sub.includes(searchQuery) ||
        desc.includes(searchQuery) ||
        search.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      currentCategory = chip.dataset.filter || 'all';
      filterProjects();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterProjects();
    });
  }

  // 3. Screenshot modal preview (product detail pages)
  const shotModal = document.getElementById('shotModal');
  const shotImg = document.getElementById('shotImg');
  const closeShotModal = document.getElementById('closeShotModal');

  document.querySelectorAll('button[data-shot]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!shotModal || !shotImg) return;
      const shotUrl = button.dataset.shot;
      const shotAlt = button.dataset.shotAlt || button.querySelector('img')?.alt || 'Скріншот';
      if (!shotUrl) return;

      shotImg.src = shotUrl;
      shotImg.alt = shotAlt;
      shotModal.showModal();
    });
  });

  if (closeShotModal && shotModal) {
    closeShotModal.addEventListener('click', () => shotModal.close());
    shotModal.addEventListener('click', (e) => {
      if (e.target === shotModal) shotModal.close();
    });
  }

  // 4. Copy command buttons
  document.querySelectorAll('button[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'Скопійовано';
        setTimeout(() => {
          btn.textContent = orig;
        }, 1500);
      });
    });
  });
});
