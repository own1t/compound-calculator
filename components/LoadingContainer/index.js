import styles from "./LoadingContainer.module.css";

const LoadingContainer = () => {
  return (
    <div className={styles.loadingContainer}>
      <p className={styles.loadingContainer_text}>Loading...</p>
    </div>
  );
};

export default LoadingContainer;
