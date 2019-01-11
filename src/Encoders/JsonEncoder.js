import AbstractEncoder from './AbstractEncoder';

/**
 * Encodes JSON data.
 *
 * @author Gustavo Siqueira <gus@brid-it.com>
 */
export default class JsonEncoder extends AbstractEncoder
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
    return typeof data === 'string' && data.substr(0, 1) === '{' && data.substr(-1) === '}';
  }

  /**
   * {@inheritdoc}
   */
  encode(data)
  {
    return JSON.stringify(data);
  }

  /**
   * {@inheritdoc}
   */
  decode(data)
  {
    return JSON.parse(data);
  }

}
