import { useContext, ReactNode, createContext, useState } from "react";

interface childrenType {
    children: ReactNode;
}

interface errorContextType {
    error: string | null;
    updateErrorMessage: (error: string) => void;
}

const ErrorContext = createContext<errorContextType | undefined>(undefined);

const useErrorContext = () => {
    const context = useContext(ErrorContext);

    if (context === undefined) {
        throw new Error("Invalid ErrorContext: undefined.");
    }

    return context;
};

function ErrorProvider({ children }: childrenType) {
    const [error, setError] = useState<string | null>(null);

    const updateErrorMessage = (error: string) => setError(error);

    const value: errorContextType = { error, updateErrorMessage };

    return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
}

export { useErrorContext, ErrorProvider };
