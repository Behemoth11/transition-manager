import { AnimationControls } from "framer-motion";
import { ChainedAnimation } from "./Transitions/types";


export type AnimationConfig<Animation extends ChainedAnimation> = {
  animation: Animation;
  controllers: SameKeysWithType<AnimationControls, Animation["objects"]>;
  animationDependencies: Animation extends ChainedAnimation<any, infer T, any> ? T : null;
  emitter: (message: string, payload: any) => void
};