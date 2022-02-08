declare type SameKeysWithType<T, Obj> = {
  [P in keyof Obj]: T;
};

declare type ObjectOfKeys<Keys extends string[], KeyType> = {
  [K in Keys[number]]: KeyType;
};

declare type Direction = "forward" | "backward" | null;

type D = ObjectOfKeys<["dan", "man"], undefined>;
