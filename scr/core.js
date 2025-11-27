// src/core.js

(function () {
    'use strict';

    const LOG_PREFIX = window.GITMAP_LOG_PREFIX || '[GitMap]';

    class SimpleFTLParser {
        constructor(ftlContent) {
            this.messages = new Map();
            this.parse(ftlContent);
        }
        parse(content) {
            const lines = content.split('\n');
            for (let line of lines) {
                line = line.trim();
                if (!line || line.startsWith('#')) continue;
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

    class GitHubLocalizer {
        constructor(ftlContent) {
            this.parser = new SimpleFTLParser(ftlContent);
            this.observer = null;
            this.protectedElements = new Map();
            console.info(`${LOG_PREFIX} Localizer initialized with ${this.parser.messages.size} messages.`);
        }

        getTranslation(key, fallback = null) {
            const msg = this.parser.getMessage(key);
            return msg != null ? msg : fallback;
        }

        localizeByText(element, originalText, messageKey) {
            if (!element || !element.textContent) return false;
            const currentText = element.textContent.trim();
            const translation = this.getTranslation(messageKey);
            if (!translation) return false;

            if (currentText === translation) {
                this.protectElement(element, translation);
                return false;
            }
            if (currentText !== originalText) return false;

            element.textContent = translation;
            element.setAttribute('data-ru-localized', 'true');
            this.protectElement(element, translation);
            return true;
        }

        protectElement(element, translatedText) {
            if (this.protectedElements.has(element)) return;

            const protectionObserver = new MutationObserver((mutations) => {
                for (const m of mutations) {
                    if (m.type === 'characterData' || m.type === 'childList') {
                        const current = element.textContent.trim();
                        if (current !== translatedText) {
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

        // тут оставляешь общие утилиты: normalizeSearchPlaceholderText,
        // renderSearchPlaceholder, createFragmentFromKbdTranslation,
        // replaceContentWithKbdTranslation, cleanRelativeTimeShadow и т.д.

        localize() {
            // список методов-локализаторов остаётся, но сами методы
            // реализуются в других файлах через prototype
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
                for (const m of mutations) {
                    if (m.type === 'childList' && m.addedNodes.length > 0) {
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

    // экспортируем классы в глобал, чтобы другие @require-файлы могли пользоваться
    window.SimpleFTLParser = SimpleFTLParser;
    window.GitHubLocalizer = GitHubLocalizer;
})();
