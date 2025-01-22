import {
    useContext,
    ReactNode,
    createContext,
    useState,
    useEffect,
} from "react";

interface childrenType {
    children: ReactNode;
}

interface directionContextType {
    route: string | null;
    updateRoute: (route: string | null) => void;
}

const DirectionContext = createContext<
    directionContextType | undefined
>(undefined);

function useDirectionContext() {
    const context = useContext(DirectionContext);

    if (context === undefined) {
        throw new Error("Invalid DirectionContext: undefined.");
    }

    return context;
}

function DirectionProvider({ children }: childrenType) {
    const [route, setRoute] = useState<string | null>(null);

    const updateRoute = (route: string | null) => {
        setRoute(`/${route}`);
        if (route) {
            localStorage.setItem("route", `/${route}`);
        } else {
            localStorage.removeItem("route");
        }
    };

    const value: directionContextType = { route, updateRoute };

    useEffect(() => {
        const savedRoute = localStorage.getItem("route");
        if (savedRoute) {
            setRoute(savedRoute);
        }
    }, []);

    return (
        <DirectionContext.Provider value={value}>
            {children}
        </DirectionContext.Provider>
    );
}

export { DirectionProvider, useDirectionContext };
