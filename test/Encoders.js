import { expect } from 'chai';
import { Serializer, JsonEncoder, XmlEncoder } from "../src/index";

describe('JsonEncoder', () => {

  it('JsonEncoder', () => {
    const obj = {
      "id": 1,
      "description": "Test",
      "active": true,
      "config": {
        "first": 0,
      }
    };

    let serializer = new Serializer(new JsonEncoder());

    let serialized = serializer.serialize(obj);
    let unserialized = serializer.unserialize(serialized);

    expect(unserialized).to.deep.equal(obj);
  });

  it('XmlEncoder', () => {
    const obj = {
      "id": 1,
      "description": "Test",
      "active": true,
      "config": {
        "first": 0,
      }
    };

    let serializer = new Serializer(new XmlEncoder());
    let serialized = serializer.serialize(obj);
    let unserialized = serializer.unserialize(serialized);

    expect(serialized).to.equal('<?xml version="1.0" encoding"utf-8" ?><root><id>1</id><description>Test</description><active>true</active><config><first>0</first></config></root>');
    expect(unserialized).to.deep.equal(obj);
  });

});
