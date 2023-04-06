import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ValidationException } from "../exceptions/validation.exception";

@Injectable()
export class ParseFile implements PipeTransform {
    transform(
        file: Express.Multer.File,
        metadata: ArgumentMetadata,
    ) {
        if (file === undefined || file === null) {
            throw new ValidationException('Ошибка валидации (ожидался файл в поле file)');
        }
        return file;
    }
}