import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse as parseSfc } from '@vue/compiler-sfc';
import { baseParse, NodeTypes } from '@vue/compiler-dom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pageNavPath = path.resolve(__dirname, '../components/PageNav/index.vue');
const pageNavContent = fs.readFileSync(pageNavPath, 'utf-8');
const { descriptor } = parseSfc(pageNavContent);
const templateContent = descriptor.template?.content || '';
const templateAst = baseParse(templateContent);

const hasClass = (node, className) =>
  node.props?.some(
    (prop) =>
      prop.type === NodeTypes.ATTRIBUTE &&
      prop.name === 'class' &&
      prop.value?.content.split(/\s+/).includes(className)
  );

const findElements = (node, predicate) => {
  const matches = [];

  if (node.type === NodeTypes.ELEMENT && predicate(node)) {
    matches.push(node);
  }

  if (node.children) {
    for (const child of node.children) {
      matches.push(...findElements(child, predicate));
    }
  }

  return matches;
};

describe('components/PageNav/index.vue', () => {
  it('導覽選單 icon 統一使用 Font Awesome 元件', () => {
    const navIcons = findElements(
      templateAst,
      (node) => node.tag === 'font-awesome-icon' && hasClass(node, 'nav-icon')
    );
    const legacyTextIcons = findElements(
      templateAst,
      (node) => node.tag === 'span' && hasClass(node, 'icon')
    );
    const legacySvgIcons = findElements(
      templateAst,
      (node) => node.tag === 'svg' && hasClass(node, 'icon-svg')
    );

    expect(navIcons).toHaveLength(5);
    expect(legacyTextIcons).toHaveLength(0);
    expect(legacySvgIcons).toHaveLength(0);
  });
});
