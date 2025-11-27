// src/repo.js
(function () {
    'use strict';

    if (!window.GitHubLocalizer) return;

    //
    // Вкладки репозитория (Code / Issues / Actions / ... )
    //
    GitHubLocalizer.prototype.localizeRepoTabs = function () {
        const tabMap = new Map([
            ['Code', 'code'],
            ['Settings', 'settings'],
            ['Issues', 'issues'],
            ['Pull requests', 'pull-requests'],
            ['Actions', 'actions'],
            ['Projects', 'projects'],
            ['Security', 'security'],
            ['Insights', 'insights']
        ]);

        const repoNav = document.querySelector('nav[aria-label="Repository"]');
        if (!repoNav) return;

        const tabSpans = repoNav.querySelectorAll('.UnderlineNav-item span[data-content]');

        tabSpans.forEach(span => {
            if (span.getAttribute('data-ru-localized') === 'true') return;

            const english = span.getAttribute('data-content') || span.textContent.trim();
            const key = tabMap.get(english);
            if (!key) return;

            this.localizeByText(span, english, key);

            const translation = this.getTranslation(key);
            if (translation) {
                span.setAttribute('data-content', translation);
            }

            span.setAttribute('data-ru-localized', 'true');
        });

        const overflowLabels = repoNav.querySelectorAll('.ActionListItem-label');
        overflowLabels.forEach(label => {
            if (label.getAttribute('data-ru-localized') === 'true') return;

            const text = label.textContent.trim();
            const key = tabMap.get(text);
            if (!key) return;

            this.localizeByText(label, text, key);
        });
    };

    //
    // Диалог "Edit repository details"
    //
    GitHubLocalizer.prototype.localizeRepoMetadataDialog = function () {
        const dialog = document.querySelector('details-dialog[aria-label="Edit repository details"]');
        if (!dialog) return;

        const title = dialog.querySelector('.Box-title');
        if (title) {
            this.localizeByText(title, 'Edit repository details', 'edit-repo-details');
        }

        const descLabel = dialog.querySelector('label[for="repo_description"]');
        if (descLabel) {
            this.localizeByText(descLabel, 'Description', 'description');
        }

        const descInput = dialog.querySelector('#repo_description');
        if (descInput) {
            const t = this.getTranslation('short-description');
            if (t) {
                descInput.setAttribute('placeholder', t);
            }
        }

        const siteLabel = dialog.querySelector('label[for="repo_homepage"]');
        if (siteLabel) {
            this.localizeByText(siteLabel, 'Website', 'website');
        }

        const siteInput = dialog.querySelector('#repo_homepage');
        if (siteInput) {
            const t = this.getTranslation('enter-valid-url');
            if (t) {
                siteInput.setAttribute('placeholder', t);
            }
        }

        const topicsLabel = dialog.querySelector('label[for="repo_topics"]');
        if (topicsLabel) {
            const plainTextNode = [...topicsLabel.childNodes].find(
                n => n.nodeType === Node.TEXT_NODE && n.textContent.trim().startsWith('Topics')
            );
            if (plainTextNode) {
                const t = this.getTranslation('topics');
                if (t) plainTextNode.textContent = t + ' ';
            }

            const hintSpan = topicsLabel.querySelector('span');
            if (hintSpan) {
                this.localizeByText(hintSpan, '(separate with spaces)', 'separate-with-spaces');
            }
        }

        const includeHeading = dialog.querySelector('#hidden_sidebar_options');
        if (includeHeading) {
            this.localizeByText(includeHeading, 'Include in the home page', 'include-in-home-page');
        }

        const sectionMap = new Map([
            ['Releases', 'releases'],
            ['Packages', 'packages'],
            ['Deployments', 'deployments']
        ]);

        dialog.querySelectorAll('label[for^="repo_sections_"]').forEach(label => {
            const textNode = [...label.childNodes].find(
                n => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
            );
            if (!textNode) return;

            const english = textNode.textContent.trim();
            const key = sectionMap.get(english);
            if (!key) return;

            const t = this.getTranslation(key);
            if (t) {
                textNode.textContent = ' ' + t;
            }
        });

        const saveButton = dialog.querySelector('button[type="submit"][form="repo_metadata_form"]');
        if (saveButton) {
            this.localizeByText(saveButton, 'Save changes', 'save-changes');
        }

        const cancelButton = dialog.querySelector('button[type="reset"][form="repo_metadata_form"]');
        if (cancelButton) {
            this.localizeByText(cancelButton, 'Cancel', 'cancel');
        }
    };

    //
    // Блок "About" в сайдбаре репозитория
    //
    GitHubLocalizer.prototype.localizeRepoSidebarAbout = function () {
        const container = document.querySelector('.BorderGrid-row .BorderGrid-cell .hide-sm.hide-md');
        if (!container) return;

        const aboutHeading = container.querySelector('h2.mb-3.h4');
        if (aboutHeading) {
            this.localizeByText(aboutHeading, 'About', 'about');
        }

        const resourcesH3 = [...container.querySelectorAll('h3.sr-only')].find(
            h3 => h3.textContent.trim() === 'Resources'
        );
        if (resourcesH3) {
            this.localizeByText(resourcesH3, 'Resources', 'resources');
        }

        const readmeLink = container.querySelector('a.Link--muted[href$="#readme-ov-file"]');
        if (readmeLink) {
            const span = readmeLink.querySelector('span') || readmeLink;
            this.localizeByText(span, 'Readme', 'readme');
        }

        const licenseH3 = [...container.querySelectorAll('h3.sr-only')].find(
            h3 => h3.textContent.trim() === 'License'
        );
        if (licenseH3) {
            this.localizeByText(licenseH3, 'License', 'license');
        }

        const licenseLink = container.querySelector('a[href$="#MIT-1-ov-file"]');
        if (licenseLink) {
            this.localizeByText(licenseLink, 'MIT license', 'mit-license');
        }

        const activityLink = container.querySelector('a[href$="/activity"] span.color-fg-muted');
        if (activityLink) {
            this.localizeByText(activityLink, 'Activity', 'activity');
        }

        const customPropsLink = container.querySelector('a[href$="/custom-properties"] span.color-fg-muted');
        if (customPropsLink) {
            this.localizeByText(customPropsLink, 'Custom properties', 'custom-properties');
        }

        const starsH3 = [...container.querySelectorAll('h3.sr-only')].find(
            h3 => h3.textContent.trim() === 'Stars'
        );
        if (starsH3) {
            this.localizeByText(starsH3, 'Stars', 'stars-heading');
        }

        const starsLink = container.querySelector('a[href$="/stargazers"]');
        if (starsLink) {
            const textNode = [...starsLink.childNodes].find(
                n => n.nodeType === Node.TEXT_NODE && n.textContent.includes('stars')
            );
            if (textNode) {
                const t = this.getTranslation('stars-label') || 'звёзд';
                textNode.textContent = ' ' + t;
            }
        }

        const watchersH3 = [...container.querySelectorAll('h3.sr-only')].find(
            h3 => h3.textContent.trim() === 'Watchers'
        );
        if (watchersH3) {
            this.localizeByText(watchersH3, 'Watchers', 'watchers-heading');
        }

        const watchersLink = container.querySelector('a[href$="/watchers"]');
        if (watchersLink) {
            const textNode = [...watchersLink.childNodes].find(
                n => n.nodeType === Node.TEXT_NODE && n.textContent.includes('watching')
            );
            if (textNode) {
                const t = this.getTranslation('watching') || 'наблюдают';
                textNode.textContent = ' ' + t;
            }
        }

        const forksH3 = [...container.querySelectorAll('h3.sr-only')].find(
            h3 => h3.textContent.trim() === 'Forks'
        );
        if (forksH3) {
            this.localizeByText(forksH3, 'Forks', 'forks-heading');
        }

        const forksLink = container.querySelector('a[href$="/forks"]');
        if (forksLink) {
            const textNode = [...forksLink.childNodes].find(
                n => n.nodeType === Node.TEXT_NODE && n.textContent.includes('forks')
            );
            if (textNode) {
                const t = this.getTranslation('forks-heading') || 'Форки';
                textNode.textContent = ' ' + t.toLowerCase();
            }
        }

        const reportLink = container.querySelector('a[href*="/contact/report-content"]');
        if (reportLink) {
            this.localizeByText(reportLink, 'Report repository', 'report-repository');
        }

        const errorHeading = container.querySelector('.blankslate-heading');
        if (errorHeading) {
            this.localizeByText(errorHeading, 'Uh oh!', 'uh-oh');
        }

        const errorParagraph = container.querySelector(
            '.blankslate p.color-fg-muted.my-2.mb-2.ws-normal'
        );
        if (errorParagraph) {
            const link = errorParagraph.querySelector('a');

            const translationText = this.getTranslation('reload-error');
            const linkText = this.getTranslation('please-reload-page');

            if (translationText && link && linkText) {
                link.textContent = linkText;
                errorParagraph.textContent = '';
                errorParagraph.append(
                    document.createTextNode(translationText + ' '),
                    link,
                    document.createTextNode('.')
                );
            } else {
                this.localizeByText(
                    errorParagraph,
                    'There was an error while loading. Please reload this page.',
                    'reload-error'
                );
            }
        }
    };

})();
