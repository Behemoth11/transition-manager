"strict";
import React from "react";
import { useFirstTimeLoading, useSequentialState } from "../src/lib/hooks";
import { useTracker } from "../src/lib/utils";

const graph = {
  rest: ["exit"],
  exit: ["enter"],
  enter: ["rest", "exit"],
};

export const usePageTransition = (children: React.ReactNode & {key: string} ) => {
  const firstTimeLoading = useFirstTimeLoading();
  
  const [activePage, setActivePage] = React.useState(children);

  const pageState = useSequentialState(["rest", "exit", "enter"] as const, [
    "rest_enter",
    "exit_rest",
  ]);


  React.useEffect(() => {
    if (firstTimeLoading ) return;
    
    if (children.key === activePage.key) {
      pageState.tryChange("enter");
    }
    else {
      pageState.tryChange("exit");
    }
  }, [children]);

  React.useEffect(() => {

    if (pageState.currentState === "enter") {
      setActivePage(children);
    }
  }, [pageState.currentState]);


  return {
    activePage,
    pageState,
    Provider: RoutingStateProvider,
  };
};

export default usePageTransition;

interface RoutingStateContext {
  currentState: "exit" | "enter" | "rest";
  tryChange: (desiredState: "exit" | "enter" | "rest") => void;
}

const RoutingStateContext = React.createContext<RoutingStateContext>({
  currentState: "rest",
  tryChange: () => console.log("state Not available"),
});

export const RoutingStateProvider: React.FC<RoutingStateContext> = ({
  children,
  ...contextValues
}) => {
  return (
    <RoutingStateContext.Provider value={contextValues}>
      {children}
    </RoutingStateContext.Provider>
  );
};

export const useRoutingStateContext = () => {
  return React.useContext(RoutingStateContext);
};
