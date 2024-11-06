export function validateRequestBody(reqBody, requiredFields, strict) {
  if (!reqBody || Object.keys(reqBody).length === 0) {
    return false;
  }
  
  const validFields = requiredFields.filter(field => reqBody[field]);
  if (!strict) {
    return validFields.length > 0;
  }

  return validFields.length === requiredFields.length;
}
