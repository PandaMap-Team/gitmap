// ==UserScript==
// @name         GitMap — русификация GitHub
// @namespace    gitmap
// @author       Deflecat (original), m09l6d0ur13ii (maintainer)
// @version      0.1.0
// @license      MIT
// @icon         https://github.githubassets.com/favicons/favicon.png
// @description  Русская локализация интерфейса GitHub (на основе оригинального скрипта GitHub Russian Localization)
// @homepageURL  https://github.com/PandaMap-Team/gitmap
// @supportURL   https://github.com/PandaMap-Team/gitmap/issues
// @match        https://github.com/*
// @match        https://*.github.com/*
// @match        https://education.github.com/*
// @match        https://github.blog/*
// @run-at       document-end
// @grant        none
// @require      https://raw.githubusercontent.com/PandaMap-Team/gitmap/refs/heads/main/scr/core.js
// @require      https://raw.githubusercontent.com/PandaMap-Team/gitmap/refs/heads/main/scr/dashboard.js
// @require      https://raw.githubusercontent.com/PandaMap-Team/gitmap/refs/heads/main/scr/repo.js
// @require      https://raw.githubusercontent.com/PandaMap-Team/gitmap/refs/heads/main/scr/copilot.js
// @require      https://raw.githubusercontent.com/PandaMap-Team/gitmap/refs/heads/main/scr/time.js
// @require      https://raw.githubusercontent.com/PandaMap-Team/gitmap/refs/heads/main/scr/footer.js
// ==/UserScript==

(function () {
    'use strict';

    // глобальные константы, чтобы модули могли их использовать
    window.GITMAP_FTL_URL = 'https://raw.githubusercontent.com/PandaMap-Team/gitmap/main/locales/ru.ftl';
    window.GITMAP_LOG_PREFIX = '[GitMap]';

    const LOG_PREFIX = window.GITMAP_LOG_PREFIX;

    async function loadFTL(url) {
        console.info(`${LOG_PREFIX} Fetching FTL file from ${url}`);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const content = await response.text();
        console.info(`${LOG_PREFIX} FTL file downloaded successfully.`);
        return content;
    }

    async function init() {
        console.info(`${LOG_PREFIX} DOM ready, initializing localizer...`);

        try {
            const ftlContent = await loadFTL(window.GITMAP_FTL_URL);

            // класс GitHubLocalizer определён в src/core.js
            const localizer = new GitHubLocalizer(ftlContent);

            localizer.localize();
            localizer.observeChanges();

            window.GitMapLocalizer = localizer;
        } catch (error) {
            console.error(`${LOG_PREFIX} Failed to initialize localizer:`, error);
        }
    }

    console.info(`${LOG_PREFIX} Userscript loaded.`);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
