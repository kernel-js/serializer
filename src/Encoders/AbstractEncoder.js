export default class AbstractEncoder
{

  constructor()
  {
    if (new.target === AbstractEncoder) {
      throw new TypeError('Cannot construct AbstractSerializer instances directly.');
    }
  }

  /**
   * Checks whether the serializer can encode to given format.
   *
   * @param {String|Number|Boolean|Object}    data    Data to encode
   * @return {Boolean}
   */
  supportsEncode(data){}

  /**
   * Checks whether the deserializer can decode from given format.
   *
   * @param {String|Number|Boolean|Object} data    Data to decode
   * @return {Boolean}
   */
  supportsDecode(data){}

  /**
   * Serialize data into the given format.
   *
   * @param {Object|Array}    value    Data to encode
   *
   * @return {String}
   * @throws {Error}
   */
  encode(value){}

  /**
   * Decodes data from the given format.
   *
   * @param {String}    value    Data to unserialize
   *
   * @return {Object|Array}
   * @throws {Error}
   */
  decode(data){}

}
