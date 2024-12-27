import styles from "./fade.module.css";
import { useEffect, useState, useRef, ReactNode } from "react";

interface childrenType {
    children: ReactNode;
}

function Fade({ children }: childrenType) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return <div className={`${styles.fadeWrapper} ${isVisible ? "visible" : ""}`}>{children}</div>;
}

export default Fade;
