declare type PrimitiveInput = string | number | boolean | null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type ComplexInput = Record<string, any> | Array<any>

export type Input = PrimitiveInput | ComplexInput
export type ParsedRedisResponse = Input | null
