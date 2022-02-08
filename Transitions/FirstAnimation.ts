import { Processor } from "postcss";
import { ProcessedStyle, AnimationObject, ChainedAnimation } from "./types";

const logo: AnimationObject<
  ["sync"],
  { ctnRef: React.RefObject<HTMLDivElement>; backgroundLogo: ProcessedStyle }
> = {
  states: {
    sync: (dependencies) => {
      if (dependencies.backgroundLogo.activeState === "bgFull") {
        return {
          ...dependencies.backgroundLogo,
          scale: 5,
          rotate: "-35deg",
          backgroundColor: undefined,
          transition: {},
        };
      }
      return dependencies.backgroundLogo;
    },
  },
  meta: {
    directions: {},
    defaultDirections: "sync",
    directives: {},
  },
};

const background: AnimationObject<
  ["sync"],
  { backgroundLogo: ProcessedStyle }
> = {
  states: {
    sync: (dependencies) => {
      return dependencies.backgroundLogo;
    },
  },
  meta: {
    directions: [],
    defaultDirections: "sync",
  },
};

const backgroundLogo: AnimationObject<
  ["rest", "middle", "instantMiddle", "offsetTop", "bgFull"],
  { ctnRef: React.RefObject<HTMLDivElement> }
> = {
  states: {
    default: (dependencies) => {
      const parent = dependencies.ctnRef.current?.getBoundingClientRect();
      if (!parent) return {};

      return {
        opacity: 1,
        scale: 1,
        rotate: 0,
        y: parent.top,
        x: parent.left,
        borderRadius: "20%",
        backgroundColor: "#1F1C24"
      };
    },
    rest: (dependencies) => {
      const parent = dependencies.ctnRef.current?.getBoundingClientRect();
      if (!parent) return {};

      return {
        x: parent.left,
        y: parent.top,
        scale: 1,
      };
    },
    offsetTop: {
      y: -100,
      opacity: 0,
    },
    instantMiddle: (dependencies) => {
      const parent = dependencies.ctnRef.current?.getBoundingClientRect();
      if (!parent) return {};

      return {
        x: window.innerWidth / 2 - parent.width / 2,
        y: window.innerHeight / 2 - parent.height / 2,
        opacity: 1,
        scale: 0,
      };
    },
    middle: (dependencies) => {
      const parent = dependencies.ctnRef.current?.getBoundingClientRect();
      if (!parent) return {};

      return {
        x: window.innerWidth / 2 - parent.width / 2,
        y: window.innerHeight / 2 - parent.height / 2,
        opacity: 1,
        scale: 5,
        transition: {
          duration: 0.5,
        },
      };
    },
    bgFull: (dependencies) => {
      const parent = dependencies.ctnRef.current?.getBoundingClientRect();
      if (!parent) return {};

      return {
        x: window.innerWidth / 2 - parent.width / 2,
        y: window.innerHeight / 2 - parent.height / 2,
        opacity: 1,
        scale: 100,
        transition: { duration: 1 },
        background:"#0d0d0d"
      };
    },
  },
  meta: {
    directions: ["offsetTop", "instantMiddle", "middle", "bgFull"],
    directives: {
      offsetTop_middle: {
        transition: { duration: 0 },
      },
      offsetTop_instantMiddle: {
        transition: { duration: 0 },
      },
    },
  },
};

const animation: ChainedAnimation<
  ["background", "logo"],
  { name: string; ctnRef: React.RefObject<HTMLDivElement> },
  ["backgroundLogo"]
> = {
  abstractObjects: {
    backgroundLogo,
  },
  objects: {
    background,
    logo,
  },
};

export default animation;
