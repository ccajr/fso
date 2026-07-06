const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByText('login').click()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Testing Blog API', 'Mark Markkanen', 'https://testurl.com/')
      await expect(page.getByRole('link', { name: 'Testing Blog API by Mark' })).toBeVisible()
    })

    describe('and several blogs exists', () => {
      beforeEach(async ({ page, request }) => {
        await createBlog(page, 'Existing Blog', 'Mark Markkanen', 'https://testurl.com/')
        await request.post('/api/users', {
          data: {
            name: 'Other User',
            username: 'otheruser',
            password: 'secret'
          }
        })
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'otheruser', 'secret')
        await createBlog(page, 'Some Other Blog', 'Another Person', 'https://othertesturl.com/')
        await page.getByRole('link', { name: 'blogs' }).click()
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('link', { name: 'Existing Blog by Mark Markkanen' }).click()
        await expect(page.getByText('likes 0')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('a blog can only be deleted by the user who added it', async ({ page }) => {
        await page.getByRole('link', { name: 'Some Other Blog by Another Person' }).click()
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()
        await page.getByRole('link', { name: 'Existing Blog by Mark Markkanen' }).waitFor()
        await expect(page.getByRole('link', { name: 'Some Other Blog by Another Person' })).not.toBeVisible()
      })

      test('a blog\'s remove button can only be seen by the user who added it', async ({ page }) => {
        await page.getByRole('link', { name: 'Existing Blog by Mark Markkanen' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      // This test is skipped as per exercise 5.28
      test.skip('blogs are displayed in descending order of likes', async ({ page }) => {
        await createBlog(page, 'Third Blog', 'Third Person', 'https://thirdtesturl.com/')
        const blog1 = page.getByText('Existing Blog Mark Markkanen')
        const blog2 = page.getByText('Some Other Blog Another Person')
        const blog3 = page.getByText('Third Blog Third Person')

        await blog1.getByRole('button', { name: 'view' }).click()
        await blog2.getByRole('button', { name: 'view' }).click()
        await blog3.getByRole('button', { name: 'view' }).click()

        // Expect blog2 to be displayed at the top
        await blog2.getByRole('button', { name: 'like' }).click()
        await expect(blog2.getByText('likes 1')).toBeVisible()
        await expect(page.getByRole('button', { name: 'like' }).first().locator('..').getByText('likes 1')).toBeVisible()
        await expect(page.getByRole('button', { name: 'like' }).nth(1).locator('..').getByText('likes 0')).toBeVisible()
        await expect(page.getByRole('button', { name: 'like' }).nth(2).locator('..').getByText('likes 0')).toBeVisible()

        // Expect blog3 to be displayed at the top, followed by blog2 and blog1
        await blog3.getByRole('button', { name: 'like' }).click()
        await blog3.getByText('likes 1').waitFor()
        await blog3.getByRole('button', { name: 'like' }).click()
        await expect(blog3.getByText('likes 2')).toBeVisible()
        await expect(blog1.getByText('likes 0')).toBeVisible()
        await expect(page.getByRole('button', { name: 'like' }).first().locator('..').getByText('likes 2')).toBeVisible()
        await expect(page.getByRole('button', { name: 'like' }).nth(1).locator('..').getByText('likes 1')).toBeVisible()
        await expect(page.getByRole('button', { name: 'like' }).nth(2).locator('..').getByText('likes 0')).toBeVisible()
      })
    })
  })
})
