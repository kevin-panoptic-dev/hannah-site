import styles from "./gallery.module.css";
import { useEffect, useRef, useState } from "react";
import Three from "../three/three";
import { useNavigate } from "react-router-dom";
import { useErrorContext } from "../../../components/context/error";
import LoadingIndicator from "../../loading/loading";
import api from "../../../utilities/api/api";
import { GALLERY_PATH } from "../../../utilities/constants";
import { galleryCardType, galleryResponseType } from "./type";
// import { useNavbarContext } from "../../../components/context/navbar";
// import { useGalleryContext } from "../../../components/context/gallery";

function Gallery() {
    // const { setGallery, getGallery } = useGalleryContext();
    const threeRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const { updateErrorMessage } = useErrorContext();
    // const { show, hide } = useNavbarContext();
    const toErrorPage = () => navigate("/error");

    const [loading, setLoading] = useState(false);
    const [galleryCards, setGalleryCards] = useState<
        galleryCardType[] | undefined
    >(undefined);

    useEffect(() => {
        const performFetch = async () => {
            const response: galleryResponseType = await api.get(
                GALLERY_PATH
            );
            if (response.status === 200) {
                setGalleryCards(response.data.detail);
            } else {
                updateErrorMessage(
                    `b; ${response.status} Error: ${response.data.detail}`
                );
                toErrorPage();
            }
        };

        const main = () => {
            try {
                setLoading(true);
                performFetch();
            } catch (error) {
                if (error instanceof Error) {
                    updateErrorMessage(
                        `f;An error occurs in fetching gallery data: ${error.message}.`
                    );
                    toErrorPage();
                } else {
                    updateErrorMessage(
                        `f;An unknown type error occurs: ${error}`
                    );
                    toErrorPage();
                }
            } finally {
                setLoading(false);
            }
        };

        galleryCards || main();
    }, []);

    useEffect(() => {
        if (threeRef.current && !loading && galleryCards) {
            Three({
                container: threeRef.current,
                cards: galleryCards,
            });
        }
    }, [loading, galleryCards]);

    // useEffect(() => {
    //     hide();
    //     console.log(
    //         `Component mounted: ${JSON.stringify(location, null, 2)}`
    //     );
    //     return () => {
    //         console.log("Component mounted");
    //         localStorage.removeItem("navbarVisible");
    //         show();
    //     };
    // }, [location]);

    if (loading || !galleryCards) {
        return (
            <LoadingIndicator message="ready to see our 3D page?"></LoadingIndicator>
        );
    } else {
        return (
            <div className={styles.change_container} ref={threeRef} />
        );
    }
}

export default Gallery;
