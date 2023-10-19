export const configRoutesDynamicServiceMOCK = {
  errorInValidationID: { statusCode: 400, message: null, error: 'Id is number!' },
  mockRouteAlreadyCreated: { statusCode: 400, message: null, error: 'Route already created' },
  mockSuccessCreatedRoute: { statusCode: 201, message: 'OK', error: null },
  mockErrorInValidateLogicCreateRoute: {
    statusCode: 400,
    message: '',
    error: {
      property: 'isBody',
      errors: [
        "isBody it is not possible to use body for 'DELETE' and 'GET' methods"
      ]
    }
  },
  mockSuccessDeleteRoute: {
    statusCode: 200,
    message: 'The route will be deleted in 5 minutes',
    error: null
  },
  mockSuccessUpdateItem: { statusCode: 200, message: 'OK!', error: null },
  mockErrorInUpdateItem: {
    statusCode: 400,
    message: null,
    error: 'A route with similar data already exists.'
  }
}