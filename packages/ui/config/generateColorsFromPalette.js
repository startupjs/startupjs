const hexToRGBA = require('./hexToRGBA')

module.exports = function generateColorsFromPalette (pallete) {
  if (!pallete) return {}

  return {
    mainText: pallete.black,
    secondaryText: hexToRGBA(pallete.black, 0.5),

    white: pallete.white,
    whiteLight: hexToRGBA(pallete.white, 0.5),
    whiteLighter: hexToRGBA(pallete.white, 0.25),
    whiteLightest: hexToRGBA(pallete.white, 0.05),

    dark: pallete.black,
    darkLight: hexToRGBA(pallete.black, 0.5),
    darkLighter: hexToRGBA(pallete.black, 0.25),
    darkLightest: hexToRGBA(pallete.black, 0.05),

    primary: pallete.blue,
    primaryLight: hexToRGBA(pallete.blue, 0.5),
    primaryLighter: hexToRGBA(pallete.blue, 0.25),
    primaryLightest: hexToRGBA(pallete.blue, 0.05),

    secondary: pallete.violet,
    secondaryLight: hexToRGBA(pallete.violet, 0.5),
    secondaryLighter: hexToRGBA(pallete.violet, 0.25),
    secondaryLightest: hexToRGBA(pallete.violet, 0.05),

    success: pallete.green,
    successLight: hexToRGBA(pallete.green, 0.5),
    successLighter: hexToRGBA(pallete.green, 0.25),
    successLightest: hexToRGBA(pallete.green, 0.05),

    warning: pallete.yellow,
    warningLight: hexToRGBA(pallete.yellow, 0.5),
    warningLighter: hexToRGBA(pallete.yellow, 0.25),
    warningLightest: hexToRGBA(pallete.yellow, 0.05),

    attention: pallete.red,
    attentionLight: hexToRGBA(pallete.red, 0.5),
    attentionLighter: hexToRGBA(pallete.red, 0.25),
    attentionLightest: hexToRGBA(pallete.red, 0.05),

    additional0: pallete.orange,
    additional0Light: hexToRGBA(pallete.orange, 0.5),
    additional0Lighter: hexToRGBA(pallete.orange, 0.25),
    additional0Lightest: hexToRGBA(pallete.orange, 0.05),

    additional1: pallete.cyan,
    additional1Light: hexToRGBA(pallete.cyan, 0.5),
    additional1Lighter: hexToRGBA(pallete.cyan, 0.25),
    additional1Lightest: hexToRGBA(pallete.cyan, 0.05),

    additional2: pallete.purple,
    additional2Light: hexToRGBA(pallete.purple, 0.5),
    additional2Lighter: hexToRGBA(pallete.purple, 0.25),
    additional2Lightest: hexToRGBA(pallete.purple, 0.05),

    additional3: pallete.lime,
    additional3Light: hexToRGBA(pallete.lime, 0.5),
    additional3Lighter: hexToRGBA(pallete.lime, 0.25),
    additional3Lightest: hexToRGBA(pallete.lime, 0.05),

    additional4: pallete.ochre,
    additional4Light: hexToRGBA(pallete.ochre, 0.5),
    additional4Lighter: hexToRGBA(pallete.ochre, 0.25),
    additional4Lightest: hexToRGBA(pallete.ochre, 0.05)
  }
}
