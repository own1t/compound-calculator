import { useEffect, useState } from "react";
import { getMarketDetailData, getMarketListData } from "../compound";

import Layout from "../components/Layout";
import MarketList from "../components/MarketList";
import MarketDetail from "../components/MarketDetail";
import CompCalculator from "../components/CompCalculator";
import LoadingContainer from "../components/LoadingContainer";

export default function Home({ marketListData }) {
  const [marketDetailData, setMarketDetailData] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState("");

  useEffect(() => {
    const init = async () => {
      const marketDetailData = await getMarketDetailData("BAT");

      setSelectedMarket("BAT");
      setMarketDetailData(marketDetailData);
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      const marketDetailData = await getMarketDetailData(selectedMarket);

      setMarketDetailData(marketDetailData);
    };
    if (selectedMarket !== "") {
      init();
    }
  }, [selectedMarket]);

  if (!marketListData || !marketDetailData) {
    return <LoadingContainer />;
  }

  return (
    <Layout>
      <div className="content_market">
        <div className="content_marketList">
          <MarketList
            marketListData={marketListData}
            setSelectedMarket={setSelectedMarket}
          />
        </div>
        <div className="content_marketDetail">
          <MarketDetail
            marketDetailData={marketDetailData}
            selectedMarket={selectedMarket}
          />
          <CompCalculator selectedMarket={selectedMarket} />
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const marketListData = await Promise.all([
    getMarketListData("BAT"),
    getMarketListData("COMP"),
    getMarketListData("DAI"),
    getMarketListData("ETH"),
    getMarketListData("LINK"),
    getMarketListData("TUSD"),
    getMarketListData("UNI"),
    getMarketListData("USDC"),
    getMarketListData("USDT"),
    getMarketListData("WBTC"),
    getMarketListData("ZRX"),
  ]);

  return {
    props: {
      marketListData,
    },
  };
};
