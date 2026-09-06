import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

test('the mockup renders four percentage bars while preserving the Stats layout', async () => {
  const source = await readFile(new URL('../directions.js', import.meta.url), 'utf8');
  const stats = source.split(/\r?\n/).find(line => line.startsWith('function stats()'));
  assert.ok(stats);
  const html = vm.runInNewContext(`${stats}; stats()`, {
    statsHeader: () => '<header>My Stats / Head-to-Head</header>',
    todayStrip: () => '<button>Today</button>',
  });
  assert.equal((html.match(/class="first-color-row"/g) || []).length, 4);
  for (const value of ['28.2', '24.2', '16.9', '30.6']) {
    assert.ok(html.includes(`width:${value}%`));
    assert.ok(html.includes(`<strong>${value}%</strong>`));
  }
  assert.match(html, /All-time highlights/);
  assert.match(html, /Last ten games/);
  assert.match(html, /role="img" aria-label="First group solved/);
  const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(index, /first-color-chart\.css\?v=12/);
});
