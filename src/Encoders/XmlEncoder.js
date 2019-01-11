import AbstractEncoder from './AbstractEncoder';
import { get, isObject } from "@kernel-js/support";

const { DOMParser } = require('xmldom');
const xmlToJSON = require('xmltojson');
xmlToJSON.stringToXML = (string) => new DOMParser().parseFromString(string, 'text/xml');

/**
 * Encodes JSON data.
 *
 * @author Gustavo Siqueira <gus@brid-it.com>
 */
export default class XmlEncoder extends AbstractEncoder
{
  constructor()
  {
    super();
  }

  /**
   * {@inheritdoc}
   */
  supportsEncode(data)
  {
    return typeof data === 'object';
  }

  /**
   * {@inheritdoc}
   */
  supportsDecode(data)
  {
    return typeof data === 'string' && data.substr(0, 5) === '<?xml';
  }

  /**
   * {@inheritdoc}
   */
  encode(data)
  {
    return `<?xml version="1.0" encoding"utf-8" ?>${this.encodeIteration(data, 'root')}`;
  }

  encodeIteration(data, name)
  {
    let encoded = `<${name}>`;
    for (const key of Object.keys(data)) {
      if (isObject(data[key])) {
        encoded += this.encodeIteration(data[key], key);
      } else {
        encoded += `<${key}>${data[key]}</${key}>`;
      }
    }

    return `${encoded}</${name}>`;
  }

  /**
   * {@inheritdoc}
   */
  decode(data)
  {
    let decoded = xmlToJSON.parseString(data);
    let root = get(decoded, 'root.0', {});
    decoded = this.decodeIteration(root);

    return decoded;
  }

  decodeIteration(data)
  {
    let decoded = {};

    for (const key of Object.keys(data)) {
      if (typeof data[key][0]['_text'] !== 'undefined') {
        decoded[key] = get(data, `${key}.0._text`);
      } else {
        decoded[key] = this.decodeIteration(get(data, `${key}.0`))
      }
    }

    return decoded;
  }
}
