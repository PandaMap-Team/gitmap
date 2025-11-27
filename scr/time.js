// src/time.js
(function () {
    'use strict';

    const LOG_PREFIX = window.GITMAP_LOG_PREFIX || '[GitMap]';

    if (!window.GitHubLocalizer) return;

    GitHubLocalizer.prototype.localizeRelativeTime = function () {
        const relativeTimes = document.querySelectorAll('relative-time');
        if (!relativeTimes.length) return;

        relativeTimes.forEach(timeElement => {
            const needsLangUpdate = timeElement.getAttribute('lang') !== 'ru';
            const prefixAttr = timeElement.getAttribute('prefix');
            const prefixPropValue = typeof timeElement.prefix === 'string' ? timeElement.prefix : null;
            const hasEnglishPrefixAttr = typeof prefixAttr === 'string' && prefixAttr.trim().toLowerCase() === 'on';
            const hasEnglishPrefixProp = typeof prefixPropValue === 'string' && prefixPropValue.trim().toLowerCase() === 'on';
            const wasTranslated = timeElement.getAttribute('data-ru-translated') === 'true';

            if (timeElement.hasAttribute('title')) {
                const originalTitle = timeElement.getAttribute('title');
                const translatedTitle = this.translateAbsoluteTime(originalTitle);
                if (translatedTitle !== originalTitle) {
                    timeElement.setAttribute('title', translatedTitle);
                }
            }

            if (!needsLangUpdate && !hasEnglishPrefixAttr && !hasEnglishPrefixProp && wasTranslated) {
                this.cleanRelativeTimeShadow(timeElement);
                return;
            }

            if (needsLangUpdate) {
                try {
                    timeElement.setAttribute('lang', 'ru');
                    if (typeof timeElement.update === 'function') {
                        timeElement.update();
                    }
                } catch (error) {
                    console.warn(`${LOG_PREFIX} Unable to apply lang="ru" to relative-time:`, error);
                }
            }

            if (hasEnglishPrefixAttr || hasEnglishPrefixProp) {
                timeElement.removeAttribute('prefix');
                if (typeof timeElement.prefix === 'string') {
                    try {
                        timeElement.prefix = '';
                    } catch (error) {
                        console.warn(`${LOG_PREFIX} Unable to clear prefix property on relative-time:`, error);
                    }
                }
                if (typeof timeElement.update === 'function') {
                    timeElement.update();
                }
            }

            this.cleanRelativeTimeShadow(timeElement);
            timeElement.setAttribute('data-ru-translated', 'true');
        });

        // дальше сюда можно дословно перенести хвост из твоего метода,
        // который занимается Description-module__container--Ks2Eo и т.п.
    };

    GitHubLocalizer.prototype.localizeUpdatedText = function () {
        // сюда просто копируешь тело твоего метода localizeUpdatedText
        // из монолитного класса, без изменений, кроме шапки
        // (по сути всё, что у тебя уже написано ниже комментария /** локализует текстовые узлы с Updated */)
    };

})();
