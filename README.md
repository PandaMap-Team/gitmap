# GitMap — русификация GitHub

GitMap — это пользовательский скрипт для Tampermonkey, который локализует интерфейс GitHub на русский язык: шапку, репозитории, Copilot, относительное время, тултипы и кучу мелких подписей.

Скрипт ставится один раз и тихо обновляется вместе с репозиторием.

---

## Возможности

- Перевод основных элементов интерфейса:
  - верхнее меню, Dashboard
  - вкладки репозитория (Code, Issues, Pull requests, Actions и т.д.)
  - тултипы (Command palette, Chat with Copilot, Create new… и пр.)
  - панели Copilot / agents
  - подвал (footer), ссылки, cookie-диалоги
- Перевод относительного времени (`relative-time`) и всплывающих дат:
  - `Updated`, `Created on`, `Opened by`
  - всплывающий `title` у дат (формат под русскую локаль)
- Защита переведённых элементов от отката обратно на английский:
  - если GitHub переписал DOM, скрипт возвращает русский текст
- Хранение переводов в отдельном Fluent-файле `locales/ru.ftl`

---

## Как это работает

Скрипт разбит на две части:

1. **Загрузчик**: `GitMap.user.js`
   - это маленький userscript, который:
     - подключает модули из репозитория через `@require`
     - скачивает файл локализации `ru.ftl`
     - создаёт экземпляр `GitHubLocalizer`
     - запускает локализацию и ставит `MutationObserver` на изменения DOM

2. **Модули логики** в папке `scr/`:
   - `scr/core.js` — парсер FTL (`SimpleFTLParser`) и базовый класс `GitHubLocalizer`
   - `scr/dashboard.js` — всё, что связано с дашбордом, тултипами, поиском и т.п.
   - `scr/repo.js` — вкладки репозитория, сайдбар `About`, диалог редактирования метаданных
   - `scr/copilot.js` — панели Copilot, agent tasks, подсказки и команды
   - `scr/time.js` — относительное и абсолютное время, `Updated`, `Created on`, `Opened by`
   - `scr/footer.js` — подвал GitHub, ссылки, управление cookies

Все эти файлы подгружаются Tampermonkey автоматически с GitHub и выполняются в одном общем скоупе.

---

## Структура репозитория

```text
gitmap/
  GitMap.user.js          # главный userscript-загрузчик
  README.md               # это описание
  LICENSE                 # MIT

  locales/
    ru.ftl                # файл локализации в формате Fluent (FTL)

  scr/
    core.js               # SimpleFTLParser + базовый GitHubLocalizer
    dashboard.js          # локализация дашборда, тултипов, поиска и пр.
    repo.js               # вкладки репозитория, сайдбар About, метаданные
    copilot.js            # Copilot, агенты, подсказки, task screen
    time.js               # относительное/абсолютное время, Updated/Created
    footer.js             # footer и cookie preferences
