import React from "react";
import { useRef, useState } from "react";
import {
  AnimationDependencies,
  AnimationObject,
  controllersReadyStyles,
  ProcessedStyle,
  RawStyle,
} from "./Transitions/types";
import { ChainedAnimation } from "./Transitions/types";
import { AnimationConfig } from "./typesAnimation";

/**
 * Class that controlls and plan transitions created in framer motion
 */


export default function useAnimationSequence<
  Animation extends ChainedAnimation
>(config: AnimationConfig<Animation>) {
  const animationIndexRef = useRef(0);
  const directionRef = useRef("forward");

  /**
   * Animates animation objects in the given directions or to the specific state.
   *
   * @param direction direction in which to animate
   * @param state an optional state to animated to all animation object
   * @returns void
   */
  async function animate(direction?: Direction, state?: string) {
    const animationIndex = animationIndexRef.current;
    console.log("Start key frame", animationIndex)
    // console.log("animate", animationIndex);
    const objects = config.animation.objects;
    const abstractObjects = config.animation.abstractObjects || {};

    let abstractStyles: { [key: string]: ProcessedStyle } =
      getObjectMappedStyles(abstractObjects, { animationIndex }, state);

    let controllersStyles: { [key: string]: ProcessedStyle } =
      getObjectMappedStyles(
        objects,
        { ...abstractStyles, animationIndex },
        state
      );


    await animateStyles(controllersStyles);

    if (direction === null) return;

    animationIndexRef.current =
      direction === "forward" ? animationIndex + 1 : animationIndex - 1;

    if (animationIndexRef.current < 10) animate(direction);
  }

  /**
   * Compute the styles of an AnimationObject dictionary and gives the result as a dictionary of same keys.
   *
   * @param objects an dictionary with Animation object as key values
   * @param addOnsDependencies Dependencies not contained in the global dependency object. NOTE: The only option currently passed in that parameter are the abstract object styles;
   * @param state when provided, styles computation rely on state instead of current animationIndex.current
   * @returns Object with the same key as object dictionary and their corresponding mapped styles
   */
  function getObjectMappedStyles(
    objects: { [key: string]: AnimationObject },
    addOnsDependencies: AnimationDependencies,
    state?: string
  ) {
    const objectMappedStyles: { [key: string]: ProcessedStyle } = {};

    for (const objectName in objects) {
      const object = objects[objectName];

      const objectPreviousState = object.meta.previousState;
      const objectActiveState =
        state ||
        object.meta.directions[animationIndexRef.current] ||
        (object.meta.defaultDirections as string);

      let objetStyles = getStyles(
        object.states[objectActiveState],
        addOnsDependencies
      );

      // Directives of transition A_B or B_A are specific styles applied when
      // migrating from style A to style B or from style B to style A.
      const directives = object.meta.directives;

      if (objectName === "backgroundLogo"){
        console.log(objectActiveState)
      }
      let transitionDirectives: ProcessedStyle = {} ;

      if (objectPreviousState && directives) {
        const transitionId_1 = objectPreviousState + "_" + objectActiveState;
        const transitionId_2 = objectActiveState + "_" + objectPreviousState;
        const _transitionDirectives =
          directives[transitionId_1] || directives[transitionId_2];

        transitionDirectives = _transitionDirectives || {};
      }

      let defaultStyles: ProcessedStyle  = {activeState: objectActiveState};
      if (object.states.default) {
        defaultStyles = getStyles(object.states.default, addOnsDependencies);
      }

      objetStyles = {
        ...defaultStyles,
        ...objetStyles,
        ...transitionDirectives,
        activeState: objectActiveState
      };

      objectMappedStyles[objectName] = objetStyles;
      object.meta.previousState = objectActiveState;
    }

    return objectMappedStyles;
  }

  const idRef = useRef(Math.floor(Math.random() * 1000))
  React.useEffect(() => {
    // console.log(config.animationDependencies, idRef.current );
  }, [config.animationDependencies]);

  /**
   * Create animation ready styles ProcessedStyle from raw styles ( animation getters).
   * NOTE: Returns the original styles if the style are already in a usable shape.
   *
   * @param rawStyle
   * @param addOnsDependencies Dependencies not contained in the global dependency object. NOTE: The only option currently passed in that parameter are the abstract object styles;
   * @returns ProcessedStyle which are keyframe usable with framer-motion controllers
   */
  function getStyles(
    rawStyle: RawStyle,
    addOnsDependencies: { [key: string]: any } = {}
  ) {
    let computedStyles: ProcessedStyle = {};

    if (typeof rawStyle === "function")
      computedStyles = rawStyle({
        ...config.animationDependencies,
        ...addOnsDependencies,
      });
    else computedStyles = rawStyle;

    return computedStyles;
  }

  /**
   * Perform async animation of Object mapped styles
   *
   * @param styles Object with instance controllers as keys and processed styles as value.
   */
  async function animateStyles(styles: controllersReadyStyles) {
    const animationPromises: Promise<void>[] = [];
    const controllers = config.controllers;

    for (const controllerName in styles) {
      const controllerStyles = styles[controllerName];

      animationPromises.push(
        controllers[controllerName]["start"](controllerStyles)
      );
    }

    await Promise.all(animationPromises);
  }

  return [
    config.controllers,
    {
      animate,
      idRef
    },
  ] as const;
}
