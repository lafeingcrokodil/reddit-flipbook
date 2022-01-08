import DOMPurify from 'dompurify';
import { decode } from 'html-entities';

const sanitizeOpts = {
  ADD_TAGS: ['iframe'],
  ADD_ATTR: ['frameborder', 'allowfullscreen']
};

export function sanitize(html = '', debug = false): string {
  const decodedHTML = decode(html);
  const sanitizedHTML = DOMPurify.sanitize(decodedHTML, sanitizeOpts);
  if (debug) {
    console.log(`Before sanitizing: ${html}`);
    console.log(`After sanitizing: ${sanitizedHTML}`);
  }
  return sanitizedHTML;
}

export function strip(html = ''): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.innerText;
}
