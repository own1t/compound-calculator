import { useEffect, useState } from "react";
import {
  markets,
  getEstimatedCompPerBlock,
  getEstimatedCompPerDay,
} from "../../compound";
import { formatNumber } from "../../utils";

import styles from "./CompCalculator.module.css";

const OPTION = {
  BLOCK: "BLOCK",
  DAY: "DAY",
};

const CompCalculator = ({ selectedMarket }) => {
  const [estimatedCompTotal, setEstimatedCompTotal] = useState(0);
  const [estimatedCompSupply, setEstimatedCompSupply] = useState(0);
  const [estimatedCompBorrow, setEstimatedCompBorrow] = useState(0);

  const [option, setOption] = useState(OPTION.BLOCK);
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const init = async () => {
      if (token === "") {
        setToken(selectedMarket);
      }
    };
    init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEstimatedCompTotal(0);
    setEstimatedCompSupply(0);
    setEstimatedCompBorrow(0);

    if (option === OPTION.BLOCK) {
      const result = await getEstimatedCompPerBlock(token, amount);

      setEstimatedCompTotal(
        formatNumber(result.totalEstimatedCOMPPerBlock, 10)
      );
      setEstimatedCompSupply(
        formatNumber(result.estimatedSupplyCOMPPerBlock, 10)
      );
      setEstimatedCompBorrow(
        formatNumber(result.estimatedBorrowCOMPPerBlock, 10)
      );

      return;
    } else {
      const result = await getEstimatedCompPerDay(token, amount);

      setEstimatedCompTotal(formatNumber(result.totalEstimatedCOMPPerDay, 10));
      setEstimatedCompSupply(
        formatNumber(result.estimatedSupplyCOMPPerDay, 10)
      );
      setEstimatedCompBorrow(
        formatNumber(result.estimatedBorrowCOMPPerDay, 10)
      );

      return;
    }
  };

  // const formatNumber = (number) => {
  //   return Number.parseFloat(number).toFixed(10);
  // };

  return (
    <div className={styles.compCalculator_container}>
      <form className={styles.compCalculator_form} onSubmit={handleSubmit}>
        <div className={styles.compCalculator_header}>
          <h3 className={styles.compCalculator_headerTitle}>
            Estimated COMP Calculator
          </h3>
        </div>

        <div className={styles.compCalculator_inputRow}>
          <label className={styles.compCalculator_label}>
            Total Estimated COMP
          </label>
          <input
            className={styles.compCalculator_input}
            type="number"
            value={estimatedCompTotal}
            readOnly
          />
        </div>

        <div className={styles.compCalculator_inputRow}>
          <label className={styles.compCalculator_label}>
            Estimated COMP (Supply)
          </label>
          <input
            className={styles.compCalculator_input}
            type="number"
            value={estimatedCompSupply}
            readOnly
          />
        </div>

        <div className={styles.compCalculator_inputRow}>
          <label className={styles.compCalculator_label}>
            Estimated COMP (Borrow)
          </label>
          <input
            className={styles.compCalculator_input}
            type="number"
            value={estimatedCompBorrow}
            readOnly
          />
        </div>

        <div className={styles.compCalculator_inputRow}>
          <label className={styles.compCalculator_label}>Term</label>
          <div className={styles.compCalculator_buttonWrapper}>
            <button
              className={
                option === OPTION.BLOCK
                  ? styles.compCalculator_active
                  : styles.compCalculator_button
              }
              onClick={() => setOption(OPTION.BLOCK)}
            >
              BLOCK
            </button>

            <button
              className={
                option === OPTION.DAY
                  ? styles.compCalculator_active
                  : styles.compCalculator_button
              }
              onClick={() => setOption(OPTION.DAY)}
            >
              DAY
            </button>
          </div>
        </div>

        <div className={styles.compCalculator_inputRow}>
          <label className={styles.compCalculator_label}>Token Symbol</label>
          <select
            className={styles.compCalculator_select}
            onChange={(e) => setToken(e.target.value)}
          >
            {markets.map((market, idx) => (
              <option key={idx} value={market}>
                {market}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.compCalculator_inputRow}>
          <label className={styles.compCalculator_label}>Token Amount</label>
          <input
            className={styles.compCalculator_input}
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className={styles.compCalculator_inputRow}>
          <div className={styles.compCalculator_submitLeft}></div>
          <button className={styles.compCalculator_submitRight} type="submit">
            SUBMIT
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompCalculator;
