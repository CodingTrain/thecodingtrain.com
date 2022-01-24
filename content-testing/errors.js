class MyError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}
class RequiredPropertyError extends MyError {
  constructor(property, objectName) {
    super(
      `Required property '${property}' not present in ${objectName} object`
    );
  }
}

class UnexpectedPropertyError extends MyError {
  constructor(property, objectName) {
    super(`Property '${property}' in ${objectName} object isn't expected.`);
  }
}
class TypePropertyError extends MyError {
  constructor(property, objectName, type, expectedType) {
    super(
      `Type of value for '${property}' property doesn't match for ${objectName} object. Expected ${expectedType}, but got ${type}.`
    );
  }
}
class TypeArrayContentError extends MyError {
  constructor(property, objectName, type, expectedType) {
    super(
      `Type of value inside array '${property}' property doesn't match in ${objectName} object. Expected ${expectedType}, but got ${type}.`
    );
  }
}

module.exports = {
  RequiredPropertyError,
  UnexpectedPropertyError,
  TypePropertyError,
  TypeArrayContentError
};
