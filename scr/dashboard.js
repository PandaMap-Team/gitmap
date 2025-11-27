// src/dashboard.js
(function () {
    'use strict';

    const LOG_PREFIX = window.GITMAP_LOG_PREFIX || '[GitMap]';

    if (!window.GitHubLocalizer) {
        console.warn(`${LOG_PREFIX} GitHubLocalizer is not defined. dashboard.js skipped.`);
        return;
    }

    GitHubLocalizer.prototype.localizeDashboard = function () {
        const dashboardElements = document.querySelectorAll('.AppHeader-context-item-label');
        dashboardElements.forEach(el => {
            this.localizeByText(el, 'Dashboard', 'dashboard');
        });
    };

    GitHubLocalizer.prototype.localizeSearchPlaceholder = function () {
        const searchInput = document.querySelector('#qb-input-query');
        if (!searchInput) return;

        const translation = this.getTranslation('type-slash-to-search');
        if (!translation) return;

        const normalizedTranslation = this.normalizeSearchPlaceholderText(translation);
        if (!normalizedTranslation) return;

        const currentText = searchInput.textContent.replace(/\s+/g, ' ').trim();
        const hasOriginalText = currentText.includes('Type') && currentText.includes('to search');

        if (searchInput.getAttribute('data-ru-localized') === 'true') {
            if (!currentText || currentText !== normalizedTranslation || (translation.includes('{{kbd}}') && !searchInput.querySelector('kbd'))) {
                this.renderSearchPlaceholder(searchInput, translation);
            }
            this.protectSearchElement(searchInput, translation, normalizedTranslation);
            return;
        }

        if (!hasOriginalText) return;

        this.renderSearchPlaceholder(searchInput, translation);
        searchInput.setAttribute('data-ru-localized', 'true');
        this.protectSearchElement(searchInput, translation, normalizedTranslation);
    };

    GitHubLocalizer.prototype.protectSearchElement = function (element, translation, normalizedTranslation = null) {
        if (this.protectedElements.has(element)) return;

        const expectedText = normalizedTranslation ?? this.normalizeSearchPlaceholderText(translation) ?? '';

        const protectionObserver = new MutationObserver(() => {
            const currentText = element.textContent.replace(/\s+/g, ' ').trim();
            const hasOriginalText = currentText.includes('Type') && currentText.includes('to search');
            const hasKbd = Boolean(element.querySelector('kbd'));

            if (!hasOriginalText && currentText === expectedText && (!translation.includes('{{kbd}}') || hasKbd)) {
                return;
            }

            this.renderSearchPlaceholder(element, translation);
            element.setAttribute('data-ru-localized', 'true');
        });

        protectionObserver.observe(element, {
            characterData: true,
            childList: true,
            subtree: true
        });

        this.protectedElements.set(element, {
            observer: protectionObserver,
            translation: translation
        });
    };

    GitHubLocalizer.prototype.localizeTooltips = function () {
        // «Command palette»
        const commandPaletteTooltips = document.querySelectorAll('tool-tip[for="AppHeader-commandPalette-button"]');
        commandPaletteTooltips.forEach(tooltip => {
            this.localizeByText(tooltip, 'Command palette', 'command-palette');
        });

        // «Chat with Copilot»
        const copilotTooltips = document.querySelectorAll('tool-tip[for="copilot-chat-header-button"]');
        copilotTooltips.forEach(tooltip => {
            this.localizeByText(tooltip, 'Chat with Copilot', 'chat-with-copilot');
        });
    };

    GitHubLocalizer.prototype.localizeAllTooltips = function () {
        const tooltipTranslations = [
            { selector: 'tool-tip[for="global-copilot-agent-button"]', text: 'Open agents panel', key: 'open-agents-panel' },
            { selector: 'tool-tip[for="global-create-menu-anchor"]', text: 'Create new…', key: 'create-new' },
            { selector: 'tool-tip#notification-indicator-tooltip', text: 'You have no unread notifications', key: 'you-have-no-notifications' }
        ];

        tooltipTranslations.forEach(({ selector, text, key }) => {
            const tooltips = document.querySelectorAll(selector);
            tooltips.forEach(tooltip => {
                this.localizeByText(tooltip, text, key);
            });
        });

        this.localizeDynamicTooltips();
    };

    GitHubLocalizer.prototype.localizeDynamicTooltips = function () {
        const dynamicTranslations = [
            { text: 'Your issues', key: 'your-issues' },
            { text: 'Your pull requests', key: 'your-pull-requests' },
            { text: 'Account switcher', key: 'account-switcher' }
        ];

        const allTooltips = document.querySelectorAll('tool-tip, .prc-TooltipV2-Tooltip-cYMVY');
        allTooltips.forEach(tooltip => {
            const text = tooltip.textContent.trim();
            const translation = dynamicTranslations.find(t => t.text === text);
            if (translation) {
                this.localizeByText(tooltip, translation.text, translation.key);
            }
        });
    };

    GitHubLocalizer.prototype.localizeGreeting = function () {
        const greetingElements = document.querySelectorAll('.h2.prc-Heading-Heading-6CmGO');

        greetingElements.forEach(el => {
            const text = el.textContent.trim();

            const patterns = [
                { regex: /^Good night,\s*(.+)!$/, key: 'good-night' },
                { regex: /^Good morning,\s*(.+)!$/, key: 'good-morning' },
                { regex: /^Good afternoon,\s*(.+)!$/, key: 'good-afternoon' },
                { regex: /^Good evening,\s*(.+)!$/, key: 'good-evening' }
            ];

            const alreadyLocalized = patterns.some(pattern => {
                const translation = this.getTranslation(pattern.key);
                return translation ? text.startsWith(translation) : false;
            });

            if (alreadyLocalized) return;

            for (const pattern of patterns) {
                const match = text.match(pattern.regex);
                if (match) {
                    const username = match[1];
                    const translation = this.getTranslation(pattern.key);
                    if (translation) {
                        el.textContent = `${translation}, ${username}!`;
                        el.setAttribute('data-ru-localized', 'true');
                        break;
                    }
                }
            }
        });
    };

    GitHubLocalizer.prototype.localizeGitHubEducation = function () {
        const taglines = document.querySelectorAll('.h4');
        taglines.forEach(el => {
            this.localizeByText(el, 'Learn. Collaborate. Grow.', 'learn-collaborate-grow');
        });

        const descriptions = document.querySelectorAll('p.my-3.text-small');
        descriptions.forEach(el => {
            const text = el.textContent.trim().replace(/\s+/g, ' ');
            const translation = this.getTranslation('github-education-gives-here');
            if (!translation) return;

            if (text === translation) {
                el.setAttribute('data-ru-localized', 'true');
                return;
            }

            if (text.includes('GitHub Education gives you the tools')) {
                el.textContent = translation;
                el.setAttribute('data-ru-localized', 'true');
            }
        });

        const buttons = document.querySelectorAll('.Button-label');
        buttons.forEach(button => {
            this.localizeByText(button, 'Go to GitHub Education', 'go-to-github-education');
        });
    };

    GitHubLocalizer.prototype.localizeDashboardElements = function () {
        const changelogTitles = document.querySelectorAll('.dashboard-changelog__title');
        changelogTitles.forEach(title => {
            this.localizeByText(title, 'Latest from our changelog', 'latest-from-our-changelog');
        });

        const stackLabels = document.querySelectorAll('.prc-Stack-Stack-WJVsK[data-gap="condensed"]');
        stackLabels.forEach(label => {
            const text = label.textContent.trim();
            if (text === 'Agent sessions') {
                this.localizeByText(label, 'Agent sessions', 'agent-sessions');
            } else if (text === 'Pull requests') {
                this.localizeByText(label, 'Pull requests', 'pull-requests');
            } else if (text === 'Issues') {
                this.localizeByText(label, 'Issues', 'issues');
            }
        });

        const viewAllLinks = document.querySelectorAll('a.prc-Link-Link-85e08');
        viewAllLinks.forEach(link => {
            this.localizeByText(link, 'View all', 'view-all');
        });

        const showMoreSpans = document.querySelectorAll('span.color-fg-muted.f6');
        showMoreSpans.forEach(span => {
            this.localizeByText(span, 'Show more', 'show-more');
        });

        const changelogLinks = document.querySelectorAll('a.text-small.mt-2.Link--muted[href*="changelog"]');
        changelogLinks.forEach(link => {
            this.localizeByText(link, 'View changelog →', 'view-changelog');
        });
    };

    GitHubLocalizer.prototype.localizeDashboardTooltips = function () {
        const tooltipTranslations = [
            { text: 'Agent sessions options', key: 'agent-sessions-options' },
            { text: 'Pull request options', key: 'pull-request-options' },
            { text: 'Issue options', key: 'issue-options' },
            { text: 'Search for repositories', key: 'search-for-repositories' },
            { text: 'Open in Copilot Chat', key: 'open-in-copilot-chat' },
            { text: 'Assign to Copilot', key: 'assign-to-copilot' },
            { text: 'Send now', key: 'send-now' },
            { text: 'Close menu', key: 'close-menu' },
            { text: 'Select a custom agent', key: 'select-custom-agent' },
            { text: 'Start task', key: 'start-task' }
        ];

        const tooltips = document.querySelectorAll('.prc-TooltipV2-Tooltip-cYMVY');
        tooltips.forEach(tooltip => {
            if (tooltip.hasAttribute('data-ru-localized')) return;

            const firstSpan = tooltip.querySelector('span[id]');
            let visibleText;
            let targetElement;

            if (firstSpan) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = firstSpan.innerHTML;
                tempDiv.querySelectorAll('.prc-src-InternalVisuallyHidden-nlR9R').forEach(el => el.remove());
                visibleText = tempDiv.textContent.trim();
                targetElement = firstSpan;
            } else {
                visibleText = tooltip.textContent.trim();
                targetElement = tooltip;
            }

            const translation = tooltipTranslations.find(t => t.text === visibleText);
            if (translation) {
                const ftlTranslation = this.getTranslation(translation.key);
                if (ftlTranslation) {
                    if (firstSpan) {
                        const hiddenSpan = firstSpan.querySelector('.prc-src-InternalVisuallyHidden-nlR9R');
                        firstSpan.textContent = ftlTranslation;
                        if (hiddenSpan) firstSpan.appendChild(hiddenSpan);
                    } else {
                        this.localizeByText(targetElement, visibleText, translation.key);
                    }
                    tooltip.setAttribute('data-ru-localized', 'true');
                }
            }
        });
    };

    GitHubLocalizer.prototype.localizeSearchElements = function () {
        const syntaxLinks = document.querySelectorAll('a.Link.color-fg-accent.text-normal[href*="understanding-github-code-search-syntax"]');
        syntaxLinks.forEach(link => {
            this.localizeByText(link, 'Search syntax tips', 'search-syntax-tips');
        });

        const feedbackButtons = document.querySelectorAll('button.Button--link .Button-label');
        feedbackButtons.forEach(label => {
            this.localizeByText(label, 'Give feedback', 'give-feedback');
        });
    };

})();
