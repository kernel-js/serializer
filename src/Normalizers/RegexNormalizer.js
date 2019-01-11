import AbstractNormalizer from './AbstractNormalizer';

export default class RegexNormalizer extends AbstractNormalizer
{

  constructor()
  {
    super();
  }

  /**
   * Checks whether the given class is supported for normalization by this normalizer.
   *
   * @param {any}    data   Data to normalize
   * @return {Boolean}
   */
  supportsNormalization(data)
  {
    return typeof data === 'object';
  }

  /**
   * Checks whether the given class is supported for denormalization by this normalizer.
   *
   * @param {any}    data   Data to denormalize from
   * @return {Boolean}
   */
  supportsDenormalization(data)
  {
    return typeof data === 'object';
  }

  /**
   * Normalizes an object into a set of arrays/scalars.
   *
   * @param {Object} object  Object to normalize
   * @param {String} format  Format the normalization result will be encoded as
   * @param {Array}  context Context options for the normalizer
   *
   * @return {Array|String|Number|Boolean}
   */
  normalize(denormalized)
  {
    let normalized = {};
    for (const key of Object.keys(denormalized)) {
      if (Object.prototype.toString.call(denormalized[key]) === '[object RegExp]') {
        normalized[key] = `__kjs_regex|${denormalized[key].source}`;
      } else {
        normalized[key] = denormalized[key];
      }
    }

    return normalized;
  }

  /**
   * @inheritDoc
   */
  denormalize(normalized)
  {
    let denormalized = {};
    for (const key of Object.keys(normalized)) {
      if (typeof normalized[key] === 'string' && normalized[key].substr(0, 12) === '__kjs_regex|') {
        denormalized[key] = new RegExp(normalized[key].substr(12, normalized[key].length));
      } else {
        denormalized[key] = normalized[key];
      }
    }

    return denormalized;
  }

}
