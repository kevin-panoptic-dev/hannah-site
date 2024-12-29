import styles from "./loading.module.css";

function LoadingIndicator() {
    return (
        <div className={styles.change_container}>
            <div className={styles.wrapper}>
                <p className={styles.title}>Loading...</p>
                <p className={styles.content}>next page is more splendid</p>
            </div>
        </div>
    );
}

export default LoadingIndicator;
