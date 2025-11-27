// src/footer.js
(function () {
    'use strict';

    const LOG_PREFIX = window.GITMAP_LOG_PREFIX || '[GitMap]';

    if (!window.GitHubLocalizer) {
        console.warn(`${LOG_PREFIX} GitHubLocalizer is not defined. footer.js skipped.`);
        return;
    }

    /**
     * локализация страницы настройки предпочтений куки
     */
    GitHubLocalizer.prototype.localizeCookiePreferencesPage = function () {
        const cookieHeadingTranslation = this.getTranslation('manage-cookie-preferences');
        const cookieHeadingEnglish = 'Manage cookie preferences';

        if (cookieHeadingTranslation) {
            const headingElements = document.querySelectorAll('h1');
            headingElements.forEach(heading => {
                if (heading.textContent.trim() === cookieHeadingEnglish) {
                    this.localizeByText(heading, cookieHeadingEnglish, 'manage-cookie-preferences');
                }
            });
        }

        const cookieDescriptionTranslation = this.getTranslation('most-github-websites-use-cookies');
        const cookieDescriptionEnglish = 'Most GitHub websites use cookies. Cookies are small text files placed on your device to store data so web servers can use it later. GitHub and our third-party partners use cookies to remember your preferences and settings, help you sign in, show you personalized ads, and analyze how well our websites are working. For more info, see the Cookies and similar technologies section of the Privacy Statement.';

        if (!cookieDescriptionTranslation) return;

        const parts = cookieDescriptionTranslation.split(/\[link\]|\[\/link\]/);
        const hasLink = parts.length >= 3;

        const paragraphs = document.querySelectorAll('form p');
        const englishNormalized = cookieDescriptionEnglish.replace(/\s+/g, ' ').trim();

        paragraphs.forEach(paragraph => {
            const normalizedText = paragraph.textContent.replace(/\s+/g, ' ').trim();
            const alreadyLocalized = paragraph.getAttribute('data-ru-localized') === 'true';
            const matchesEnglish = normalizedText === englishNormalized;

            if (!matchesEnglish && !alreadyLocalized) return;

            if (hasLink) {
                const link = paragraph.querySelector('a');
                if (!link) {
                    this.localizeByText(paragraph, cookieDescriptionEnglish, 'most-github-websites-use-cookies');
                    return;
                }

                const prefix = parts[0] ?? '';
                const linkText = parts[1] ?? '';
                const suffix = parts.slice(2).join('');

                const fragment = document.createDocumentFragment();
                if (prefix) fragment.appendChild(document.createTextNode(prefix));
                link.textContent = linkText;
                fragment.appendChild(link);
                if (suffix) fragment.appendChild(document.createTextNode(suffix));

                paragraph.replaceChildren(fragment);
                paragraph.setAttribute('data-ru-localized', 'true');
            } else {
                this.localizeByText(paragraph, cookieDescriptionEnglish, 'most-github-websites-use-cookies');
            }
        });
    };

    /**
     * локализует подвал (footer)
     */
    GitHubLocalizer.prototype.localizeFooter = function () {
        // «© 2025 GitHub, Inc.»
        const copyrightSpans = document.querySelectorAll('span');
        copyrightSpans.forEach(span => {
            const text = span.textContent.trim();
            if (text.includes('© 2025 GitHub,') && text.includes('Inc.')) {
                this.localizeByText(span, '© 2025 GitHub,\u00A0Inc.', 'copyright-2025');
            }
        });

        // ссылки подвала
        const footerLinks = document.querySelectorAll('.Link--secondary.Link');
        const linkTranslations = [
            { text: 'Terms', key: 'terms' },
            { text: 'Privacy', key: 'privacy' },
            { text: 'Security', key: 'security' },
            { text: 'Status', key: 'status' },
            { text: 'Community', key: 'community' },
            { text: 'Docs', key: 'docs' },
            { text: 'Contact', key: 'contact' }
        ];

        footerLinks.forEach(link => {
            const text = link.textContent.trim();
            const translation = linkTranslations.find(t => t.text === text);
            if (translation) {
                this.localizeByText(link, translation.text, translation.key);
            }
        });

        // кнопки управления куки в подвале
        const cookieButtons = document.querySelectorAll('cookie-consent-link > button.Link--secondary.underline-on-hover');
        const cookieTranslations = [
            { text: 'Manage cookies', key: 'manage-cookies' },
            { text: 'Do not share my personal information', key: 'do-not-share-info' }
        ];

        cookieButtons.forEach(button => {
            const text = button.textContent.trim();
            const translation = cookieTranslations.find(t => t.text === text);
            if (translation) {
                this.localizeByText(button, translation.text, translation.key);
            }
        });
    };

})();
