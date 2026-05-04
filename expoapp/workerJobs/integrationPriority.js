export default async function integrationPriority (data) {
  return {
    queue: 'priority',
    data
  }
}

export const worker = 'priority'
