import Vue from 'vue'
import highlightjs from 'highlight.js'
import marked, { Renderer } from 'marked'
import moment from 'moment'
import pathHelper from '~/helpers/path'

// Create your custom renderer.
const renderer = new Renderer()
renderer.code = (code, language) => {
  // Check whether the given language is valid for highlight.js.
  const validLang = !!(language && highlightjs.getLanguage(language))
  // Highlight only if the language is valid.
  const highlighted = validLang ? highlightjs.highlight(language, code).value : code
  // Render the highlighted code with `hljs` class.
  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`
}

// Set the renderer to marked.
marked.setOptions({ renderer, baseUrl: pathHelper.getBaseUrl() })

Vue.filter('parseMd', function (content) {
  return marked(content)
})

Vue.filter('parseDatetime', function (datetime) {
  const parseDate = moment(datetime, 'YYYY-MM-DD')
  return parseDate.format('LL')
})
