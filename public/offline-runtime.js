(() => {
  const CONFIG_URL = '/offline-content.json';
  const MEDIA_LAYER_ID = 'offline-career-media';
  let config = { careers: {} };
  let scheduled = false;
  let currentCareerId = '';

  const withCacheBust = (url) => {
    if (!url) return '';
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}offline_v=${encodeURIComponent(config.version || '1')}`;
  };

  const loadConfig = async () => {
    try {
      const response = await fetch(`${CONFIG_URL}?t=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const parsed = await response.json();
      config = parsed && typeof parsed === 'object' ? parsed : { careers: {} };
    } catch (error) {
      console.warn('[offline-runtime] Using built-in assets because config could not be loaded.', error);
      config = { careers: {} };
    }
  };

  const getCareerConfig = (careerId) => config?.careers?.[careerId] || null;

  const applyCharacterOverrides = () => {
    document.querySelectorAll('.character-portrait[data-career]').forEach((portrait) => {
      const careerId = portrait.getAttribute('data-career');
      const item = getCareerConfig(careerId);
      const sprite = portrait.querySelector('.character-sprite');
      if (!sprite || !item?.character) return;
      sprite.style.backgroundImage = `url("${withCacheBust(item.character)}")`;
    });
  };

  const ensureMediaLayer = () => {
    const app = document.querySelector('.projection-app');
    if (!app) return null;

    let layer = document.getElementById(MEDIA_LAYER_ID);
    if (!layer) {
      layer = document.createElement('div');
      layer.id = MEDIA_LAYER_ID;
      layer.setAttribute('aria-hidden', 'true');
      Object.assign(layer.style, {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        zIndex: '-2',
        pointerEvents: 'none',
        overflow: 'hidden',
      });
      const backdrop = app.querySelector('.space-backdrop');
      if (backdrop?.nextSibling) app.insertBefore(layer, backdrop.nextSibling);
      else app.prepend(layer);
    }
    return layer;
  };

  const clearMediaLayer = (layer) => {
    while (layer.firstChild) layer.removeChild(layer.firstChild);
  };

  const createImageLayer = (url, opacity = 0.22) => {
    const div = document.createElement('div');
    Object.assign(div.style, {
      position: 'absolute',
      inset: '0',
      backgroundImage: `url("${withCacheBust(url)}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      opacity: String(opacity),
      filter: 'saturate(.92) contrast(1.08) brightness(.72)',
      mixBlendMode: 'screen',
    });
    return div;
  };

  const createVideoLayer = (url, opacity = 0.22) => {
    const video = document.createElement('video');
    video.src = withCacheBust(url);
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    Object.assign(video.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: String(opacity),
      filter: 'saturate(.92) contrast(1.08) brightness(.72)',
      mixBlendMode: 'screen',
    });
    video.addEventListener('error', () => {
      console.warn(`[offline-runtime] Background video failed: ${url}`);
      video.remove();
    });
    video.play().catch(() => {});
    return video;
  };

  const syncCareerMedia = () => {
    const hero = document.querySelector('.character-portrait.hero[data-career]');
    const careerId = hero?.getAttribute('data-career') || '';
    const layer = ensureMediaLayer();
    if (!layer) return;

    if (!careerId) {
      if (currentCareerId) {
        clearMediaLayer(layer);
        currentCareerId = '';
      }
      return;
    }

    const item = getCareerConfig(careerId);
    const mediaKey = JSON.stringify({
      careerId,
      backgroundImage: item?.backgroundImage || '',
      backgroundVideo: item?.backgroundVideo || '',
      videoEnabled: Boolean(item?.videoEnabled),
      opacity: item?.backgroundOpacity ?? 0.22,
    });

    if (layer.dataset.mediaKey === mediaKey) return;
    layer.dataset.mediaKey = mediaKey;
    currentCareerId = careerId;
    clearMediaLayer(layer);

    const opacity = Number(item?.backgroundOpacity ?? 0.22);
    if (item?.videoEnabled && item?.backgroundVideo) {
      layer.appendChild(createVideoLayer(item.backgroundVideo, opacity));
    } else if (item?.backgroundImage) {
      layer.appendChild(createImageLayer(item.backgroundImage, opacity));
    }
  };

  const preloadConfiguredMedia = () => {
    Object.values(config?.careers || {}).forEach((item) => {
      if (item?.character) {
        const image = new Image();
        image.src = withCacheBust(item.character);
      }
      if (item?.backgroundImage) {
        const image = new Image();
        image.src = withCacheBust(item.backgroundImage);
      }
      if (item?.videoEnabled && item?.backgroundVideo) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = withCacheBust(item.backgroundVideo);
      }
    });
  };

  const sync = () => {
    scheduled = false;
    applyCharacterOverrides();
    syncCareerMedia();
  };

  const scheduleSync = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(sync);
  };

  const init = async () => {
    await loadConfig();
    preloadConfiguredMedia();
    sync();

    const observer = new MutationObserver(scheduleSync);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-career'],
    });

    window.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'm') {
        event.preventDefault();
        window.location.href = '/maintenance.html';
      }
    });

    window.__SPACE_CAREER_OFFLINE__ = {
      reloadConfig: async () => {
        await loadConfig();
        preloadConfiguredMedia();
        document.getElementById(MEDIA_LAYER_ID)?.removeAttribute('data-media-key');
        sync();
      },
      getConfig: () => config,
    };
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
