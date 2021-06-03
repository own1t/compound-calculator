import { useEffect, useState } from "react";
import Link from "next/link";
import { getCompRatePerDay } from "../../compound";

import styles from "./Header.module.css";

const Header = () => {
  const [compRate, setCompRate] = useState(0);

  useEffect(() => {
    const init = async () => {
      const compRate = await getCompRatePerDay();
      setCompRate(compRate);
    };
    init();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.header_container}>
        <div className={styles.header_left}>
          <Link href="/">
            <a>
              <img
                className={styles.header_img}
                src={`assets/comp.png`}
                alt="COMP"
              />
            </a>
          </Link>

          <Link href="/">
            <a>
              <p className={styles.header_title}>COMPOUND DASHBOARD</p>
            </a>
          </Link>
        </div>
        <div className={styles.header_right}>
          <div className={styles.header_box}>
            <p className={styles.header_boxTitle}>
              Daily Distribution:{" "}
              <span className={styles.header_compDistribution}>
                {compRate * 2} COMP
              </span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
