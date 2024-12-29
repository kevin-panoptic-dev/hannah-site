import { useState, createContext, useContext, ReactNode } from "react";

interface childrenType {
    children: ReactNode;
}

interface searchContextType {
    message: string;
    searchWith: (message: string) => void;
}

const SearchContext = createContext<searchContextType | undefined>(undefined);

const useSearchContext = () => {
    const context = useContext(SearchContext);

    if (context === undefined) {
        throw new Error("Invalid SearchContext Undefined.");
    }
    return context;
};

function SearchProvider({ children }: childrenType) {
    const [message, setMessage] = useState<string>("");

    const searchWith = (message: string) => setMessage(message);

    const value: searchContextType = { message, searchWith };

    return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export { useSearchContext, SearchProvider };
