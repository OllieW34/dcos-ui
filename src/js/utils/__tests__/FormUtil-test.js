jest.dontMock('../FormUtil');

let FormUtil = require('../FormUtil');

describe('FormUtil', function () {
  describe('#getMultipleFieldDefinition', function () {
    beforeEach(function () {
      this.definition = [
        {
          name: 'key',
          value: null
        },
        {
          name: 'value',
          value: null
        }
      ];
    });

    it('sets the correct name for the definition', function () {
      let result = FormUtil.getMultipleFieldDefinition(
        'variable',
        1,
        this.definition
      );

      expect(result[0].name).toEqual('variable[1].key');
      expect(result[1].name).toEqual('variable[1].value');
    });

    it('does not modify the definition', function () {
      let result = FormUtil.getMultipleFieldDefinition(
        'variable',
        1,
        this.definition
      );

      expect(result[0].name).toEqual('variable[1].key');
      expect(this.definition[0].name).toEqual('key');
    });

    it('sets the value if a model is passed', function () {
      let result = FormUtil.getMultipleFieldDefinition(
        'variable',
        1,
        this.definition,
        {
          key: 'kenny',
          value: 'tran'
        }
      );

      expect(result[0].value).toEqual('kenny');
      expect(result[1].value).toEqual('tran');
    });
  });

  describe('#modelToCombinedProps', function () {
    beforeEach(function () {
      this.result = FormUtil.modelToCombinedProps('uid', {
        'uid[0].uid': 'kenny',
        'uid[0].password': 'secret',
        'uid[1].uid': 'jane',
        'uid[1].password': 'secret2',
        unrelatedProp: 'hellothere'
      });
    });

    it('should not modify the unrelated properties', function () {
      expect(this.result.unrelatedProp).toEqual('hellothere');
    });

    it('should create a property named "uid" that is an array', function () {
      expect(Array.isArray(this.result.uid)).toEqual(true);
    });

    it('should convert each instance into an object', function () {
      expect(typeof this.result.uid[0]).toEqual('object');
    });

    it('should convert each instance with the correct values', function () {
      expect(this.result.uid[0].uid).toEqual('kenny');
      expect(this.result.uid[0].password).toEqual('secret');
      expect(this.result.uid[1].uid).toEqual('jane');
      expect(this.result.uid[1].password).toEqual('secret2');
    });
  });

  describe('#isFieldInstanceOfProp', function () {
    it('should return true if field is instance of prop', function () {
      let fields = [
        {name: 'variable[2].key', value: 'kenny'},
        {name: 'variable[2].value', value: 'tran'}
      ];
      let result = FormUtil.isFieldInstanceOfProp('variable', 2, fields);
      expect(result).toEqual(true);
    });

    it('should return false if field is not instance of prop', function () {
      let fields = [
        {name: 'variable[1].key', value: 'kenny'},
        {name: 'variable[1].value', value: 'tran'}
      ];
      let result = FormUtil.isFieldInstanceOfProp('variable', 2, fields);
      expect(result).toEqual(false);
    });

    it('should work on a single definition', function () {
      let field = {name: 'variable[1].key', value: 'kenny'};
      let result = FormUtil.isFieldInstanceOfProp('variable', 1, field);
      expect(result).toEqual(true);
    });
  });

  describe('#removePropID', function () {
    it('should remove the fields with that property', function () {
      let definition = [
        {name: 'password', value: 'secret'},
        {name: 'variable[1].key', value: 'kenny'},
        {name: 'variable[1].value', value: 'tran'},
        {name: 'variable[2].key', value: 'mat'},
        {name: 'variable[2].value', value: 'app'}
      ];

      FormUtil.removePropID(definition, 'variable', 1);

      let expectedResult = [
        {name: 'password', value: 'secret'},
        {name: 'variable[2].key', value: 'mat'},
        {name: 'variable[2].value', value: 'app'}
      ];

      expect(definition).toEqual(expectedResult);
    });
  });

});
