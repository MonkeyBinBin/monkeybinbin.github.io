import { defineNuxtPlugin } from '#app';
import highlightjs from 'highlight.js';
import { marked, Renderer } from 'marked';
import pathHelper from '~/helpers/path';
import moment from 'moment';

export default defineNuxtPlugin((nuxtApp) => {
  // Create your custom renderer.
  const renderer = new Renderer();
  renderer.link = (href, title, text) =>
    `<a target="_blank" href="${href}" title="${title}">${text}</a>`;
  renderer.table = (header, body) => `<table class="table table-striped">${header}${body}</table>`;

  // Set the renderer to marked.
  marked.setOptions({
    renderer,
    baseUrl: pathHelper.getBaseUrl(),
    highlight: function (code, language) {
      // Check whether the given language is valid for highlight.js.
      const validLang = !!(language && highlightjs.getLanguage(language));
      // Highlight only if the language is valid.
      const highlighted = validLang ? highlightjs.highlight(language, code).value : code;
      // Render the highlighted code with `hljs` class.
      return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
    },
  });

  nuxtApp.vueApp.config.globalProperties.$filters = {
    parseMd: marked,
    parseDatetime: function (datetime) {
      const parseDate = moment(datetime, 'YYYY-MM-DD');
      return parseDate.format('LL');
    },
  };
});
