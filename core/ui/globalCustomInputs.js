export const customInputs = {}
export const customIcons = {}

export function setCustomInputs (newCustomInputs = {}) {
  Object.assign(customInputs, newCustomInputs)
}

export function setCustomIcons (newCustomIcons = {}) {
  Object.assign(customIcons, newCustomIcons)
}