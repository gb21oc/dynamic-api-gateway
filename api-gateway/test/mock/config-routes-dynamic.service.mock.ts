export const configRoutesDynamicServiceMOCK = {
    errorInValidationID: { statusCode: 400, message: 'Id is number!', error: null },
    mockRouteAlreadyCreated: { statusCode: 400, message: 'Route already created', error: null },
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
    mockSuccessUpdateItem: { statusCode: 200, message: 'OK!', error: null }
}