const fs = require('fs')
const path = require('path')

it('Check if the translations.json is correct', async () => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 3000)
  })

  const filePath = path.join(__dirname, '../translations.json')
  const content = fs.readFileSync(filePath, { encoding: 'utf8' })
  expect(content).toMatchSnapshot()
})
