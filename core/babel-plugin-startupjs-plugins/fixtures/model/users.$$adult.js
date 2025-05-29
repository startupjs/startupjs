import { aggregation } from 'startupjs'

export default aggregation(({ adultAge = 21 }) => [
  {
    $match: {
      age: { $gte: adultAge }
    }
  }
])
