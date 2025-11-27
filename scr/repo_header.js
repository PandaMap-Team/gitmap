// scr/repo_header.js
(function () {
    'use strict';

    if (!window.GitHubLocalizer) return;

    const LOG_PREFIX = window.GITMAP_LOG_PREFIX || '[GitMap]';

    // Оборачиваем исходный localize, чтобы не трогать core.js
    const originalLocalize = GitHubLocalizer.prototype.localize;

    GitHubLocalizer.prototype.localize = function () {
        if (typeof originalLocalize === 'function') {
            originalLocalize.call(this);
        }

        // наши новые штуки
        this.localizeRepoSidebarSections?.();
        this.localizeRepoHeaderActions?.();
    };

    /**
     * Releases / Packages / Languages в правой колонке
     */
    GitHubLocalizer.prototype.localizeRepoSidebarSections = function () {
        const cells = document.querySelectorAll('.BorderGrid-cell');
        if (!cells.length) return;

        cells.forEach(cell => {
            const h2 = cell.querySelector('h2.h4.mb-3');
            if (!h2) return;

            const titleText = h2.textContent.trim();

            // --- Releases ---
            if (titleText === 'Releases') {
                const link = h2.querySelector('a');
                if (link) {
                    this.localizeByText(link, 'Releases', 'releases');
                }

                const info = cell.querySelector('.text-small.color-fg-muted');
                if (info) {
                    this.localizeByText(info, 'No releases published', 'no-releases-published');
                }

                const createLink = cell.querySelector('.text-small a.Link--inTextBlock[href$="/releases/new"]');
                if (createLink) {
                    this.localizeByText(createLink, 'Create a new release', 'create-new-release');
                }
                return;
            }

            // --- Packages ---
            if (titleText === 'Packages') {
                const link = h2.querySelector('a');
                if (link) {
                    this.localizeByText(link, 'Packages', 'packages');
                }

                const info = cell.querySelector('.text-small.color-fg-muted');
                if (info) {
                    this.localizeByText(info, 'No packages published', 'no-packages-published');
                }

                const publishLink = cell.querySelector('.text-small a.Link--inTextBlock[href*="/packages"]');
                if (publishLink) {
                    this.localizeByText(publishLink, 'Publish your first package', 'publish-your-first-package');
                }
                return;
            }

            // --- Languages ---
            if (titleText === 'Languages') {
                this.localizeByText(h2, 'Languages', 'languages');
                // названия языков (JavaScript, Fluent) оставляем как есть
            }
        });
    };

    /**
     * Хедер репозитория: Public, Edit Pins, Pin to…, Watch, Fork, Star, Lists и т.п.
     */
    GitHubLocalizer.prototype.localizeRepoHeaderActions = function () {
        const titleBlock = document.querySelector('#repo-title-component');
        const actionsContainer = document.querySelector('#repository-details-container');

        // бейдж "Public"
        if (titleBlock) {
            const publicLabel = titleBlock.querySelector('.Label--secondary');
            if (publicLabel) {
                this.localizeByText(publicLabel, 'Public', 'public-repository');
            }
        }

        // блок "Edit Pins" / "Pin to…"
        const pinComponent = document.querySelector('pin-organization-repo');
        if (pinComponent) {
            // кнопка "Edit Pins"
            const summary = pinComponent.querySelector('summary.btn-sm.btn');
            if (summary) {
                this.localizeByText(summary, 'Edit Pins', 'edit-pins');
            }

            const menu = pinComponent.querySelector('.SelectMenu');
            if (menu) {
                const title = menu.querySelector('.SelectMenu-title');
                if (title) {
                    // в оригинале "Pin to… " с пробелом
                    this.localizeByText(title, 'Pin to\u2026 ', 'pin-to');
                }

                const rows = menu.querySelectorAll('.SelectMenu-item');
                rows.forEach(row => {
                    const h5 = row.querySelector('h5');
                    const span = row.querySelector('span');

                    if (h5) {
                        const text = h5.textContent.trim();
                        if (text === 'Public pins in this organization') {
                            this.localizeByText(h5, text, 'public-pins-org');
                        } else if (text === 'Private pins in this organization') {
                            this.localizeByText(h5, text, 'private-pins-org');
                        } else if (text === 'Profile') {
                            this.localizeByText(h5, 'Profile', 'profile');
                        }
                    }

                    if (span) {
                        const text = span.textContent.trim();
                        if (text === 'Visible to anyone') {
                            this.localizeByText(span, text, 'visible-to-anyone');
                        } else if (text === 'Visible to members only') {
                            this.localizeByText(span, text, 'visible-to-members-only');
                        } else if (text === 'Pin this to your personal profile, visible to everyone') {
                            this.localizeByText(span, text, 'pin-to-personal-profile');
                        }
                    }
                });

                // кнопки Cancel / Apply (Cancel уже есть в FTL)
                const footer = menu.querySelector('.SelectMenu-footer');
                if (footer) {
                    const buttons = footer.querySelectorAll('button.btn, button.btn-primary');
                    buttons.forEach(btn => {
                        const text = btn.textContent.trim();
                        if (text === 'Cancel') {
                            this.localizeByText(btn, 'Cancel', 'cancel');
                        } else if (text === 'Apply') {
                            this.localizeByText(btn, 'Apply', 'apply');
                        }
                    });
                }
            }
        }

        if (!actionsContainer) return;

        // кнопка Watch (с счётчиком)
        const watchButtons = actionsContainer.querySelectorAll(
            'button[data-testid^="notifications-subscriptions-menu-button"]'
        );
        watchButtons.forEach(button => {
            const labelSpan = button.querySelector('.prc-Button-Label-pTQ3x');
            if (!labelSpan) return;

            const translation = this.getTranslation('watch');
            if (!translation) return;

            // ищем текстовый узел "Watch"
            const textNode = Array.from(labelSpan.childNodes).find(
                n => n.nodeType === Node.TEXT_NODE && n.textContent.trim() === 'Watch'
            );
            if (textNode) {
                textNode.textContent = textNode.textContent.replace('Watch', translation);
            }
        });

        // кнопка Fork + tooltip "Forks could not be loaded" в меню форков
        const forkButton = actionsContainer.querySelector('#fork-button');
        if (forkButton) {
            const forkTranslation = this.getTranslation('fork');
            if (forkTranslation) {
                const textNode = Array.from(forkButton.childNodes).find(
                    n => n.nodeType === Node.TEXT_NODE && n.textContent.trim() === 'Fork'
                );
                if (textNode) {
                    textNode.textContent = textNode.textContent.replace('Fork', forkTranslation);
                }
            }
        }

        // текст "Forks could not be loaded" внутри include-fragment
        const forkErrorParagraphs = actionsContainer.querySelectorAll(
            'include-fragment p'
        );
        forkErrorParagraphs.forEach(p => {
            const text = p.textContent.trim();
            if (text === 'Forks could not be loaded') {
                this.localizeByText(p, text, 'forks-could-not-be-loaded');
            }
        });

        // кнопки Star / Starred и меню Lists
        const starringContainer = actionsContainer.querySelector('.starring-container');
        if (!starringContainer) return;

        // состояние "Starred"
        const starredForm = starringContainer.querySelector('.starred form');
        if (starredForm) {
            const btn = starredForm.querySelector('button');
            const labelSpan = btn?.querySelector('span.d-inline');
            if (labelSpan) {
                this.localizeByText(labelSpan, 'Starred', 'starred');
            }

            // кнопка Unstar в подтверждающем диалоге (template)
            const template = document.querySelector('.js-unstar-confirmation-dialog-template');
            if (template) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = template.innerHTML;

                const title = tempDiv.querySelector('.Box-title');
                if (title) {
                    this.localizeByText(title, 'Unstar this repository?', 'unstar-this-repository');
                }

                const unstarBtn = tempDiv.querySelector('button.btn-danger.btn');
                if (unstarBtn) {
                    this.localizeByText(unstarBtn, 'Unstar', 'unstar');
                }

                template.innerHTML = tempDiv.innerHTML;
            }
        }

        // состояние "Star"
        const unstarredForm = starringContainer.querySelector('.unstarred form');
        if (unstarredForm) {
            const btn = unstarredForm.querySelector('button');
            const labelSpan = btn?.querySelector('span.d-inline');
            if (labelSpan) {
                this.localizeByText(labelSpan, 'Star', 'star');
            }
        }

        // заголовок "Lists" в меню списков
        const listsTitles = actionsContainer.querySelectorAll(
            '.SelectMenu-header .SelectMenu-title.f5#user-lists-menu'
        );
        listsTitles.forEach(title => {
            this.localizeByText(title, 'Lists', 'lists');
        });

        // текст "Loading" (sr-only)
        const loadingSpans = actionsContainer.querySelectorAll('.SelectMenu-loading .sr-only');
        loadingSpans.forEach(span => {
            this.localizeByText(span, 'Loading', 'loading');
        });
    };

    console.info(`${LOG_PREFIX} repo_header.js loaded.`);
})();
