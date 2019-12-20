module.exports = function generateColorsFromPalette (pallete) {
  return {
    white: `${pallete.white}`,
    whiteLight: `rgba(${pallete.white}, 0.5)`,
    whiteLighter: `rgba(${pallete.white}, 0.25)`,
    whiteLightest: `rgba(${pallete.white}, 0.05)`,

    dark: `${pallete.black}`,
    darkLight: `rgba(${pallete.black}, 0.5)`,
    darkLighter: `rgba(${pallete.black}, 0.25)`,
    darkLightest: `rgba(${pallete.black}, 0.05)`,

    primary: `${pallete.blue}`,
    primaryLight: `rgba(${pallete.blue}, 0.5)`,
    primaryLighter: `rgba(${pallete.blue}, 0.25)`,
    primaryLightest: `rgba(${pallete.blue}, 0.05)`,

    secondary: `${pallete.violet}`,
    secondaryLight: `rgba(${pallete.violet}, 0.5)`,
    secondaryLighter: `rgba(${pallete.violet}, 0.25)`,
    secondaryLightest: `rgba(${pallete.violet}, 0.05)`,

    success: `${pallete.green}`,
    successLight: `rgba(${pallete.green}, 0.5)`,
    successLighter: `rgba(${pallete.green}, 0.25)`,
    successLightest: `rgba(${pallete.green}, 0.05)`,

    warning: `${pallete.yellow}`,
    warningLight: `rgba(${pallete.yellow}, 0.5)`,
    warningLighter: `rgba(${pallete.yellow}, 0.25)`,
    warningLightest: `rgba(${pallete.yellow}, 0.05)`,

    attention: `${pallete.red}`,
    attentionLight: `rgba(${pallete.red}, 0.5)`,
    attentionLighter: `rgba(${pallete.red}, 0.25)`,
    attentionLightest: ` rgba(${pallete.red}, 0.05)`,

    additional0: `${pallete.orange}`,
    additional0Light: `rgba(${pallete.orange}, 0.5)`,
    additional0Lighter: `rgba(${pallete.orange}, 0.25)`,
    additional0Lightest: `rgba(${pallete.orange}, 0.05)`,

    additional1: `${pallete.cyan}`,
    additional1Light: `rgba(${pallete.cyan}, 0.5)`,
    additional1Lighter: `rgba(${pallete.cyan}, 0.25)`,
    additional1Lightest: `rgba(${pallete.cyan}, 0.05)`,

    additional2: `${pallete.purple}`,
    additional2Light: `rgba(${pallete.purple}, 0.5)`,
    additional2Lighter: `rgba(${pallete.purple}, 0.25)`,
    additional2Lightest: `rgba(${pallete.purple}, 0.05)`,

    additional3: `${pallete.lime}`,
    additional3Light: `rgba(${pallete.lime}, 0.5)`,
    additional3Lighter: `rgba(${pallete.lime}, 0.25)`,
    additional3Lightest: `rgba(${pallete.lime}, 0.05)`,

    additional4: `${pallete.ochre}`,
    additional4Light: `rgba(${pallete.ochre}, 0.5)`,
    additional4Lighter: `rgba(${pallete.ochre}, 0.25)`,
    additional4Lightest: `rgba(${pallete.ochre}, 0.05)`
  }
}
