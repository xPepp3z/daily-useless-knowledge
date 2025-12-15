# Daily Useless Knowledge 🧠

A modern, responsive React web application that delivers random, interesting, and ultimately "useless" facts to brighten your day.

> **✨ AI Generated Project:** This application was entirely designed, coded, and iterated upon using **Google AI Studio**.

## Features 🚀

*   **Bilingual Support:** Switch seamlessly between English 🇬🇧 and Italian 🇮🇹 (with automatic translation).
*   **History Navigation:** Missed a fact? Go back to previous facts or skip forward through your session history.
*   **Modern UI:** A clean, glassmorphism-inspired interface built with Tailwind CSS.
*   **Responsive Design:** Looks great on mobile, tablet, and desktop.
*   **Dark Mode Support:** Fully styled for both light and dark system themes.
*   **Sharing:** Copy facts to your clipboard or share them instantly.
*   **Source Linking:** Direct links to source URLs when available.

## Tech Stack 🛠️

*   **Frontend:** React 19, TypeScript
*   **Styling:** Tailwind CSS
*   **APIs:**
    *   [Useless Facts API](https://uselessfacts.jsph.pl) (Data source)
    *   [MyMemory API](https://mymemory.translated.net) (Translation)

## How It Works 🤖

The app fetches a random fact from the Useless Facts API. If Italian is selected, it routes the English text through the MyMemory Translation API to provide a localized experience, maintaining a history buffer so you can navigate back and forth through your session.

## Credits

*   Created with [Google AI Studio](https://aistudio.google.com/)
*   Developed by [Giuseppe Gravagno]
