import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ValidationException } from "../exceptions/validation.exception";

// 2 предназначения пайпов - преобразование входных данных
//                         - валидация входных данных
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        // console.log(`Validation object: ${JSON.stringify(value)} in ValidationPipe`);

        if (value === undefined) {
            return value;
            throw new ValidationException('Получено неопределенное значение в качестве аргумента')
        }

        const obj = plainToClass(metadata.metatype, value); // Получаем объект, который будем валидировать
        const errors = await validate(obj);

        if (errors.length) {
            let messages = errors.map(err => {
                return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
            })
            throw new ValidationException(messages);
        }
        return value;
    }
    
}