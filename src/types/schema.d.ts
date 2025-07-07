import { InferSchemaType } from 'mongoose'

import userSchema from '@/schemas/user'

export type UserDocument = InferSchemaType<typeof userSchema>
