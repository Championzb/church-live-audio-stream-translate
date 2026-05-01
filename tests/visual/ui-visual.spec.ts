import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { installVisualTauriMock } from './mock-tauri';

const gotoVisualMode = async (page: Page, mode: string) => {
  await page.goto(`/index.html?visualMode=${mode}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(installVisualTauriMock);
});

test('landing view stays stable', async ({ page }) => {
  await gotoVisualMode(page, 'landing');
  await expect(page.locator('#landingPage')).toBeVisible();
  await expect(page).toHaveScreenshot('landing.png', { fullPage: true, maxDiffPixelRatio: 0.015 });
});

test('main live view stays stable', async ({ page }) => {
  await gotoVisualMode(page, 'main');
  await expect(page.locator('#mainPage')).toBeVisible();
  await expect(page).toHaveScreenshot('main-live.png', { fullPage: true, maxDiffPixelRatio: 0.015 });
});

test('settings view stays stable', async ({ page }) => {
  await gotoVisualMode(page, 'main');
  await page.locator('#openSettingsPage').click();
  await page.waitForTimeout(200);
  await expect(page.locator('#settingsPage')).toBeVisible();
  await expect(page).toHaveScreenshot('settings.png', { fullPage: true, maxDiffPixelRatio: 0.015 });
});

test('translation mode view stays stable', async ({ page }) => {
  await gotoVisualMode(page, 'main');
  await page.locator('#hintF6').click();
  await page.waitForTimeout(200);
  await expect(page.locator('#translationLiveBar')).toBeVisible();
  const viewportWidth = page.viewportSize()?.width ?? 0;
  const maxDiffPixelRatio = viewportWidth <= 500 ? 0.035 : 0.015;
  await expect(page).toHaveScreenshot('translation-mode.png', { fullPage: true, maxDiffPixelRatio });
});
