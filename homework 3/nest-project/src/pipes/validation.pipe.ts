import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ValidationException } from "src/exceptions/validation.exception";

// 2 предназначения пайпов - преобразование входных данных
//                         - валидация входных данных
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        console.log(`got value ${JSON.stringify(value)} in transform`);

        if (value === undefined) {
            return value;
            throw new ValidationException('Получено неопределенное значение в качестве аргумента')
        }

        const obj = plainToClass(metadata.metatype, value); // Получаем объект, который будем валидировать
        console.log(`Получили объект ${obj}`);
        const errors = await validate(obj);
        console.log(`Получили ошибки для него ${errors}`);

        if (errors.length) {
            console.log("Ошибки")
            console.log(errors);
            let messages = errors.map(err => {
                return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
            })
            throw new ValidationException(messages);
        }
        return value;
    }
    
}