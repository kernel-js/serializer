import { expect } from 'chai';
import { Serializer, JsonEncoder, DateNormalizer, RegexNormalizer, JsonApiNormalizer } from "../src/index";

describe('Normalizers', () => {

  it('DateNormalizer', () => {
    const obj = {
      "id": 1,
      "description": "Test",
      "createdAt": new Date(),
    };

    let serializer = new Serializer(new JsonEncoder(), [new DateNormalizer()]);

    let serialized = serializer.serialize(obj);
    let unserialized = serializer.unserialize(serialized);

    expect(unserialized).to.deep.equal(obj);
  });

  it('RegexNormalizer', () => {
    const obj = {
      "id": 1,
      "description": "Test",
      "regex": new RegExp(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
    };

    let serializer = new Serializer(new JsonEncoder(), [new RegexNormalizer()]);

    let serialized = serializer.serialize(obj);
    let unserialized = serializer.unserialize(serialized);

    expect(unserialized).to.deep.equal(obj);
  });

  it('MultipleNormalizers', () => {
    const obj = {
      "id": 1,
      "description": "Test",
      "createdAt": new Date(),
      "active": true,
      "regex": new RegExp(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
      "config": {
        "first": 0,
      }
    };

    let serializer = new Serializer(new JsonEncoder(), [new DateNormalizer(), new RegexNormalizer()]);

    let serialized = serializer.serialize(obj);
    let unserialized = serializer.unserialize(serialized);

    expect(unserialized).to.deep.equal(obj);
  });

  it('JsonApiNormalizers', () => {
    const obj = '{"meta":{"total-data":2,"total-pages":1},"data":{"type":"Product","id":1,"attributes":{"description":"Test 1","active":true},"relationships":{"category":{"data":{"type":"Category","id":1}},"subtype":{"data":{"type":"Type","id":2}}}},"included":[{"type":"Category","id":1,"attributes":{"description":"Category 1","active":true},"relationships":{"owner":{"data":{"type":"User","id":3}}}},{"type":"Type","id":2,"attributes":{"description":"Type 2","active":true}},{"type":"User","id":3,"attributes":{"name":"John Doe","active":true}}]}';

    let serializer = new Serializer(new JsonEncoder(), [new JsonApiNormalizer()]);
    let unserialized = serializer.unserialize(obj);

    expect(unserialized.id).to.equal(1);
    expect(unserialized.category.id).to.equal(1);
    expect(unserialized.subtype.id).to.equal(2);
    expect(unserialized.category.owner.id).to.equal(3);
  });

});
