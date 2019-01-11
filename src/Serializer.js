import AbstractEncoder from "./Encoders/AbstractEncoder";
import AbstractNormalizer from "./Normalizers/AbstractNormalizer";
import { ArgumentError, NotSupportedError } from "@kernel-js/exceptions";

/**
 * @type {WeakMap<object, any>}
 */
const encoder = new WeakMap();

/**
 * @type {WeakMap<object, any>}
 */
const normalizers = new WeakMap();

export default class Serializer
{

  constructor(encoder, normalizers = [])
  {
    if (!encoder instanceof AbstractEncoder) {
      throw new ArgumentError('encoder');
    }

    if (!Array.isArray(normalizers)) {
      normalizers = [normalizers];
    }

    normalizers.forEach(function (normalizer) {
      if (!(normalizer instanceof AbstractNormalizer)) {
        throw new ArgumentError('normalizer');
      }
    });

    this.setEncoder(encoder);
    this.setNormalizers(normalizers);
  }

  /**
   * @returns {ChainSerializer | any | undefined}
   */
  getEncoder()
  {
    return encoder.get(this);
  }

  setEncoder(val)
  {
    encoder.set(this, val);
  }

  getNormalizers()
  {
    return normalizers.get(this);
  }

  setNormalizers(val)
  {
    normalizers.set(this, val);
  }

  serialize(value)
  {
    let encoder = this.getEncoder();

    if (!encoder.supportsEncode(value)) {
      throw new NotSupportedError(`Encode for the given value is not supported.`);
    }

    return encoder.encode(this.normalize(value));
  }

  unserialize(value)
  {
    let encoder = this.getEncoder();

    if (!encoder.supportsDecode(value)) {
      throw new NotSupportedError(`Decode for the given value is not supported.`);
    }

    return this.denormalize(encoder.decode(value));
  }

  normalize(value)
  {
    let result = value, normalizers = this.getNormalizers();

    normalizers.forEach(function (normalizer) {
      if (!normalizer.supportsNormalization(result)) {
        throw new NotSupportedError(`Denormalization for the given value is not supported.`);
      }

      result = normalizer.normalize(result);
    });

    return result;
  }

  denormalize(value)
  {
    let result = value, normalizers = this.getNormalizers();

    normalizers.forEach(function (normalizer) {
      if (!normalizer.supportsDenormalization(result)) {
        throw new NotSupportedError(`Denormalization for the given value is not supported.`);
      }

      result = normalizer.denormalize(result);
    });

    return result;
  }

}
