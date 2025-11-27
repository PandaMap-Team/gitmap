// src/copilot.js
(function () {
    'use strict';

    const LOG_PREFIX = window.GITMAP_LOG_PREFIX || '[GitMap]';

    if (!window.GitHubLocalizer) {
        console.warn(`${LOG_PREFIX} GitHubLocalizer is not defined. copilot.js skipped.`);
        return;
    }

    /**
     * локализация элементов Копайлота и части левой боковой панели
     */
    GitHubLocalizer.prototype.localizeCopilotChatAndLeftBarPart = function () {
        // textarea placeholder и aria-label
        const chatTextarea = document.querySelector('#copilot-chat-textarea');
        if (chatTextarea) {
            const translation = this.getTranslation('ask-anything');
            if (translation) {
                const currentPlaceholder = chatTextarea.getAttribute('placeholder');
                if (currentPlaceholder !== translation) {
                    chatTextarea.setAttribute('placeholder', translation);
                    chatTextarea.setAttribute('aria-label', translation);
                    chatTextarea.setAttribute('data-ru-localized', 'true');
                }
            }
        }

        // «Top repositories»
        const topReposElements = document.querySelectorAll('div');
        topReposElements.forEach(el => {
            if (el.textContent.trim() === 'Top repositories') {
                this.localizeByText(el, 'Top repositories', 'top-repositories');
            }
        });

        // поле ввода «Search for repositories»
        const repoSearchInputs = document.querySelectorAll('input[aria-label="Search for repositories"], input[placeholder="Search for repositories"]');
        if (repoSearchInputs.length) {
            const placeholderTranslation = this.getTranslation('search-for-repositories');
            if (placeholderTranslation) {
                repoSearchInputs.forEach(input => {
                    if (input.getAttribute('placeholder') !== placeholderTranslation) {
                        input.setAttribute('placeholder', placeholderTranslation);
                    }
                    if (input.getAttribute('aria-label') !== placeholderTranslation) {
                        input.setAttribute('aria-label', placeholderTranslation);
                    }
                    input.setAttribute('data-ru-localized', 'true');
                });
            }
        }

        // «Add repositories, files, and spaces»
        const attachmentButtons = document.querySelectorAll('.ChatInput-module__attachmentButtonText--fVuEs');
        attachmentButtons.forEach(button => {
            this.localizeByText(button, 'Add repositories, files, and spaces', 'add-repositories-files-spaces');
        });
    };

    /**
     * локализация меток и статусов
     */
    GitHubLocalizer.prototype.localizeLabelsStatusesAndLinks = function () {
        // метка о предварительной версии
        const previewLabels = document.querySelectorAll('.prc-Label-Label--LG6X[data-size="small"][data-variant="success"]');
        previewLabels.forEach(label => {
            this.localizeByText(label, 'Preview', 'preview');
        });

        // метка New («Новинка»)
        const newLabels = document.querySelectorAll('.prc-Label-Label--LG6X[data-size="small"][data-variant="accent"]');
        newLabels.forEach(label => {
            this.localizeByText(label, 'New', 'new');
        });

        // метка Free («Бесплатно»)
        const freeLabels = document.querySelectorAll('.prc-Label-Label--LG6X[data-size="small"][data-variant="primary"]');
        freeLabels.forEach(label => {
            this.localizeByText(label, 'Free', 'free');
        });

        // ссылка обратной связи
        const feedbackLinks = document.querySelectorAll('a.CopilotHeaderBase-module__feedbackLink--fnf2R');
        feedbackLinks.forEach(link => {
            this.localizeByText(link, 'Feedback', 'feedback');
        });
    };

    /**
     * локализация элементов CommandPill (команды)
     */
    GitHubLocalizer.prototype.localizeCommandPills = function () {
        const commandTranslations = [
            { text: 'Task', key: 'task' },
            { text: 'Create issue', key: 'create-issue' },
            { text: 'Spark', key: 'spark' }
        ];

        const commandPills = document.querySelectorAll('.CommandPill-module__text--ggGhT');
        commandPills.forEach(pill => {
            commandTranslations.forEach(({ text, key }) => {
                this.localizeByText(pill, text, key);
            });
        });
    };

    /**
     * локализация элементов в поиске и меню (Copilot / search)
     */
    GitHubLocalizer.prototype.localizeCopilotSearchElements = function () {
        // заголовки разделов
        const sectionTranslations = new Map([
            ['Copilot', 'copilot'],
            ['Owners', 'owners'],
            ['Repositories', 'repositories'],
            ['Agents', 'agents']
        ]);

        const sectionTitles = document.querySelectorAll('.ActionList-sectionDivider-title');
        sectionTitles.forEach(title => {
            const text = title.textContent.trim();
            const translationKey = sectionTranslations.get(text);
            if (translationKey) {
                this.localizeByText(title, text, translationKey);
            }
        });

        // «Chat with Copilot»
        const copilotLabels = document.querySelectorAll('.ActionListItem-label');
        copilotLabels.forEach(label => {
            this.localizeByText(label, 'Chat with Copilot', 'chat-with-copilot');
        });

        // «Start a new Copilot thread»
        const copilotDescriptions = document.querySelectorAll('.ActionListItem-description.QueryBuilder-ListItem-trailing');
        copilotDescriptions.forEach(desc => {
            this.localizeByText(desc, 'Start a new Copilot thread', 'start-copilot-thread');
        });

        // «Jump to»
        const jumpToDescriptions = document.querySelectorAll('.ActionListItem-description.QueryBuilder-ListItem-trailing');
        jumpToDescriptions.forEach(desc => {
            this.localizeByText(desc, 'Jump to', 'jump-to');
        });
    };

    /**
     * локализация подсказок с шаблоном «Branch: <name>»
     */
    GitHubLocalizer.prototype.localizeBranchTooltips = function () {
        const tooltips = document.querySelectorAll('.prc-TooltipV2-Tooltip-cYMVY');
        tooltips.forEach(tooltip => {
            const text = tooltip.textContent.trim();
            const branchMatch = text.match(/^Branch:\s+(.+)$/);
            if (branchMatch) {
                const branchName = branchMatch[1];
                const translation = this.getTranslation('branch');
                if (translation) {
                    tooltip.textContent = `${translation}: ${branchName}`;
                    console.log(`${LOG_PREFIX} Translated: "Branch: ${branchName}" → "${translation}: ${branchName}"`);
                }
            }
        });
    };

    /**
     * локализация заголовка «Agents» в панели
     */
    GitHubLocalizer.prototype.localizeAgentsHeader = function () {
        const headers = document.querySelectorAll('.GlobalCopilotOverlay-module__header--mBq7d h2.f5');
        headers.forEach(h2 => {
            this.localizeByText(h2, 'Agents', 'agents');
        });
    };

    /**
     * локализация палитры команд (Command Palette)
     */
    GitHubLocalizer.prototype.localizeCommandPalette = function () {
        // «Search or jump to...» в placeholder и input
        const searchInputs = document.querySelectorAll('input.typeahead-input[placeholder="Search or jump to..."]');
        searchInputs.forEach(input => {
            const translation = this.getTranslation('search-or-jump');
            if (translation) {
                input.setAttribute('placeholder', translation);
                console.log(`${LOG_PREFIX} Translated placeholder: "Search or jump to..." → "${translation}"`);
            }
        });

        const paletteInputs = document.querySelectorAll('command-palette-input[placeholder="Search or jump to..."]');
        paletteInputs.forEach(input => {
            const translation = this.getTranslation('search-or-jump');
            if (translation) {
                input.setAttribute('placeholder', translation);
                console.log(`${LOG_PREFIX} Translated command palette placeholder: "Search or jump to..." → "${translation}"`);
            }
        });

        const paletteModes = document.querySelectorAll('command-palette-mode[data-placeholder="Search or jump to..."]');
        paletteModes.forEach(mode => {
            const translation = this.getTranslation('search-or-jump');
            if (translation) {
                mode.setAttribute('data-placeholder', translation);
                console.log(`${LOG_PREFIX} Translated data-placeholder: "Search or jump to..." → "${translation}"`);
            }
        });

        // «Tip:»
        const tipLabels = document.querySelectorAll('span.text-bold');
        tipLabels.forEach(label => {
            this.localizeByText(label, 'Tip:', 'tip');
        });

        const hintConfigs = [
            {
                tokens: ['Type', '@', 'to search people and organizations'],
                translationKey: 'type-at-to-search',
                identifier: '@',
                logMessage: 'Type @ to search people...'
            },
            {
                tokens: ['Type', '?', 'for help and tips'],
                translationKey: 'type-question-for-help',
                identifier: '?',
                logMessage: 'Type ? for help...'
            },
            {
                tokens: ['Type', '#', 'to search issues'],
                translationKey: 'type-hash-to-issues',
                identifier: '#',
                logMessage: 'Type # to search issues'
            },
            {
                tokens: ['Type', '>', 'to activate command mode'],
                translationKey: 'type-gt-to-command',
                identifier: '>',
                logMessage: 'Type > to activate command mode'
            },
            {
                tokens: ['Type', '#', 'to search pull requests'],
                translationKey: 'type-hash-to-prs',
                identifier: '#',
                logMessage: 'Type # to search pull requests'
            }
        ];

        const localizeHintElement = (element, options = {}) => {
            if (!element || element.getAttribute('data-ru-localized') === 'true') return null;

            const text = element.textContent;
            if (!text) return null;

            for (const config of hintConfigs) {
                if (!config.tokens.every(token => text.includes(token))) continue;

                const kbdElement = element.querySelector('kbd.hx_kbd');
                if (!kbdElement || kbdElement.textContent.trim() !== config.identifier) continue;

                if (options.leadingNodes && options.leadingNodes.length > 0) {
                    const translation = this.getTranslation(config.translationKey);
                    if (!translation) continue;

                    const fragment = this.createFragmentFromKbdTranslation(
                        translation,
                        new Map([[config.identifier, kbdElement]])
                    );
                    if (!fragment) continue;

                    const nodes = [...options.leadingNodes];
                    if (options.insertSpaceAfterLeading !== false) {
                        nodes.push(document.createTextNode(options.spaceText ?? ' '));
                    }
                    nodes.push(fragment);

                    element.replaceChildren(...nodes);
                    element.setAttribute('data-ru-localized', 'true');
                } else {
                    const replaced = this.replaceContentWithKbdTranslation(
                        element,
                        config.translationKey,
                        new Map([[config.identifier, kbdElement]])
                    );
                    if (!replaced) continue;
                }

                return config.logMessage;
            }

            return null;
        };

        const helpHintDivs = document.querySelectorAll('command-palette-help div');
        helpHintDivs.forEach(div => {
            const message = localizeHintElement(div);
            if (message) {
                console.log(`${LOG_PREFIX} Translated: "${message}"`);
            }
        });

        const paletteTips = document.querySelectorAll('command-palette-tip');
        paletteTips.forEach(tip => {
            const flexContainer = tip.querySelector('.d-flex.flex-items-start.flex-justify-between');
            if (!flexContainer) return;

            const leftDiv = flexContainer.children[0];
            const rightDiv = flexContainer.children[1];

            if (rightDiv) {
                const message = localizeHintElement(rightDiv);
                if (message) {
                    console.log(`${LOG_PREFIX} Translated trailing part: "${message}"`);
                }
            }

            if (!leftDiv) return;
            const text = leftDiv.textContent;
            const boldSpan = leftDiv.querySelector('span.text-bold');

            if (text && text.includes('Go to your accessibility settings')) {
                const translation = this.getTranslation('go-to-accessibility-settings');
                if (translation && boldSpan) {
                    leftDiv.innerHTML = '';
                    leftDiv.appendChild(boldSpan);
                    leftDiv.appendChild(document.createTextNode(' ' + translation));
                    console.log(`${LOG_PREFIX} Translated: "Go to your accessibility settings..."`);
                }
            } else {
                const options = boldSpan ? { leadingNodes: [boldSpan] } : undefined;
                const message = localizeHintElement(leftDiv, options);
                if (message) {
                    console.log(`${LOG_PREFIX} Translated: "${message}"`);
                }
            }
        });

        // заголовки групп: Pages, Repositories, Users
        const groupHeaders = document.querySelectorAll('[data-target="command-palette-item-group.header"]');
        groupHeaders.forEach(header => {
            const text = header.textContent.trim();
            if (text === 'Pages') {
                this.localizeByText(header, 'Pages', 'pages');
            } else if (text === 'Repositories') {
                this.localizeByText(header, 'Repositories', 'repositories');
            } else if (text === 'Users') {
                this.localizeByText(header, 'Users', 'users');
            }
        });

        // заголовки элементов палитры команд
        const itemTitles = document.querySelectorAll('[data-target="command-palette-item.titleElement"]');
        itemTitles.forEach(title => {
            const text = title.textContent.trim();
            if (text === 'Copilot') {
                this.localizeByText(title, 'Copilot', 'copilot');
            } else if (text === 'Dashboard') {
                this.localizeByText(title, 'Dashboard', 'dashboard');
            } else if (text === 'Notifications') {
                this.localizeByText(title, 'Notifications', 'notifications');
            } else if (text === 'Issues') {
                this.localizeByText(title, 'Issues', 'issues');
            } else if (text === 'Pull requests') {
                this.localizeByText(title, 'Pull requests', 'pull-requests');
            }
        });

        // «Jump to»
        const hintTexts = document.querySelectorAll('[data-target="command-palette-item.hintText"]');
        hintTexts.forEach(hint => {
            const text = hint.textContent.trim();
            if (text === 'Jump to') {
                this.localizeByText(hint, 'Jump to', 'jump-to');
            }
        });

        // «Enter to jump to Tab to search»
        const enterTabHints = document.querySelectorAll('[data-target="command-palette-item.hintText"]');
        enterTabHints.forEach(hint => {
            const text = hint.textContent;
            if (text && text.includes('Enter') && text.includes('to jump to') && text.includes('Tab') && text.includes('to search')) {
                const innerDiv = hint.querySelector('.hide-sm');
                if (innerDiv) {
                    const kbds = innerDiv.querySelectorAll('kbd.hx_kbd');
                    if (kbds.length >= 2) {
                        const enterKbd = kbds[0];
                        const tabKbd = kbds[1];

                        const translation = this.getTranslation('enter-to-jump-tab-to-search');
                        if (translation) {
                            const enterClone = enterKbd.cloneNode(true);
                            const tabClone = tabKbd.cloneNode(true);
                            const fragment = this.createFragmentFromKbdTranslation(
                                translation,
                                new Map([
                                    [enterClone.textContent.trim(), enterClone],
                                    [tabClone.textContent.trim(), tabClone]
                                ])
                            );

                            if (fragment) {
                                innerDiv.replaceChildren(fragment);
                                innerDiv.setAttribute('data-ru-localized', 'true');
                                console.log(`${LOG_PREFIX} Translated: "Enter to jump to Tab to search" with preserved kbd`);
                            }
                        }
                    }
                }
            }
        });
    };

    /**
     * локализация агентской панели
     */
    GitHubLocalizer.prototype.localizeCopilotTaskScreen = function () {
        const taskHeadings = document.querySelectorAll('.GlobalCopilotOverlay-module__messageStateHeading--F5_1N');
        const taskErrorVariants = [
            'Tasks couldn\'t be loaded',
            'Tasks couldn’t be loaded'
        ];

        taskHeadings.forEach(heading => {
            this.localizeByText(heading, 'Start a new task with Copilot', 'start-new-task-copilot');
            taskErrorVariants.some(variant => this.localizeByText(heading, variant, 'tasks-couldnt-be-loaded'));
        });

        const taskDescriptions = document.querySelectorAll('.GlobalCopilotOverlay-module__messageStateDescription--IWyBI');
        taskDescriptions.forEach(desc => {
            this.localizeByText(
                desc,
                'Describe your task in natural language. Copilot will work in the background and open a pull request for your review.',
                'copilot-task-description'
            );
            this.localizeByText(desc, 'Try again or, if the problem persists, contact support.', 'try-again-or');
        });

        const learnMoreLinks = document.querySelectorAll('.GlobalCopilotOverlay-module__messageState--ORDxQ a.prc-Link-Link-85e08');
        learnMoreLinks.forEach(link => {
            this.localizeByText(link, 'Learn more about Copilot coding agent', 'learn-more-copilot-agent');
            this.localizeByText(link, 'GitHub status', 'github-status');
        });

        // уведомление «Copilot uses AI. Check for mistakes.» с сохранением ссылки
        const disclosureParagraphs = document.querySelectorAll('.GlobalCopilotOverlay-module__copilotDisclosureText--hPU0b');
        const disclosureTranslation = this.getTranslation('copilot-uses-ai');

        if (disclosureTranslation) {
            const disclosureParts = disclosureTranslation.split(/\[link\]|\[\/link\]/);
            const normalizedDisclosure = disclosureParts.join('').replace(/\s+/g, ' ').trim();
            const englishDisclosure = 'Copilot uses AI. Check for mistakes.'.replace(/\s+/g, ' ').trim();

            disclosureParagraphs.forEach(paragraph => {
                const link = paragraph.querySelector('a');
                if (!link) return;

                const currentText = paragraph.textContent.replace(/\s+/g, ' ').trim();
                if (currentText === normalizedDisclosure) {
                    if (paragraph.getAttribute('data-ru-localized') !== 'true') {
                        paragraph.setAttribute('data-ru-localized', 'true');
                    }
                    return;
                }

                if (currentText !== englishDisclosure && paragraph.getAttribute('data-ru-localized') === 'true') {
                    return;
                }

                if (disclosureParts.length < 3) {
                    return;
                }

                const prefix = disclosureParts[0] ?? '';
                const linkText = disclosureParts[1] ?? '';
                const suffix = disclosureParts.slice(2).join('');

                const fragment = document.createDocumentFragment();
                if (prefix) fragment.appendChild(document.createTextNode(prefix));
                link.textContent = linkText;
                fragment.appendChild(link);
                if (suffix) fragment.appendChild(document.createTextNode(suffix));

                paragraph.replaceChildren(fragment);
                paragraph.setAttribute('data-ru-localized', 'true');
            });
        }
    };

    /**
     * локализация сообщения об отсутствии сессий
     */
    GitHubLocalizer.prototype.localizeNoResultsMessages = function () {
        const noSessionsTranslation = this.getTranslation('no-sessions-found');
        const noSessionsParts = noSessionsTranslation ? noSessionsTranslation.split(/\[link\]|\[\/link\]/) : [];
        const noSessionsPrefix = noSessionsParts[0] ?? '';
        const noSessionsLinkText = noSessionsParts[1] ?? '';
        const noSessionsSuffix = noSessionsParts.slice(2).join('');
        const expectedTextNormalized = (noSessionsPrefix + noSessionsLinkText + noSessionsSuffix).replace(/\s+/g, ' ').trim();
        const expectedLinkTextNormalized = noSessionsLinkText.replace(/\s+/g, ' ').trim();
        const englishNormalized = 'No sessions found. Try a different filter, or start a session.'.replace(/\s+/g, ' ').trim();
        const englishLinkTextCandidates = [
            'start a session',
            'start a session.'
        ].map(text => text.replace(/\s+/g, ' ').trim());
        const unableToLoadTranslation = this.getTranslation('unable-to-load-agent');
        const unableEnglish = 'Unable to load agent tasks, try again later.'.replace(/\s+/g, ' ').trim();

        const titles = document.querySelectorAll('.Title-module__title--YTYH_');
        titles.forEach(title => {
            const link = title.querySelector('a');
            const currentTextNormalized = title.textContent.replace(/\s+/g, ' ').trim();

            if (!link) {
                if (!unableToLoadTranslation) return;

                const isAlreadyLocalized = currentTextNormalized === unableToLoadTranslation;
                if (isAlreadyLocalized) {
                    if (title.getAttribute('data-ru-localized') !== 'true') {
                        title.setAttribute('data-ru-localized', 'true');
                    }
                    return;
                }

                const matchesEnglish = currentTextNormalized === unableEnglish;
                if (!matchesEnglish) return;

                title.textContent = unableToLoadTranslation;
                title.setAttribute('data-ru-localized', 'true');
                return;
            }

            if (!noSessionsTranslation || noSessionsParts.length < 3) return;

            const currentLinkTextNormalized = link.textContent.replace(/\s+/g, ' ').trim();

            const alreadyLocalized = currentTextNormalized === expectedTextNormalized &&
                currentLinkTextNormalized === expectedLinkTextNormalized;
            if (alreadyLocalized) {
                if (title.getAttribute('data-ru-localized') !== 'true') {
                    title.setAttribute('data-ru-localized', 'true');
                }
                return;
            }

            const matchesEnglish = currentTextNormalized === englishNormalized &&
                englishLinkTextCandidates.includes(currentLinkTextNormalized);
            if (!matchesEnglish) return;

            const fragment = document.createDocumentFragment();
            fragment.appendChild(document.createTextNode(noSessionsPrefix));
            link.textContent = noSessionsLinkText;
            fragment.appendChild(link);
            fragment.appendChild(document.createTextNode(noSessionsSuffix));

            title.replaceChildren(fragment);
            title.setAttribute('data-ru-localized', 'true');
        });
    };

})();
