(function () {
    'use strict';

    if (!window.GitHubLocalizer) return;

    const LOG_PREFIX = window.GITMAP_LOG_PREFIX || '[GitMap]';

    const originalLocalize = GitHubLocalizer.prototype.localize;

    GitHubLocalizer.prototype.localize = function () {
        if (typeof originalLocalize === 'function') {
            originalLocalize.call(this);
        }

        this.localizeSuggestedWorkflows?.();
    };

    GitHubLocalizer.prototype.localizeSuggestedWorkflows = function () {
        const blocks = document.querySelectorAll('.BorderGrid-cell');
        if (!blocks.length) return;

        blocks.forEach(block => {
            const title = block.querySelector('h2.h4.Subhead-heading--large');
            if (!title) return;

            const text = title.textContent.trim();
            if (text !== 'Suggested workflows') return;

            // Заголовок
            this.localizeByText(title, 'Suggested workflows', 'suggested-workflows');

            // Подзаголовок
            const subtitle = block.querySelector('.Subhead-description');
            if (subtitle) {
                this.localizeByText(subtitle, 'Based o
