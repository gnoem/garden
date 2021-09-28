export interface ISimpleObject {
  [key: string]: any;
}

/**
 * create a type from T that is the same union, but with each member of the union augmented with the missing fields from all the union with the missing fields being optional and of type undefined
 * https://stackoverflow.com/questions/51889715/require-at-least-one-of-two-properties-to-be-provided-in-props
 */

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
type FlattenUnionHelper<T, TAll> = T extends any ? T & Partial<Record<Exclude<keyof TAll, keyof T>, undefined>> : never;
export type FlattenUnion<T> = FlattenUnionHelper<T, UnionToIntersection<T>>;