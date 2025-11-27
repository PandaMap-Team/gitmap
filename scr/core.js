// src/core.js
(function () {
    'use strict';

    const LOG_PREFIX = window.GITMAP_LOG_PREFIX || '[GitMap]';

    /**
     * Простейший парсер FTL: "ключ = значение"
     */
    class SimpleFTLParser {
        constructor(ftlContent) {
            this.messages = new Map();
            this.parse(ftlContent);
        }

        parse(content) {
            const lines = content.split('\n');

            for (let line of lines) {
                line = line.trim();

                // пропуск комментариев и пустых строк
                if (!line || line.startsWith('#') || line.startsWith('##')) continue;

                const match = line.match(/^([a-zA-Z0-9-_]+)\s*=\s*(.+)$/);
                if (match) {
                    const [, key, value] = match;
                    this.messages.set(key, value);
                }
            }
        }

        getMessage(key) {
            return this.messages.get(key) || null;
        }

        hasMessage(key) {
            return this.messages.has(key);
        }
    }

    /**
     * Базовый класс локализатора
     */
    class GitHubLocalizer {
        constructor(ftlContent) {
            this.parser = new SimpleFTLParser(ftlContent);
            this.observer = null;
            this.protectedElements = new Map(); // элементы под защитой
            console.info(`${LOG_PREFIX} Localizer initialized with ${this.parser.messages.size} messages.`);
        }

        getTranslation(key, fallback = null) {
            const message = this.parser.getMessage(key);
            return message != null ? message : fallback;
        }

        /**
         * Локализация элемента по тексту
         */
        localizeByText(element, originalText, messageKey) {
            if (!element || !element.textContent) return false;

            const currentText = element.textContent.trim();
            const translation = this.getTranslation(messageKey);
            if (!translation) return false;

            // уже переведено
            if (currentText === translation) {
                this.protectElement(element, translation);
                return false;
            }

            // текст отличается от ожидаемого оригинала
            if (currentText !== originalText) return false;

            element.textContent = translation;
            element.setAttribute('data-ru-localized', 'true');
            this.protectElement(element, translation);
            return true;
        }

        /**
         * Защита элемента от отката перевода
         */
        protectElement(element, translatedText) {
            if (this.protectedElements.has(element)) return;

            const protectionObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'characterData' || mutation.type === 'childList') {
                        const currentText = element.textContent.trim();
                        if (currentText !== translatedText) {
                            element.textContent = translatedText;
                        }
                    }
                }
            });

            protectionObserver.observe(element, {
                characterData: true,
                childList: true,
                subtree: true
            });

            this.protectedElements.set(element, {
                observer: protectionObserver,
                translation: translatedText
            });
        }

        // ----- общие утилиты, которые используют разные модули -----

        normalizeSearchPlaceholderText(translation) {
            if (typeof translation !== 'string') return null;

            if (!translation.includes('{{kbd}}')) {
                return translation.replace(/\s+/g, ' ').trim();
            }

            const normalized = translation.replace('{{kbd}}', '/');
            return normalized.replace(/\s+/g, ' ').trim();
        }

        renderSearchPlaceholder(target, translation) {
            if (!target || typeof translation !== 'string') return;

            if (!translation.includes('{{kbd}}')) {
                target.textContent = translation;
                return;
            }

            const [beforeKbd, afterKbd] = translation.split('{{kbd}}');
            const existingKbd = target.querySelector('kbd');
            const kbdElement = existingKbd ?? (() => {
                const newKbd = document.createElement('kbd');
                newKbd.className = 'AppHeader-search-kbd';
                newKbd.textContent = '/';
                return newKbd;
            })();

            const fragment = document.createDocumentFragment();
            fragment.appendChild(document.createTextNode(beforeKbd ?? ''));
            fragment.appendChild(kbdElement);
            fragment.appendChild(document.createTextNode(typeof afterKbd === 'string' ? afterKbd : ''));

            target.replaceChildren(fragment);
        }

        resolveKbdElement(identifier, kbdMap) {
            if (!(kbdMap instanceof Map) || kbdMap.size === 0) return null;

            const normalized = (identifier ?? '').trim();
            if (!normalized) {
                const firstEntry = kbdMap.entries().next();
                if (!firstEntry.done) {
                    const [firstKey, element] = firstEntry.value;
                    kbdMap.delete(firstKey);
                    return element;
                }
                return null;
            }

            if (kbdMap.has(normalized)) {
                const element = kbdMap.get(normalized);
                kbdMap.delete(normalized);
                return element;
            }

            const lower = normalized.toLowerCase();
            for (const [key, element] of kbdMap.entries()) {
                if (key.trim().toLowerCase() === lower) {
                    kbdMap.delete(key);
                    return element;
                }
            }

            const fallback = kbdMap.entries().next();
            if (!fallback.done) {
                const [fallbackKey, element] = fallback.value;
                kbdMap.delete(fallbackKey);
                return element;
            }

            return null;
        }

        createFragmentFromKbdTranslation(translation, kbdElements) {
            if (typeof translation !== 'string') return null;

            const fragment = document.createDocumentFragment();
            const map = kbdElements instanceof Map
                ? new Map(kbdElements)
                : new Map(Array.isArray(kbdElements) ? kbdElements : []);
            const regex = /\[kbd\](.*?)\[\/kbd\]/g;
            let lastIndex = 0;
            let match;
            let hasPlaceholders = false;

            while ((match = regex.exec(translation)) !== null) {
                hasPlaceholders = true;
                const textPart = translation.slice(lastIndex, match.index);
                if (textPart) fragment.appendChild(document.createTextNode(textPart));

                const placeholderContent = match[1] ?? '';
                const kbdElement = this.resolveKbdElement(placeholderContent, map);
                if (kbdElement) {
                    const displayText = placeholderContent.trim();
                    if (displayText) kbdElement.textContent = displayText;
                    fragment.appendChild(kbdElement);
                } else if (placeholderContent) {
                    fragment.appendChild(document.createTextNode(placeholderContent));
                }

                lastIndex = regex.lastIndex;
            }

            if (!hasPlaceholders) {
                fragment.appendChild(document.createTextNode(translation));
                return fragment;
            }

            const remainder = translation.slice(lastIndex);
            if (remainder) fragment.appendChild(document.createTextNode(remainder));

            return fragment;
        }

        replaceContentWithKbdTranslation(target, translationKey, kbdElements) {
            if (!target) return false;

            const translation = this.getTranslation(translationKey);
            if (!translation) return false;

            const fragment = this.createFragmentFromKbdTranslation(translation, kbdElements);
            if (!fragment) return false;

            target.replaceChildren(fragment);
            target.setAttribute('data-ru-localized', 'true');
            return true;
        }

        // ===== Время: базовые утилиты (detail-логика вынесем в time.js) =====

        translateAbsoluteTime(text) {
            if (typeof text !== 'string' || !text.trim()) return text;

            // формат: «Nov 5, 2025, 11:25 PM GMT+3»
            const regex = /^([A-Z][a-z]{2,8})\s+(\d{1,2}),\s+(\d{4}),\s+(\d{1,2}):(\d{2})\s+(AM|PM)\s+GMT([+-]\d+)$/;
            const match = text.match(regex);

            if (match) {
                const [, month, day, year, hours, minutes, ampm, gmt] = match;
                const monthKey = month.length <= 3 ? `month-short-${month.toLowerCase()}` : `month-long-${month.toLowerCase()}`;
                const translatedMonth = this.getTranslation(monthKey, month);

                if (translatedMonth) {
                    let hour = parseInt(hours, 10);
                    if (ampm === 'PM' && hour !== 12) hour += 12;
                    if (ampm === 'AM' && hour === 12) hour = 0;

                    const timezone = gmt === '+3'
                        ? this.getTranslation('timezone-msk', 'GMT+3')
                        : `GMT${gmt}`;
                    const normalizedHour = String(hour).padStart(2, '0');
                    return `${day} ${translatedMonth} ${year}, ${normalizedHour}:${minutes} ${timezone}`;
                }
            }

            return text;
        }

        cleanRelativeTimeShadow(timeElement) {
            if (!timeElement || typeof timeElement !== 'object') return;

            const shadowRoot = timeElement.shadowRoot;
            if (!shadowRoot) return;

            const ownerDocument = timeElement.ownerDocument;
            const nodeFilter = typeof NodeFilter !== 'undefined'
                ? NodeFilter
                : ownerDocument?.defaultView?.NodeFilter;

            if (!ownerDocument || typeof ownerDocument.createTreeWalker !== 'function' || !nodeFilter) return;

            const walker = ownerDocument.createTreeWalker(shadowRoot, nodeFilter.SHOW_TEXT, null);
            let node;

            while ((node = walker.nextNode())) {
                if (!node.textContent) continue;

                const original = node.textContent;
                let updated = original.replace(/(^|\s)on\s+/gi, '$1');
                updated = updated.replace(/(?:\s|\u00a0)+г\.$/gi, '');
                updated = updated.replace(/\s{2,}/g, ' ');
                updated = updated.trimStart().trimEnd();

                if (updated !== original) node.textContent = updated;
            }
        }

        /**
         * Вызвать все локализаторы (которые навесили модули)
         */
        localize() {
            this.localizeDashboard?.();
            this.localizeSearchPlaceholder?.();
            this.localizeTooltips?.();
            this.localizeRepoTabs?.();
            this.localizeAllTooltips?.();
            this.localizeActionListItems?.();
            this.localizeGreeting?.();
            this.localizeGitHubEducation?.();
            this.localizeCopilotChatAndLeftBarPart?.();
            this.localizeLabelsStatusesAndLinks?.();
            this.localizeCommandPills?.();
            this.localizeDashboardElements?.();
            this.localizeDashboardTooltips?.();
            this.localizeSearchElements?.();
            this.localizeCopilotSearchElements?.();
            this.localizeBranchTooltips?.();
            this.localizeAgentsHeader?.();
            this.localizeCommandPalette?.();
            this.localizeCopilotTaskScreen?.();
            this.localizeNoResultsMessages?.();
            this.localizeUpdatedText?.();
            this.localizeRelativeTime?.();
            this.localizeCookiePreferencesPage?.();
            this.localizeFooter?.();
            this.localizeRepoMetadataDialog?.();
            this.localizeRepoSidebarAbout?.();
        }

        observeChanges() {
            this.observer = new MutationObserver((mutations) => {
                let shouldRelocalize = false;

                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        shouldRelocalize = true;
                        break;
                    }
                }

                if (shouldRelocalize) {
                    clearTimeout(this.relocalizeTimeout);
                    this.relocalizeTimeout = setTimeout(() => this.localize(), 100);
                }
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        stopObserving() {
            if (this.observer) this.observer.disconnect();
        }
    }

    // экспорт в глобал, чтобы видели другие @require-файлы и основной скрипт
    window.SimpleFTLParser = SimpleFTLParser;
    window.GitHubLocalizer = GitHubLocalizer;
})();
