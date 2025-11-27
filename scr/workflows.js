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
                this.localizeByText(subtitle, 'Based on your tech stack', 'based-on-tech-stack');
            }

            // Перевод кнопок "Configure <Tool>"
            const configureButtons = block.querySelectorAll('a.Button--secondary.Button--small');
            configureButtons.forEach(btn => {
                const label = btn.querySelector('.Button-label');
                if (!label) return;

                const toolName = label.textContent.replace('Configure', '').trim();
                const translatedConfigure = this.getTranslation('configure');

                if (translatedConfigure) {
                    label.innerHTML = `${translatedConfigure} <span class="sr-only">${toolName}</span>`;
                }
            });

            // Описание под тулом
            const descriptions = block.querySelectorAll('span.color-fg-muted.f6');
            descriptions.forEach(desc => {
                const text = desc.textContent.trim();

                if (text === 'Build a NodeJS project with npm and grunt.') {
                    this.localizeByText(desc, text, 'workflow-grunt-desc');
                }

                if (text === 'Build a NodeJS project with npm and webpack.') {
                    this.localizeByText(desc, text, 'workflow-webpack-desc');
                }

                if (text === 'Test your Deno project') {
                    this.localizeByText(desc, text, 'workflow-deno-desc');
                }
            });

            // More workflows
            const more = block.querySelector('a.Link');
            if (more && more.textContent.trim() === 'More workflows') {
                this.localizeByText(more, 'More workflows', 'more-workflows');
            }

            // Dismiss suggestions
            const dismiss = block.querySelector('button.Button--link');
            if (dismiss && dismiss.textContent.trim() === 'Dismiss suggestions') {
                this.localizeByText(dismiss, 'Dismiss suggestions', 'dismiss-suggestions');
            }
        });
    };

    console.info(`${LOG_PREFIX} workflows.js loaded.`);
})();
