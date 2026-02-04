// modified version of Jellyfin Ratings v2 at https://github.com/Druidblack/jellyfin_ratings/blob/main/jellyfin_ratings_v2.js

if (typeof GM_xmlhttpRequest === 'undefined') {
  // Массив прокси — старый и новый
  const PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://api.codetabs.com/v1/proxy?quest='
  ];
  const DIRECT_DOMAINS = [
    'api.mdblist.com',
  ];

  window.GM_xmlhttpRequest = function({ method = 'GET', url, headers = {}, data, onload, onerror }) {
    // решаем, нужно ли проксировать
    const isDirect = DIRECT_DOMAINS.some(d => url.includes(d));
    let fetchUrl;
    if (isDirect) {
      fetchUrl = url;
    } else {
      // выбираем случайный прокси
      const proxy = PROXIES[Math.floor(Math.random() * PROXIES.length)];
      // добавляем cache-bust
      const sep = url.includes('?') ? '&' : '?';
      const bump = `_=${Date.now()}`;
      fetchUrl = proxy + encodeURIComponent(url + sep + bump);
    }

    fetch(fetchUrl, {
      method,
      headers,
      body: data,
      cache: 'no-store'         // запрещаем браузерному кэшу
    })
    .then(response =>
      response.text().then(text =>
        onload({ status: response.status, responseText: text })
      )
    )
    .catch(err => {
      if (typeof onerror === 'function') onerror(err);
    });
  };
}

