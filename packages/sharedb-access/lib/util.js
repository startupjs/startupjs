
module.exports.relevantPath = (pattern, op) => {
  var segments = segmentsFor(op);
  var patternSegments = pattern.split('.');

  if (segments.length !== patternSegments.length) {
    return false;
  }

  if (-1 === patternSegments.indexOf('*')) {
    return segments.join('.') === patternSegments.join('.');
  }

  var regExp = patternToRegExp(patternSegments.join('.'));


  return regExp.test(segments.join('.'));
}

module.exports.lookup = (segments, doc) => {

  var part, curr = doc;
  for (var i = 0; i < segments.length; i++) {
    part = segments[i];
    if (curr !== void 0) {
      curr = curr[part];
    }
  }

  return curr;
}

module.exports.patternToRegExp = (pattern) => {
  var regExpString = pattern
    // точка нужно экранировать для регулярок
    .replace(/\./g, "\\.")
    // ** включает роуты с . например collection/name.index
    .replace(/\*\*/g, "(.+)")
    // * исключает пути после точки collection/name
    .replace(/\*/g, "([^.]+)");

  return new RegExp('^'+regExpString+'$');
}

module.exports.segmentsFor = (item) => {

  var relativeSegments = item.p;

  if (normalPath(item)) return relativeSegments;

  return relativeSegments.slice(0, -1);
}

module.exports.normalPath = (item) => {
  return 'oi' in item || 'od' in item || 'li' in item || 'ld' in item || 'na' in item;
}