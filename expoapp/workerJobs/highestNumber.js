export default function highestNumber (numbers, { log }) {
  if (!Array.isArray(numbers)) {
    throw new Error('Input must be an array of numbers')
  }
  for (const num of numbers) {
    if (typeof num !== 'number') {
      throw new Error('All elements in the array must be numbers. Invalid element: ' + JSON.stringify(num))
    }
  }
  const result = Math.max(...numbers)
  log(`Highest number is ${result}`)
  return result
}
