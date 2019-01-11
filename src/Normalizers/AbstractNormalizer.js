export default class AbstractNormalizer
{

  constructor()
  {
    if (new.target === AbstractNormalizer) {
      throw new TypeError('Cannot construct AbstractNormalizer instances directly.');
    }
  }

  /**
   * Checks whether the given class is supported for normalization by this normalizer.
   *
   * @param {any}    data   Data to normalize
   * @return {Boolean}
   */
  supportsNormalization(data){}

  /**
   * Checks whether the given class is supported for denormalization by this normalizer.
   *
   * @param {any}    data   Data to denormalize from
   * @return {Boolean}
   */
  supportsDenormalization(data){}

  /**
   * Normalizes an object into a set of arrays/scalars.
   *
   * @param {Object} object  Object to normalize
   * @param {String} format  Format the normalization result will be encoded as
   * @param {Array}  context Context options for the normalizer
   *
   * @return {Array|String|Number|Boolean}
   */
  normalize(object){}

  /**
   * DeNormalizes data back into an object of the given class.
   *
   * @param {any}    data    Data to restore
   * @param {String} class   The expected class to instantiate
   * @param {String} format  Format the given data was extracted from
   * @param {Array}  context Options available to the denormalizer
   *
   * @return {Object}
   */
  denormalize(data){}

}
