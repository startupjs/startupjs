export default async function integrationCronDefault (data) {
  return data
}

export const cron = {
  pattern: '*/10 * * * * *',
  data: { source: 'integrationCronDefault' }
}
