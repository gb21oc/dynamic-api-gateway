import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class ValidateFieldsIsNotEmpty implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const valueFormated = text.toString().trim().toLowerCase()
    if(!valueFormated) return false
    return true
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Field ($value) is incorrect!';
  }
}