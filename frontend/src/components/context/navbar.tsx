// import {
//     useContext,
//     ReactNode,
//     createContext,
//     useState,
//     useEffect,
// } from "react";

// interface childrenType {
//     children: ReactNode;
// }

// interface navbarContextType {
//     isVisible: boolean;
//     show: () => void;
//     hide: () => void;
// }

// const NavbarContext = createContext<navbarContextType | undefined>(
//     undefined
// );

// function useNavbarContext() {
//     const context = useContext(NavbarContext);

//     if (context === undefined) {
//         throw new Error("Invalid NavbarContext: undefined.");
//     }

//     return context;
// }

// function NavbarProvider({ children }: childrenType) {
//     const [isVisible, setIsVisible] = useState<boolean>(true);

//     const show = () => {
//         setIsVisible(true);
//         localStorage.setItem("navbarVisible", "true");
//     };

//     const hide = () => {
//         setIsVisible(false);
//         localStorage.setItem("navbarVisible", "false");
//     };

//     const value: navbarContextType = { isVisible, show, hide };

//     useEffect(() => {
//         const savedVisibility = localStorage.getItem("navbarVisible");
//         if (savedVisibility) {
//             setIsVisible(savedVisibility === "true");
//         }
//     }, []);

//     return (
//         <NavbarContext.Provider value={value}>
//             {children}
//         </NavbarContext.Provider>
//     );
// }

// export { NavbarProvider, useNavbarContext };
