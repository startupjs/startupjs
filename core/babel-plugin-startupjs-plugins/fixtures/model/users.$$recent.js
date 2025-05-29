import { aggregation } from 'startupjs'

export default aggregation(({ recentDays = 7 }) => {
  // from recentDays start of the day
  const start = new Date()
  start.setDate(start.getDate() - recentDays)
  start.setHours(0, 0, 0, 0)
  return [
    { $match: { createdAt: { $gte: start } } },
    { $sort: { createdAt: -1 } }
  ]
})
