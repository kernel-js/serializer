import AbstractNormalizer from './AbstractNormalizer';
import { map, find, isNotEmpty } from '@kernel-js/support';

/**
 * @type {WeakMap<object, any>}
 */
const meta = new WeakMap();

/**
 * @type {WeakMap<object, any>}
 */
const data = new WeakMap();

/**
 * @type {WeakMap<object, any>}
 */
const included = new WeakMap();

export default class JsonApiNormalizer extends AbstractNormalizer
{

  constructor()
  {
    super();

    this.fields = null;
    this.includes = null;
  }

  /**
   * @returns {any | undefined}
   */
  getData()
  {
    return data.get(this);
  }

  setData(val)
  {
    data.set(this, val);
  }

  /**
   * @returns {any | undefined}
   */
  getIncluded()
  {
    return included.get(this);
  }

  setIncluded(val)
  {
    included.set(this, val);
  }

  /**
   * @returns {any | undefined}
   */
  getMeta()
  {
    return meta.get(this);
  }

  setMeta(val)
  {
    meta.set(this, val);
  }

  /**
   * @inheritDoc
   */
  supportsDenormalization(data)
  {
    return typeof data === 'object';
  }

  /**
   * @inheritDoc
   */
  denormalize(normalized)
  {
    this.setData(normalized.data);
    this.setIncluded(normalized.included || []);
    this.setMeta(normalized.meta || {});

    if (Array.isArray(normalized.data)) {
      return this.denormalizeCollection(this.getData());
    }

    return this.denormalizeEntity(this.getData());
  }

  /**
   * Denormalize a collection of entities
   * @param {Object} normalized
   * @returns {Array}
   */
  denormalizeCollection(normalized)
  {
    return map(normalized, item => {
      return this.denormalizeEntity(item);
    });
  }

  /**
   * Denormalize one entity
   * @param {Object} normalized
   * @returns {Object}
   */
  denormalizeEntity(normalized)
  {
    let denormalized = {};

    this.injectAttributesFromIncludes(normalized);
    this.includeAttributes(denormalized, normalized);

    if (isNotEmpty(normalized.relationships)) {
      this.includeRelationships(denormalized, normalized);
    }

    return denormalized;
  }

  /**
   * Inject attributes from includes into normalized object
   * @param {Object} normalized
   * @returns {void}
   */
  injectAttributesFromIncludes(normalized)
  {
    if (!normalized.attributes) {
      let included = this.getIncludedObject(normalized);

      if (included !== null) {
        normalized.attributes = included.attributes || {};
        normalized.relationships = Object.assign(normalized.relationships || {}, included.relationships);
      }
    }
  }

  /**
   * Include attributes from normalized into denormalized object
   * @param {Object} denormalized
   * @param {Object} normalized
   * @returns {void}
   */
  includeAttributes(denormalized, normalized)
  {
    denormalized.id = normalized.id;
    denormalized.type = normalized.type;

    for (const key of Object.keys(normalized.attributes || {})) {
      if (this.shouldIncludeField(normalized.type, key)) {
        denormalized[key] = normalized.attributes[key];
      }
    }
  }

  /**
   * Inject relationships into denormalized object
   * @param {Object} denormalized
   * @param {Object} normalized
   * @returns {Object}
   */
  includeRelationships(denormalized, normalized)
  {
      denormalized.relationships = [];

      for (var key in normalized.relationships) {
        if (this.shouldIncludeRelation(key)) {
          denormalized.relationships.push(key);
          let relationship = normalized.relationships[key];

          if (Array.isArray(normalized.relationships[key].data)) {
            relationship = this.denormalizeCollection(normalized.relationships[key]);
          } else if (normalized.relationships[key].data) {
            relationship = this.denormalizeEntity(normalized.relationships[key].data);
          }

          denormalized[key] = relationship;
        }
      }

    return denormalized;
  }

  getIncludedObject(context)
  {
    let included = find(this.getIncluded(), (included) => {
      return included.id == context.id && included.type == context.type;
    });

    if (included !== undefined && included !== null) {
      return included;
    }

    return null;
  }

  shouldIncludeField (relation, field) {
    if (this.fields === null) {
      return true;
    }

    if (!this.fields.hasOwnProperty(relation)) {
      return true;
    }

    if (this.fields[relation].indexOf(field) !== -1) {
      return true;
    }

    return false;
  }

  shouldIncludeRelation (relation) {
    if (this.includes === null) {
      return true;
    }

    return this.includes.indexOf(relation) !== -1;
  }

}
