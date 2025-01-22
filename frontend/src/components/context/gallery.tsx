// import { useContext, ReactNode, createContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { useErrorContext } from "./error";
// import api from "../../utilities/api/api";
// import { GALLERY_PATH } from "../../utilities/constants";
// import { GALLERY_TOKEN } from "../../utilities/api/constants";

// interface childrenType {
//     children: ReactNode;
// }

// interface galleryContextType {
//     getGallery: () => galleryCard[] | void;
//     setGallery: () => void;
// }

// interface galleryCard {
//     id: number;
//     title: string;
//     description: string;
//     image: string;
// }

// interface galleryResponseType {
//     status: number;
//     data: {
//         detail: galleryCard[];
//     };
// }

// const GalleryContext = createContext<galleryContextType | undefined>(
//     undefined
// );

// function useGalleryContext() {
//     const context = useContext(GalleryContext);

//     if (context === undefined) {
//         throw new Error("Invalid GalleryContext: undefined.");
//     }

//     return context;
// }

// function GalleryProvider({ children }: childrenType) {
//     const { updateErrorMessage } = useErrorContext();
//     const navigate = useNavigate();
//     const toErrorPage = () => navigate("/error");

//     const performFetch = async () => {
//         const storageCards: string | null =
//             localStorage.getItem(GALLERY_TOKEN);
//         // INFO: if there's already the data available, stop fetch the data
//         if (storageCards || storageCards !== "undefined") return;

//         const response: galleryResponseType = await api.get(
//             GALLERY_PATH
//         );
//         if (response.status === 200) {
//             const stringCards = JSON.stringify(response.data.detail);
//             localStorage.setItem(GALLERY_TOKEN, stringCards);
//         } else {
//             if (
//                 localStorage.getItem(GALLERY_TOKEN) ||
//                 localStorage.getItem(GALLERY_TOKEN) === "undefined"
//             ) {
//                 localStorage.removeItem(GALLERY_TOKEN);
//             }
//             updateErrorMessage(
//                 `b; ${response.status} Error: calling gallery get api result in ${response.data.detail}`
//             );
//             toErrorPage();
//             return;
//         }
//     };

//     const setGallery = () => {
//         try {
//             performFetch();
//         } catch (error) {
//             if (error instanceof Error) {
//                 updateErrorMessage(
//                     `f;An error occurs in fetching gallery data: ${error.message}.`
//                 );
//                 toErrorPage();
//             } else {
//                 updateErrorMessage(
//                     `f;An unknown type error occurs: ${error}`
//                 );
//                 toErrorPage();
//             }
//         }
//     };

//     const getGallery = () => {
//         try {
//             const storageCards: string | null =
//                 localStorage.getItem(GALLERY_TOKEN);
//             if (
//                 storageCards === null ||
//                 storageCards === "undefined"
//             ) {
//                 updateErrorMessage(
//                     `b;Get gallery card before even set the gallery data? `
//                 );
//                 toErrorPage();
//                 return;
//             }
//             const galleryCards: galleryCard[] =
//                 JSON.parse(storageCards);
//             if (!galleryCards) {
//                 updateErrorMessage(
//                     `f; Falsy Value of gallery card inside local storage: ${galleryCards} from ${storageCards}`
//                 );
//                 toErrorPage();
//                 return;
//             }
//             return galleryCards;
//         } catch (error) {
//             if (error instanceof Error) {
//                 updateErrorMessage(
//                     `f;An error occurs in getting gallery data: ${error.message}.`
//                 );
//                 toErrorPage();
//             } else {
//                 updateErrorMessage(
//                     `f;An unknown type error occurs: ${error}`
//                 );
//                 toErrorPage();
//             }
//         }
//     };

//     const value: galleryContextType = { setGallery, getGallery };

//     return (
//         <GalleryContext.Provider value={value}>
//             {children}
//         </GalleryContext.Provider>
//     );
// }

// export { useGalleryContext, GalleryProvider };
