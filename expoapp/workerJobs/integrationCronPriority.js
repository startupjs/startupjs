export default async function integrationCronPriority (data) {
  return data
}

export const worker = 'priority'

export const cron = {
  pattern: '*/10 * * * * *',
  data: { source: 'integrationCronPriority' }
}
