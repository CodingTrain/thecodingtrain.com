const requiredPropertyError = (property, name) => {
  const e = new Error(
    `Required property '${property}' not present in ${name} object`
  );
  e.name = 'RequiredPropertyError';
  return e;
};

const unexpectedPropertyError = (property, name) => {
  const e = new Error(
    `Property '${property}' in ${name} object isn't expected.`
  );
  e.name = 'UnexpectedPropertyError';
  return e;
};

const typePropertyError = (property, name, expectedType, type) => {
  const e = new Error(
    `Type of value for '${property}' property doesn't match for ${name} object. Expected ${expectedType}, but got ${type}.`
  );
  e.name = 'TypePropertyError';
  return e;
};

const typeArrayContentError = (property, name, expectedType, type) => {
  const e = new Error(
    `Type of value inside array '${property}' property doesn't match in ${name} object. Expected ${expectedType}, but got ${type}.`
  );
  e.name = 'TypeArrayContentError';
  return e;
};

module.exports = {
  requiredPropertyError,
  unexpectedPropertyError,
  typePropertyError,
  typeArrayContentError
};
