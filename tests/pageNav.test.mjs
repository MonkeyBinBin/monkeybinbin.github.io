import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pageNavPath = path.resolve(__dirname, '../components/PageNav/index.vue');
const pageNavContent = fs.readFileSync(pageNavPath, 'utf-8');

describe('components/PageNav/index.vue', () => {
  it('導覽選單 icon 統一使用 Font Awesome 元件', () => {
    const navIconMatches = pageNavContent.match(/<font-awesome-icon class="nav-icon"/g) || [];
    expect(navIconMatches).toHaveLength(5);
    expect(pageNavContent).not.toContain('class="icon"');
    expect(pageNavContent).not.toContain('class="icon-svg"');
  });
});
