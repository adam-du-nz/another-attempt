import { useState, useEffect } from "react";
import sanitizeHTML from "sanitize-html";
import { marked } from "marked";

import defaultOptions from "./useMarkedDefaultOptions";
/**
 * A custom react hook for parsing markdown with marked and sanitize-html
 * @param {string} markdown - markdown string to be parsed
 * @param {Object} [options=defaultOptions] - options for markd & sanitize-htm
 * @returns {HTML}
 */
export const useMarked = (markdown, options = defaultOptions) => {
  const [html, setHtml] = useState(markdown);

  useEffect(() => {
    if (options.markedOptions) {
      marked.setOptions(options.markedOptions);
    }
    const tokens = marked.lexer(markdown);
    const parsedHtml = marked.parser(tokens);
    setHtml(
      options.skipSanitize
        ? parsedHtml
        : sanitizeHTML(parsedHtml, options.sanitizeOptions)
    );
  }, [markdown, options]);
  return html;
};
