document.addEventListener('DOMContentLoaded', () => {
  const chips = document.querySelectorAll('.chip');
  const searchInput = document.getElementById('searchInput');
  const cards = document.querySelectorAll('.card');
  const emptyState = document.getElementById('emptyState');

  // Modal elements
  const shotModal = document.getElementById('shotModal');
  const shotImg = document.getElementById('shotImg');
  const closeShotModal = document.getElementById('closeShotModal');

  let currentCategory = 'all';
  let searchQuery = '';

  // Filter projects logic
  function filterProjects() {
    let visibleCount = 0;

    cards.forEach(card => {
      const cat = card.dataset.cat || '';
      const search = (card.dataset.search || '').toLowerCase();
      const title = (card.querySelector('.card-head h3')?.textContent || '').toLowerCase();
      const sub = (card.querySelector('.card-sub')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.card-desc')?.textContent || '').toLowerCase();

      const matchesCategory = currentCategory === 'all' || cat.split(' ').includes(currentCategory);
      const matchesSearch = !searchQuery || 
        title.includes(searchQuery) || 
        sub.includes(searchQuery) || 
        desc.includes(searchQuery) || 
        search.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Handle category chip clicks
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCategory = chip.dataset.filter;
      filterProjects();
    });
  });

  // Handle live search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterProjects();
    });
  }

  // Handle image load states (for smooth skeleton shimmer)
  document.querySelectorAll('.card-shot img, .gallery img, .prod-shot-btn img').forEach(img => {
    const parent = img.parentElement;
    if (img.complete) {
      parent.classList.add('loaded');
    } else {
      img.addEventListener('load', () => parent.classList.add('loaded'));
      img.addEventListener('error', () => parent.classList.add('loaded'));
    }
  });

  // Handle Screenshot Modal Preview (на сторінках проєктів та галереях)
  document.querySelectorAll('button[data-shot], [data-shot]:not(a)').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!shotModal || !shotImg) return;
      const shotUrl = button.dataset.shot;
      const shotAlt = button.dataset.shotAlt || button.querySelector('img')?.alt || 'Скріншот';
      if (!shotUrl) return;

      shotImg.src = shotUrl;
      shotImg.alt = shotAlt;
      shotModal.showModal();
    });
  });

  // Copy to clipboard support
  document.querySelectorAll('button[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'скопійовано!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = orig;
          btn.classList.remove('copied');
        }, 1500);
      });
    });
  });

  if (closeShotModal && shotModal) {
    closeShotModal.addEventListener('click', () => {
      shotModal.close();
    });

    shotModal.addEventListener('click', (e) => {
      if (e.target === shotModal) {
        shotModal.close();
      }
    });
  }
});
