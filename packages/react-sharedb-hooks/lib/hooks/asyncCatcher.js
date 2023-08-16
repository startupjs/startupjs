let isAsync
export const resetCatcher = () => (isAsync = false)
export const getAsync = () => isAsync
export const markAsync = () => (isAsync = true)
