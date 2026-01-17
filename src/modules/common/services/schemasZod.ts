import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';

const emailSchema = toTypedSchema(zod.string().nonempty('Поле обязательно для заполнения').email('Введите корректный email'));
const passwordSchema = toTypedSchema(zod.string().nonempty('Поле обязательно для заполнения').min(6, 'Пароль должен содержать минимум 6 символов'));

export const SchemasZod = {
    email: emailSchema,
    password: passwordSchema,
} as const;