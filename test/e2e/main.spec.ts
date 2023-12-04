import { test, expect } from '@playwright/test'

test('On page present init code', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.goto('http://localhost:3000/docs')
  await page.goto('http://localhost:3000/docs/tutorial/Quickstart')
  await expect(page.getByText('StartupJS is a cross-platform')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Creating a new project' })).toBeVisible()
  await expect(page.locator('#app')).toContainText('npx startupjs init myapp')
})

test('Sidebar navigate is working', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.goto('http://localhost:3000/docs')
  await page.goto('http://localhost:3000/docs/tutorial/Quickstart')
  await expect(page.getByText('StartupJS is a cross-platform')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Creating a new project' })).toBeVisible()
  await expect(page.locator('#app')).toContainText('npx startupjs init myapp')
  await page.getByRole('button', { name: 'Components' }).click()
  await page.getByRole('link', { name: 'Button' }).click()
  await expect(page.getByRole('heading', { name: 'Button', exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Modal' }).click()
  await expect(page.locator('h2')).toBeVisible()
  await page.getByRole('button', { name: 'Forms' }).click()
  await page.getByRole('link', { name: 'ObjectInput' }).click()
  await expect(page.getByRole('heading', { name: 'ObjectInput' })).toBeVisible()
  await page.getByRole('link', { name: 'Rank' }).click()
  await expect(page.getByRole('heading', { name: 'Rank' })).toBeVisible()
})
