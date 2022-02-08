import { memo } from "react";
import { AnimationControls } from "framer-motion";
import {
  TargetAndTransition,
  TargetWithKeyframes,
  Variant,
} from "framer-motion/types/types";

type c = Variant;

export type AnimationDependencies = {
  [key: string]: any
};

type ManagerGivenAnimationDependencies = {
  animationIndex: number
}

export type AnimationControllers = {
  [key: string]: AnimationControllers;
};

export type ProcessedStyle = TargetAndTransition & {
  activeState?: string
};

export type StyleGetter<ExpectedDependencies> = (
  dependencies: ExpectedDependencies
) => ProcessedStyle;

export type RawStyle<ExpectedDependencies = any> =
  | StyleGetter<ExpectedDependencies>
  | ProcessedStyle;

export type AnimationObject<
  States extends string[] = string[],
  ExpectedDependencies extends AnimationDependencies = AnimationDependencies
> = {
  states: { [K in States[number]]: RawStyle<ExpectedDependencies & ManagerGivenAnimationDependencies> } & {
    default?: RawStyle<ExpectedDependencies & ManagerGivenAnimationDependencies>;
  };
  meta: {
    directions: States[number][] | { [key: number]: States[number] };
    defaultDirections?: States[number];
    directives?: ObjectOfKeys<string[], ProcessedStyle>;
    previousState?: States[number];
  };
};

export type controllersReadyStyles = {
  [key: string]: ProcessedStyle;
};

export type ChainedAnimation<
  Controllers extends string[] = string[],
  ExpectedDependencies = any,
  AbstractObjects extends string[] = string[]
> = {
  abstractObjects?: ObjectOfKeys<
    AbstractObjects,
    AnimationObject<string[], ExpectedDependencies & { animationIndex: number }>
  >;
  objects: {
    [k in Controllers[number]]: AnimationObject<
      string[],
      ExpectedDependencies &
        ObjectOfKeys<AbstractObjects, ProcessedStyle> & {
          animationIndex: number;
        }
    >;
  };
};