;(function() {
  'use strict';

  // === API Keys ===
  const MDBLIST_API_KEY    = 'api_key';
//  const KINOPOISK_API_KEY  = 'api_key';
//  const TMDB_API_KEY       = 'api_key';

  // === Logos ===
  const LOGO = {
    imdb:               'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/IMDb.png',
//    tmdb:               'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/TMDB.png',
//    tomatoes:           'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/Rotten_Tomatoes.png',
//    tomatoes_rotten:    'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/Rotten_Tomatoes_rotten.png',
//    tomatoes_certified: 'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/rotten-tomatoes-certified.png',
//    audience:           'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/Rotten_Tomatoes_positive_audience.png',
//    audience_rotten:    'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/Rotten_Tomatoes_negative_audience.png',
//    rotten_ver:         'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/roten_tomatoes_ver.png',
//    metacritic:         'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/Metacritic.png',
//    metacriticms:       'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/metacriticms.png',
//    metacriticus:       'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/mus2.png',
//    rogerebert:         'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/Roger_Ebert.png',
    trakt:              'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/Trakt.png',
 //   letterboxd:         'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/letterboxd.png',
 //   kinopoisk:          'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/kinopoisk.png',
 //   myanimelist:        'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/mal.png',
 //   anilist:            'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/anilist.png',
 //   allocine_crit:      'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/allocine_crit.png',
 //   allocine_user:      'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/allocine_user.png',
 //   douban:             'https://cdn.jsdelivr.net/gh/Druidblack/jellyfin_ratings@main/logo/douban.png'
  };

  let currentImdbId = null;
  scanLinks();
  setInterval(scanLinks, 1000);

// === Управление видимостью встроенных рейтингов (звёзды/критика) ===
function getStarBox(node) {
  return node?.closest('.itemMiscInfo.itemMiscInfo-primary') || node?.parentElement || null;
}

function setBuiltInStarsHidden(box, hide) {
  if (!box) return;
  const stars  = box.querySelector('.starRatingContainer.mediaInfoItem');
  const critic = box.querySelector('.mediaInfoItem.mediaInfoCriticRating');

  [stars, critic].forEach(el => {
    if (!el) return;
    if (hide) {
      if (!('origStyle' in el.dataset)) {
        el.dataset.origStyle = el.getAttribute('style') || '';
      }
      el.style.color = 'transparent';
      el.style.fontSize = '0';
    } else {
      if ('origStyle' in el.dataset) {
        el.setAttribute('style', el.dataset.origStyle);
        delete el.dataset.origStyle;
      } else {
        el.style.color = '';
        el.style.fontSize = '';
      }
    }
  });
}

// скрываем встроенные рейтинги только если контейнер непустой
function updateStarsVisibilityFor(container) {
  if (!container) return;
  const hasContent =
    container.childElementCount > 0 ||
    (container.textContent && container.textContent.trim().length > 0);
  setBuiltInStarsHidden(getStarBox(container), hasContent);
}

// следим за наполнением контейнера
function watchRatingContainer(container) {
  // мгновенная проверка
  setTimeout(() => updateStarsVisibilityFor(container), 0);

  // реакции на асинхронные изменения
  const obs = new MutationObserver(() => updateStarsVisibilityFor(container));
  obs.observe(container, { childList: true, subtree: true, characterData: true });
  container.__ratingsObserver = obs;
}


function scanLinks() {
  // получаем текущий IMDb ID и при смене — чистим наши контейнеры аккуратно
  document.querySelectorAll('a.emby-button[href*="imdb.com/title/"]').forEach(a => {
    if (a.dataset.imdbProcessed) return;
    a.dataset.imdbProcessed = 'true';
    const m = a.href.match(/imdb\.com\/title\/(tt\d+)/);
    const newImdbId = m ? m[1] : null;

    // если страница обновилась — перед удалением наших контейнеров вернём звёзды и остановим наблюдателей
    if (newImdbId !== currentImdbId) {
      document.querySelectorAll('.mdblist-rating-container').forEach(el => {
        try { el.__ratingsObserver?.disconnect(); } catch {}
        setBuiltInStarsHidden(getStarBox(el), false);
        el.remove();
      });
      currentImdbId = newImdbId;
    }
  });

  // ⚠️ ВАЖНО: больше НЕ скрываем встроенные рейтинги здесь безусловно.
  // Раньше было:
  // document.querySelectorAll('div.starRatingContainer.mediaInfoItem, div.mediaInfoItem.mediaInfoCriticRating').forEach(...)

// обрабатываем TMDB-ссылки (generic -> season -> episode)
	const tmdbLinks = Array.from(document.querySelectorAll('a.emby-button[href*="themoviedb.org/"]'))
	  .filter(a => !a.dataset.mdblistProcessed)
	  .sort((a,b) => {
		const s = h => /\/episode\//.test(h) ? 2 : (/\/season\//.test(h) ? 1 : 0);
		return s(a.href) - s(b.href);
	  });

	tmdbLinks.forEach(a => {
	  a.dataset.mdblistProcessed = 'true';
	  processLink(a);
	});
}


function processLink(link) {
  // Сначала пытаемся распознать ссылку серии:
  // https://www.themoviedb.org/tv/{tvId}/season/{s}/episode/{e}
  const ep = link.href.match(/themoviedb\.org\/tv\/(\d+)\/season\/(\d+)\/episode\/(\d+)/);
  
    // Затем — ссылку сезона (при этом исключаем эпизод)
  const sn = !ep && link.href.match(/themoviedb\.org\/tv\/(\d+)\/season\/(\d+)(?!\/episode)/);

  // Базовый разбор для movie/tv
  const m = link.href.match(/themoviedb\.org\/(movie|tv)\/(\d+)/);
  if (!m) return;
  const type   = m[1] === 'tv' ? 'show' : 'movie';
  const tmdbId = m[2];


  // Контекст TMDb: либо эпизод, либо сезон, либо null
  const episodeInfo = ep ? {
    isEpisode: true,
    tvId: ep[1],
    season: parseInt(ep[2], 10),
    episode: parseInt(ep[3], 10)
  } : (sn ? {
    isSeason: true,
    tvId: sn[1],
    season: parseInt(sn[2], 10)
  } : null);

  const presentRe = '(?:present|now|current|Н\\/В|Н\\.В\\.|н\\/в|н\\.в\\.|по\\s*наст\\.?\\s*времен[ию]?)';
  const dash = '[–—-]'; // варианты тире/дефиса
  const isYearish  = t => /^\d{4}$/.test(t) || new RegExp(`^\\d{4}\\s*${dash}\\s*(?:\\d{4}|${presentRe})$`, 'i').test(t);
  const isRuntime  = t => /^\d+\\s*(?:m|min|мин)\\b/i.test(t);

  // 1) Обрабатываем КАЖДЫЙ блок meta-инфы ровно один раз, выбирая единственный якорь по приоритету
  document.querySelectorAll('.itemMiscInfo.itemMiscInfo-primary').forEach(box => {
    const items = Array.from(box.querySelectorAll('.mediaInfoItem'));
    const officialEl = box.querySelector('.mediaInfoItem.mediaInfoText.mediaInfoOfficialRating');
    const yearEl     = items.find(el => isYearish((el.textContent || '').trim()));
    const runtimeEl  = items.find(el => isRuntime((el.textContent || '').trim()));
    const lastItem   = box.querySelector('.mediaInfoItem:last-of-type');

    const anchor = officialEl || yearEl || runtimeEl || lastItem;
    if (anchor) insert(anchor, type, tmdbId, episodeInfo);
  });

  // 2) На случай, если официальный рейтинг есть вне .itemMiscInfo-primary (редко) — вставляем один раз и там
  document.querySelectorAll('.mediaInfoItem.mediaInfoText.mediaInfoOfficialRating').forEach(el => {
    if (!el.closest('.itemMiscInfo.itemMiscInfo-primary')) {
      insert(el, type, tmdbId, episodeInfo);
    }
  });
}

function insert(target, type, tmdbId, episodeInfo) {
  // удаляем предыдущий контейнер сразу после якоря
  while (target.nextElementSibling?.classList.contains('mdblist-rating-container')) {
    const old = target.nextElementSibling;
    try { old.__ratingsObserver?.disconnect(); } catch {}
    setBuiltInStarsHidden(getStarBox(old), false); // вернём звёзды на случай, если старый был пуст
    old.remove();
  }

  const container = document.createElement('div');
  container.className = 'mdblist-rating-container';
  container.style.cssText = 'display:inline-flex; align-items:center; margin-left:6px;';
  target.insertAdjacentElement('afterend', container);

  // <<< ВАЖНО: следим за наполнением контейнера и скрываем звёзды только когда есть данные >>>
  watchRatingContainer(container);
  
   // >>> Если это страница ЭПИЗОДА — грузим ТОЛЬКО рейтинг серии TMDb и выходим
//  if (episodeInfo?.isEpisode) {
//    fetchTmdbEpisodeRating(episodeInfo.tvId, episodeInfo.season, episodeInfo.episode, container);
//    return;
//  }
  
  // >>> Если это страница СЕЗОНА — грузим ТОЛЬКО рейтинг сезона TMDb и выходим
//   if (episodeInfo?.isSeason) {
//	fetchTmdbSeasonRating(episodeInfo.tvId, episodeInfo.season, container);
//	return;
  }

  // дальше — ваш существующий код загрузки рейтингов
  fetchMDBList(type, tmdbId, container);
}

  // === MDBList ===
  function fetchMDBList(type, tmdbId, container) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://api.mdblist.com/tmdb/${type}/${tmdbId}?apikey=${MDBLIST_API_KEY}`,
      onload(res) {
        if (res.status !== 200) return console.warn('MDBList status:', res.status);
        let data;
        try { data = JSON.parse(res.responseText); }
        catch (e) { return console.error('MDBList JSON parse error:', e); }

        container.dataset.originalTitle = data.original_title || data.title || '';
        container.dataset.year          = data.year || '';

        if (Array.isArray(data.ratings)) {
          data.ratings.forEach(r => {
		    if (r.value == null) return;
		
		    let key = r.source.toLowerCase().replace(/\s+/g, '_');
		
		    if (key.includes('trakt')) key = 'trakt';
		    else if (key.includes('imdb'))  key = 'imdb';
		
		    // ONLY imdb + trakt
		    const ALLOWED = new Set(['imdb', 'trakt']);
		    if (!ALLOWED.has(key)) return;
		
		    const logoUrl = LOGO[key];
		    if (!logoUrl) return;
		
		    const img = document.createElement('img');
		    img.src = logoUrl;
		    img.alt = r.source;
		    img.title = `${r.source}: ${r.value}`;
		    img.dataset.source = key;
		    img.style.cssText = 'height:1.5em; margin-right:4px; vertical-align:middle;';
		    container.appendChild(img);
		
		    const span = document.createElement('span');
		    span.textContent = r.value;
		    span.style.cssText = 'margin-right:8px; font-size:1em; vertical-align:middle;';
		    container.appendChild(span);
          });
        }
      }
    });
  }
}
})();
