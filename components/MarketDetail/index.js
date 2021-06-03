import { formatNumber } from "../../utils";

import styles from "./MarketDetail.module.css";

const MarketDetail = ({ marketDetailData }) => {
  return (
    <>
      {marketDetailData && (
        <div className={styles.marketDetail_container}>
          <div className={styles.marketDetail_content}>
            <div className={styles.marketDetail_header}>
              <h3 className={styles.marketDetail_headerTitle}>
                Market Detail for {marketDetailData.symbol}
              </h3>
            </div>

            <div className={styles.marketDetail_row}>
              <span className={styles.marketDetail_label}>Price</span>
              <span className={styles.marketDetail_data}>
                ${formatNumber(marketDetailData.price, 2)}
              </span>
            </div>

            <div className={styles.marketDetail_row}>
              <span className={styles.marketDetail_label}>Reserves</span>
              <span className={styles.marketDetail_data}>
                {parseInt(marketDetailData.totalReserves).toLocaleString()}{" "}
                {marketDetailData.symbol}
              </span>
            </div>

            <div className={styles.marketDetail_row}>
              <span className={styles.marketDetail_label}>
                c{marketDetailData.symbol} Minted
              </span>
              <span className={styles.marketDetail_data}>
                {parseInt(marketDetailData.totalMintedAmount).toLocaleString()}
              </span>
            </div>

            <div className={styles.marketDetail_row}>
              <span className={styles.marketDetail_label}>Exchange Rate</span>
              <span className={styles.marketDetail_data}>
                1 {marketDetailData.symbol} ={" "}
                {formatNumber(marketDetailData.exchangeRate, 2)} c
                {marketDetailData.symbol}
              </span>
            </div>

            <div className={styles.marketDetail_row}>
              <span className={styles.marketDetail_label}>Supply COMP APY</span>
              <span className={styles.marketDetail_data}>
                {formatNumber(marketDetailData.compApy.supplyCompApy, 2)}%
              </span>
            </div>

            <div className={styles.marketDetail_row}>
              <span className={styles.marketDetail_label}>Borrow COMP APY</span>
              <span className={styles.marketDetail_data}>
                {formatNumber(marketDetailData.compApy.borrowCompApy, 2)}%
              </span>
            </div>

            <div className={styles.marketDetail_row}>
              <span className={styles.marketDetail_label}>COMP Speed</span>
              <span className={styles.marketDetail_data}>
                {marketDetailData.compSpeedPerBlock} COMP Per Block
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarketDetail;
