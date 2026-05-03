# Development Guidelines for Japanese Text

## Typography & Line Breaks
Japanese text can often break in unnatural places (e.g., in the middle of a word or phrase), especially on mobile. To ensure a high-quality user experience:

1. **Phrase-based Wrapping**: Wrap semantic chunks or phrases in `<span className="jp-phrase">` to prevent them from breaking internally.
   - Example: `<span className="jp-phrase">こんにちは、</span><span className="jp-phrase">世界。</span>`
2. **Text Balancing**: Use Tailwind's `text-balance` (for headings) or `text-pretty` (for paragraphs) to help the browser distribute text more evenly.
3. **CSS Utility**: Ensure `.jp-phrase` is defined in `index.css`:
   ```css
   .jp-phrase {
     display: inline-block;
     white-space: nowrap;
   }
   ```

Always apply these rules when adding or modifying Japanese text in this project.
