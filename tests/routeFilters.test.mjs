import { describe, it, expect } from 'vitest';
import { filterValidRoutes } from '../scripts/routeFilters.mjs';

describe('filterValidRoutes', () => {
  it('非陣列輸入回傳空陣列', () => {
    expect(filterValidRoutes(undefined)).toEqual([]);
    expect(filterValidRoutes(null)).toEqual([]);
    expect(filterValidRoutes('/article/1')).toEqual([]);
    expect(filterValidRoutes({ 0: '/a' })).toEqual([]);
  });

  it('濾掉非字串、空字串與物件殘留', () => {
    const input = [
      '/',
      '/article/abc',
      '',
      null,
      undefined,
      123,
      { foo: 'bar' },
      '/tag/[object Object]',
      '/article/undefined',
      '/archives',
    ];
    expect(filterValidRoutes(input)).toEqual(['/', '/article/abc', '/archives']);
  });

  it('全部無效時回傳空陣列', () => {
    expect(filterValidRoutes([null, '', undefined, '/x/[object Object]'])).toEqual([]);
  });

  it('全部有效時原樣保留順序', () => {
    const input = ['/', '/page/2', '/tag/vue', '/article/xyz'];
    expect(filterValidRoutes(input)).toEqual(input);
  });
});
