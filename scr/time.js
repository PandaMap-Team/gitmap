// src/time.js
(function () {
    'use strict';

    const LOG_PREFIX = window.GITMAP_LOG_PREFIX || '[GitMap]';

    if (!window.GitHubLocalizer) {
        console.warn(`${LOG_PREFIX} GitHubLocalizer is not defined. time.js skipped.`);
        return;
    }

    /**
     * локализация относительного времени
     */
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

            // переводим всплывающую подсказку через FTL
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

        // локализация текстов «Created on», «Opened by», Updated и # в описаниях элементов
        const numberSignTranslation = this.getTranslation('number-sign');
        const descriptions = document.querySelectorAll('.Description-module__container--Ks2Eo');
        descriptions.forEach(desc => {
            const text = desc.textContent || '';
            const container = desc.closest('.ItemContainer-module__contents--EBVbu');

            const isIssue = container && container.querySelector('.octicon-issue-opened');
            const isPR = container && container.querySelector('.octicon-git-pull-request, .octicon-git-pull-request-draft');

            // «Opened by»
            if (text.includes('Opened by')) {
                let translationKey = null;

                if (isIssue) {
                    translationKey = 'issue-opened-by';
                } else if (isPR || !text.includes('Created')) {
                    translationKey = 'opened-by';
                }

                if (translationKey) {
                    const translation = this.getTranslation(translationKey);
                    if (translation) {
                        const originalHTML = desc.innerHTML;
                        const replacedHTML = originalHTML.replace(/Opened by/g, translation);

                        if (replacedHTML !== originalHTML) {
                            desc.innerHTML = replacedHTML;
                            desc.setAttribute('data-ru-localized', 'true');
                        }
                    }
                }
            }

            // Updated
            if (text.includes('Updated')) {
                let translationKey = null;

                if (isIssue) {
                    translationKey = 'issue-updated';
                } else if (isPR) {
                    translationKey = 'pr-updated';
                }

                if (translationKey) {
                    const translation = this.getTranslation(translationKey);
                    if (translation) {
                        const originalHTML = desc.innerHTML;
                        const updatedOnPattern = /Updated(?:\s|&nbsp;)+on(?=(?:\s|&nbsp;|<))/g;
                        const updatedPattern = /Updated/g;
                        let html = originalHTML;
                        html = html.replace(updatedOnPattern, translation);
                        html = html.replace(updatedPattern, translation);

                        if (html !== originalHTML) {
                            desc.innerHTML = html;
                            desc.setAttribute('data-updated-localized', 'true');
                        }
                    }
                }
            }

            // «Created on»
            if (text.includes('Created')) {
                const defaultCreated = this.getTranslation('created-on', 'Created');
                const translation = isIssue
                    ? this.getTranslation('issue-created-on', defaultCreated)
                    : defaultCreated;

                if (translation) {
                    const originalHTML = desc.innerHTML;
                    const createdOnPattern = /Created(?:\s|&nbsp;)+on(?=(?:\s|&nbsp;|<))/g;
                    const createdPattern = /Created/g;
                    let html = originalHTML;
                    html = html.replace(createdOnPattern, translation);
                    html = html.replace(createdPattern, translation);

                    if (html !== originalHTML) {
                        desc.innerHTML = html;
                        desc.setAttribute('data-created-localized', 'true');
                    }
                }
            }

            if (numberSignTranslation && text.includes('#')) {
                const numberWalker = document.createTreeWalker(desc, NodeFilter.SHOW_TEXT, null);
                let numberNode;
                while ((numberNode = numberWalker.nextNode())) {
                    if (!numberNode.textContent || !numberNode.textContent.includes('#')) continue;

                    const updated = numberNode.textContent.replace(/#(?=\d)/g, numberSignTranslation);
                    if (updated !== numberNode.textContent) {
                        numberNode.textContent = updated;
                    }
                }
            }

            // удаляем on, который остаётся перед датами/relative-time
            const walker = document.createTreeWalker(desc, NodeFilter.SHOW_TEXT, null);
            const textNodesToClean = [];
            let textNode;

            while ((textNode = walker.nextNode())) {
                if (!textNode.textContent) continue;
                if (/\bon\b/i.test(textNode.textContent)) {
                    textNodesToClean.push(textNode);
                }
            }

            textNodesToClean.forEach(node => {
                let content = node.textContent;

                content = content.replace(/(Отредактирован(?:а)?|Создан(?:а)?)(?:[\s\u00a0]+)on\b(?:[\s\u00a0]*)/gi, '$1 ');
                content = content.replace(/[\s\u00a0]*\bon\b[\s\u00a0]*/gi, ' ');
                content = content.replace(/\s{2,}/g, ' ');

                node.textContent = content;
            });
        });
    };

    /**
     * локализует текстовые узлы с Updated
     */
    GitHubLocalizer.prototype.localizeUpdatedText = function () {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    if (!node.textContent.trim() ||
                        node.parentElement?.tagName === 'SCRIPT' ||
                        node.parentElement?.tagName === 'STYLE') {
                        return NodeFilter.FILTER_REJECT;
                    }

                    const text = node.textContent.trim();

                    if (text === 'Updated' || text === 'Updated ') {
                        if (node.parentElement?.getAttribute('data-updated-localized') === 'true') {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }

                    return NodeFilter.FILTER_REJECT;
                }
            }
        );

        let node;
        const nodesToUpdate = [];

        while ((node = walker.nextNode())) {
            const trimmedText = node.textContent.trim();
            if (trimmedText === 'Updated' || trimmedText === 'Updated ') {
                if (node.parentElement?.getAttribute('data-updated-localized') === 'true') {
                    continue;
                }
                nodesToUpdate.push(node);
            }
        }

        const resolveUpdatedTranslation = (parentElement) => {
            const fallback = this.getTranslation('pr-updated', 'Updated');
            if (!parentElement) {
                return fallback;
            }

            const container = parentElement.closest('.ItemContainer-module__contents--EBVbu');
            if (container) {
                if (container.querySelector('.octicon-issue-opened')) {
                    return this.getTranslation('issue-updated', fallback);
                }
                if (container.querySelector('.octicon-git-pull-request, .octicon-git-pull-request-draft')) {
                    return this.getTranslation('pr-updated', fallback);
                }
            }

            return this.getTranslation('pr-updated', fallback);
        };

        nodesToUpdate.forEach(node => {
            const parent = node.parentElement;

            if (!parent) {
                const translationText = resolveUpdatedTranslation(null);
                node.textContent = `${translationText} `;
                return;
            }

            const protectObserver = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'characterData' || mutation.type === 'childList') {
                        const walker = document.createTreeWalker(
                            parent,
                            NodeFilter.SHOW_TEXT,
                            null
                        );
                        let textNode;
                        while ((textNode = walker.nextNode())) {
                            const text = textNode.textContent.trim();
                            if (text === 'Updated' || text === 'Updated ') {
                                const translationText = resolveUpdatedTranslation(parent);
                                console.warn(`${LOG_PREFIX} Restored English "Updated" text detected. Reapplying translation.`);
                                textNode.textContent = `${translationText} `;
                            }
                        }
                    }
                });
            });

            protectObserver.observe(parent, {
                characterData: true,
                childList: true,
                subtree: true
            });

            const translationText = resolveUpdatedTranslation(parent);

            node.textContent = `${translationText} `;
            parent.setAttribute('data-updated-localized', 'true');
        });
    };

})();
