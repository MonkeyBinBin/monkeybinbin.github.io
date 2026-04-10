import { describe, it, expect, afterEach } from 'vitest';
import config from '../config/index.mjs';
import constant from '../constant/index.js';
import pathHelper from '../helpers/path.js';

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
