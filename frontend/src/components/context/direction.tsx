import { useContext, ReactNode, createContext, useState } from "react";

interface childrenType {
    children: ReactNode;
}

interface directionContextType {
    route: string | null;
    updateRoute: (route: string | null) => void;
}

const DirectionContext = createContext<directionContextType | undefined>(undefined);

const useDirectionContext = () => {
    const context = useContext(DirectionContext);

    if (context === undefined) {
        throw new Error("Invalid ErrorContext: undefined.");
    }

    return context;
};

function DirectionProvider({ children }: childrenType) {
    const [route, setRoute] = useState<string | null>(null);

    const updateRoute = (route: string | null) => setRoute(`/${route}`);

    const value: directionContextType = { route, updateRoute };

    return <DirectionContext.Provider value={value}>{children}</DirectionContext.Provider>;
}

export { DirectionProvider, useDirectionContext };
