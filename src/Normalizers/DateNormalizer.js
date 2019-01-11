import AbstractNormalizer from './AbstractNormalizer';

export default class DateNormalizer extends AbstractNormalizer
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
    return denormalized;
  }

  /**
   * @inheritDoc
   */
  denormalize(normalized)
  {
    let denormalized = {};
    for (const key of Object.keys(normalized)) {
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(normalized[key])) {
        denormalized[key] = new Date(normalized[key]);
      } else {
        denormalized[key] = normalized[key];
      }
    }

    return denormalized;
  }

}
