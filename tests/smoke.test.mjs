import { describe, it, expect, afterEach } from 'vitest';
import config from '../config/index.mjs';
import constant from '../constant/index.js';
import pathHelper from '../helpers/path.js';
import { generateSitemap } from '../scripts/generateSitemap.mjs';
import fs from 'fs';
import os from 'os';
import path from 'path';

describe('config/index.mjs', () => {
  it('匯出 Contentful 公開識別值', () => {
    expect(typeof config.CTF_SPACE_ID).toBe('string');
    expect(config.CTF_SPACE_ID.length).toBeGreaterThan(0);
    expect(config.CTF_BLOG_POST_TYPE_ID).toBe('post');
  });

  it('匯出站台基本 metadata', () => {
    expect(typeof config.title).toBe('string');
    expect(typeof config.description).toBe('string');
    expect(config.domain).toMatch(/^https?:\/\//);
  });

  // 防止未來誤把敏感 token 寫回 config/index.mjs
  it('不得暴露 CTF_CDA_ACCESS_TOKEN', () => {
    expect(Object.keys(config)).not.toContain('CTF_CDA_ACCESS_TOKEN');
  });
});

describe('constant/index.js', () => {
  it('months 陣列包含 12 個月份名稱', () => {
    expect(constant.months).toHaveLength(12);
    expect(constant.months[0]).toBe('January');
    expect(constant.months[11]).toBe('December');
  });
});

describe('helpers/path.js', () => {
  const originalBaseUrl = process.env.baseUrl;

  afterEach(() => {
    if (originalBaseUrl === undefined) {
      delete process.env.baseUrl;
    } else {
      process.env.baseUrl = originalBaseUrl;
    }
  });

  it('未設定 baseUrl 環境變數時回傳根路徑', () => {
    delete process.env.baseUrl;
    expect(pathHelper.resolveBaseUrl()).toBe('/');
  });

  it('設定 baseUrl 環境變數時回傳對應值', () => {
    process.env.baseUrl = '/blog/';
    expect(pathHelper.resolveBaseUrl()).toBe('/blog/');
  });
});

describe('scripts/generateSitemap.mjs - generate-routes.json 驗證', () => {
  it('JSON 內容為非陣列時回退到空動態路由（僅產生靜態頁面）', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sitemap-test-'));
    try {
      const scriptsDir = path.join(tmpDir, 'scripts');
      const distDir = path.join(tmpDir, 'dist');
      fs.mkdirSync(scriptsDir, { recursive: true });
      fs.mkdirSync(distDir, { recursive: true });

      fs.writeFileSync(path.join(scriptsDir, 'generate-routes.json'), JSON.stringify({ routes: ['/article/1'] }));

      generateSitemap(distDir, []);

      const sitemap = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf-8');
      expect(sitemap).toContain('<loc>');
      expect(sitemap).not.toContain('/article/1');
    } finally {
      fs.rmSync(tmpDir, { recursive: true });
    }
  });

  it('JSON 陣列中混入非字串或無效路徑時過濾掉', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sitemap-test-'));
    try {
      const scriptsDir = path.join(tmpDir, 'scripts');
      const distDir = path.join(tmpDir, 'dist');
      fs.mkdirSync(scriptsDir, { recursive: true });
      fs.mkdirSync(distDir, { recursive: true });

      const badRoutes = [
        '/article/valid-id',
        42,
        null,
        '',
        '/article/[object Object]',
        '/tag/undefined',
      ];
      fs.writeFileSync(path.join(scriptsDir, 'generate-routes.json'), JSON.stringify(badRoutes));

      generateSitemap(distDir, []);

      const sitemap = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf-8');
      expect(sitemap).toContain('/article/valid-id');
      expect(sitemap).not.toContain('[object Object]');
      expect(sitemap).not.toContain('/tag/undefined');
    } finally {
      fs.rmSync(tmpDir, { recursive: true });
    }
  });
});
