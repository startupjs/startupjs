const colorToRGBA = require('./colorToRGBA')

module.exports = function generateColorsFromPalette (pallete) {
  if (!pallete) return {}

  return {
    mainText: pallete.black,
    secondaryText: colorToRGBA(pallete.black, 0.5),

    white: pallete.white,
    whiteLight: colorToRGBA(pallete.white, 0.5),
    whiteLighter: colorToRGBA(pallete.white, 0.25),
    whiteLightest: colorToRGBA(pallete.white, 0.05),

    dark: pallete.black,
    darkLight: colorToRGBA(pallete.black, 0.5),
    darkLighter: colorToRGBA(pallete.black, 0.25),
    darkLightest: colorToRGBA(pallete.black, 0.05),

    primary: pallete.blue,
    primaryLight: colorToRGBA(pallete.blue, 0.5),
    primaryLighter: colorToRGBA(pallete.blue, 0.25),
    primaryLightest: colorToRGBA(pallete.blue, 0.05),

    secondary: pallete.violet,
    secondaryLight: colorToRGBA(pallete.violet, 0.5),
    secondaryLighter: colorToRGBA(pallete.violet, 0.25),
    secondaryLightest: colorToRGBA(pallete.violet, 0.05),

    success: pallete.green,
    successLight: colorToRGBA(pallete.green, 0.5),
    successLighter: colorToRGBA(pallete.green, 0.25),
    successLightest: colorToRGBA(pallete.green, 0.05),

    warning: pallete.yellow,
    warningLight: colorToRGBA(pallete.yellow, 0.5),
    warningLighter: colorToRGBA(pallete.yellow, 0.25),
    warningLightest: colorToRGBA(pallete.yellow, 0.05),

    error: pallete.red,
    errorLight: colorToRGBA(pallete.red, 0.5),
    errorLighter: colorToRGBA(pallete.red, 0.25),
    errorLightest: colorToRGBA(pallete.red, 0.05),

    attention: pallete.red,
    attentionLight: colorToRGBA(pallete.red, 0.5),
    attentionLighter: colorToRGBA(pallete.red, 0.25),
    attentionLightest: colorToRGBA(pallete.red, 0.05),

    additional0: pallete.orange,
    additional0Light: colorToRGBA(pallete.orange, 0.5),
    additional0Lighter: colorToRGBA(pallete.orange, 0.25),
    additional0Lightest: colorToRGBA(pallete.orange, 0.05),

    additional1: pallete.cyan,
    additional1Light: colorToRGBA(pallete.cyan, 0.5),
    additional1Lighter: colorToRGBA(pallete.cyan, 0.25),
    additional1Lightest: colorToRGBA(pallete.cyan, 0.05),

    additional2: pallete.purple,
    additional2Light: colorToRGBA(pallete.purple, 0.5),
    additional2Lighter: colorToRGBA(pallete.purple, 0.25),
    additional2Lightest: colorToRGBA(pallete.purple, 0.05),

    additional3: pallete.lime,
    additional3Light: colorToRGBA(pallete.lime, 0.5),
    additional3Lighter: colorToRGBA(pallete.lime, 0.25),
    additional3Lightest: colorToRGBA(pallete.lime, 0.05),

    additional4: pallete.ochre,
    additional4Light: colorToRGBA(pallete.ochre, 0.5),
    additional4Lighter: colorToRGBA(pallete.ochre, 0.25),
    additional4Lightest: colorToRGBA(pallete.ochre, 0.05)
  }
}
