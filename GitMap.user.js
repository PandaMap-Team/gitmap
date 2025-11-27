// ==UserScript==
// @name         GitMap — русификация GitHub
// @namespace    gitmap
// @version      0.1.0
// @description  Локализация GitHub на русский язык
// @match        https://github.com/*
// @match        https://*.github.com/*
// @run-at       document-end
// @grant        none
// @require      https://raw.githubusercontent.com/PandaMap-Team/gitmap/main/src/core.js
// @require      https://raw.githubusercontent.com/PandaMap-Team/gitmap/main/src/dashboard.js
// @require      https://raw.githubusercontent.com/PandaMap-Team/gitmap/main/src/repo.js
// @require      https://raw.githubusercontent.com/PandaMap-Team/gitmap/main/src/copilot.js
// @require      https://raw.githubusercontent.com/PandaMap-Team/gitmap/main/src/time.js
// @require      https://raw.githubusercontent.com/PandaMap-Team/gitmap/main/src/footer.js
// ==/UserScript==

(function () {
    'use strict';

    // эти константы нужны и в модулях → вынесем в глобал
    window.GITMAP_FTL_URL = 'https://raw.githubusercontent.com/PandaMap-Team/gitmap/main/locales/ru.ftl';
    window.GITMAP_LOG_PREFIX = '[GitMap]';

    async function loadFTL(url) {
        console.info(`${window.GITMAP_LOG_PREFIX} Fetching FTL file from ${url}`);
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP error ${resp.status}`);
        const text = await resp.text();
        console.info(`${window.GITMAP_LOG_PREFIX} FTL file downloaded successfully.`);
        return text;
    }

    async function init() {
        console.info(`${window.GITMAP_LOG_PREFIX} DOM ready, initializing localizer...`);
        try {
            const ftlContent = await loadFTL(window.GITMAP_FTL_URL);

            // класс GitHubLocalizer определён в src/core.js
            const localizer = new GitHubLocalizer(ftlContent);

            localizer.localize();
            localizer.observeChanges();

            window.GitMapLocalizer = localizer;
        } catch (e) {
            console.error(`${window.GITMAP_LOG_PREFIX} Failed to initialize localizer:`, e);
        }
    }

    console.info(`${window.GITMAP_LOG_PREFIX} Userscript loaded.`);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
