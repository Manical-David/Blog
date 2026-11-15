// Mobile nav toggle
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });

  // Close menu when a nav link is clicked
  nav.addEventListener('click', function (e) {
    if (e.target.classList.contains('nav-link')) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    }
  });
})();

(function () {
  // TOC scroll tracking
  var tocLinks = document.querySelectorAll('.toc a');
  if (!tocLinks.length) return;

  var headings = document.querySelectorAll(
    '.post-content h1[id], .post-content h2[id], .post-content h3[id], .post-content h4[id]'
  );
  if (!headings.length) return;

  function setActive(id) {
    tocLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + id) {
        link.classList.add('active');
      }
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.getAttribute('id'));
        }
      });
    },
    {
      rootMargin: '-80px 0px -75% 0px',
    }
  );

  headings.forEach(function (heading) {
    observer.observe(heading);
  });
})();

// Theme toggle
(function () {
  var STORAGE_KEY = 'warmpaper-theme';
  var btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  var mql = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return mql.matches ? 'dark' : 'light';
  }

  function syncIcon() {
    btn.setAttribute('data-theme-state', currentTheme());
  }

  btn.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    btn.setAttribute('data-theme-state', next);
  });

  mql.addEventListener('change', function () {
    var hasManual = false;
    try { hasManual = !!localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (!hasManual) syncIcon();
  });

  syncIcon();
})();

(function () {
  var STORAGE_KEY = 'warmpaper-lang';
  var btns = Array.prototype.slice.call(document.querySelectorAll('.lang-switch'));
  var translations = {
    'en': {
      'nav.home': 'Home',
      'nav.archives': 'Archives',
      'nav.tags': 'Tags',
      'nav.categories': 'Categories',
      'nav.about': 'About',
      'archive.title': 'Archives',
      'categories.title': 'Categories',
      'tags.title': 'Tags',
      'post.read_more': 'Read More',
      'pagination.prev': '« Prev',
      'pagination.next': 'Next »',
      'no_categories': 'No categories yet.',
      'no_tags': 'No tags yet.',
      'theme_toggle': 'Toggle theme'
    },
    'zh-CN': {
      'nav.home': '首页',
      'nav.archives': '时间轴',
      'nav.tags': '标签',
      'nav.categories': '分类',
      'nav.about': '关于',
      'archive.title': '时间轴',
      'categories.title': '分类',
      'tags.title': '标签',
      'post.read_more': '阅读全文',
      'pagination.prev': '« 上一页',
      'pagination.next': '下一页 »',
      'no_categories': '暂无分类。',
      'no_tags': '暂无标签。',
      'theme_toggle': '切换主题'
    }
  };

  function currentLang() {
    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}
    if (stored === 'en' || stored === 'zh-CN') return stored;

    var htmlLang = document.documentElement.lang || 'zh-CN';
    return htmlLang.indexOf('en') === 0 ? 'en' : 'zh-CN';
  }

  function translatePage(lang) {
    var map = translations[lang] || translations['zh-CN'];
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (item) {
      var key = item.dataset.i18n;
      var value = map[key];
      if (!value) return;
      if (key === 'post.read_more' || key.indexOf('pagination.') === 0) {
        item.innerHTML = value + (key === 'post.read_more' ? ' &rarr;' : '');
      } else {
        item.textContent = value;
      }
    });

    var themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', map['theme_toggle'] || 'Toggle theme');
      themeToggle.setAttribute('title', map['theme_toggle'] || 'Toggle theme');
    }
  }

  function updateButtons(lang) {
    btns.forEach(function (button) {
      var active = button.dataset.lang === lang;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  if (!btns.length) return;

  btns.forEach(function (button) {
    button.addEventListener('click', function () {
      var lang = button.dataset.lang;
      if (lang !== 'en' && lang !== 'zh-CN') return;
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
      translatePage(lang);
      updateButtons(lang);
    });
  });

  var lang = currentLang();
  translatePage(lang);
  updateButtons(lang);
})();
