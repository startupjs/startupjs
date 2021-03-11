const { goTo } = require('./helpers')

beforeEach(async () => {
  await goTo.run()
})

goTo.changeComponent('Button')
require('@startupjs/ui/components/Button/tests/Button.e2e.cjs')
