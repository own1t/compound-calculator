import { formatNumber } from "../../utils";

import styles from "./MarketList.module.css";

const MarketList = ({ marketListData, setSelectedMarket }) => {
  const formatUSDPrice = (number) => {
    return (Number.parseInt(number) / Math.pow(10, 6)).toFixed(2);
  };

  return (
    <div className={styles.marketList_container}>
      <ul className={styles.marketList}>
        <li className={styles.market_header}>
          <span className={styles.market_img}></span>
          <span className={styles.market_symbol}>Market</span>
          <span className={styles.market_totalSupply}>Total Supply</span>
          <span className={styles.market_supplyAPY}>Supply APY</span>
          <span className={styles.market_totalBorrow}>Total Borrow</span>
          <span className={styles.market_borrowAPY}>Borrow APY</span>
          <span className={styles.market_compSpeed}>
            COMP Distribution (Per Day)
          </span>
        </li>

        {marketListData &&
          marketListData.map((data, idx) => (
            <li
              className={styles.market_item}
              key={idx}
              onClick={() => setSelectedMarket(data.symbol)}
            >
              <span className={styles.market_logo}>
                <img
                  className={styles.market_img}
                  src={`assets/${data.symbol.toLowerCase()}.png`}
                  alt={data.symbol}
                />
              </span>
              <span className={styles.market_symbol}>{data.symbol}</span>
              <span className={styles.market_totalSupply}>
                ${formatUSDPrice(data.totalSupplyInUSD)}M
              </span>
              <span className={styles.market_supplyAPY}>
                {formatNumber(data.supplyApy, 2)}%
              </span>
              <span className={styles.market_totalBorrow}>
                ${formatUSDPrice(data.totalBorrowInUSD)}M
              </span>
              <span className={styles.market_borrowAPY}>
                {formatNumber(data.borrowApy, 2)}%
              </span>
              <span className={styles.market_compSpeed}>
                {formatNumber(data.compSpeedPerDay * 2, 2)} COMP
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default MarketList;
