import styles from "./loading.module.css";

interface messageType {
    message: string;
}

function LoadingIndicator({ message }: messageType) {
    return (
        <div className={styles.change_container}>
            <div className={styles.wrapper}>
                <p className={styles.title}>Loading...</p>
                <p className={styles.content}>{message}</p>
            </div>
        </div>
    );
}

export default LoadingIndicator;
