import styles from "./expand.module.css";
import { useEffect, useState, useRef, ReactNode } from "react";

interface childrenType {
    children: ReactNode;
}

function Expand({ children }: childrenType) {
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
            { threshold: 0 }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`${styles.expandWrapper} ${
                isVisible ? styles.visible : ""
            }`}
        >
            {children}
        </div>
    );
}

export default Expand;
