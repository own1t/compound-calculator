import Compound from "@compound-finance/compound-js";

const provider = process.env.INFURA_URL;

const comptroller = Compound.util.getAddress(Compound.Comptroller);
const oracle = "0x4007B71e01424b2314c020fB0344b03A7C499E1A";

const ethMantissa = Math.pow(10, 18);
const cTokenDecimals = 8;
const blocksPerDay = 6570;
const daysPerYear = 365;

// Market List

const getSupplyApy = async (cTokenAddress) => {
  const supplyRatePerBlock = await Compound.eth.read(
    cTokenAddress,
    "function supplyRatePerBlock() returns (uint)",
    [],
    { provider }
  );

  const supplyApy =
    (Math.pow(
      (supplyRatePerBlock / ethMantissa) * blocksPerDay + 1,
      daysPerYear
    ) -
      1) *
    100;

  return supplyApy;
};

const getBorrowApy = async (cTokenAddress) => {
  const borrowRatePerBlock = await Compound.eth.read(
    cTokenAddress,
    "function borrowRatePerBlock() returns (uint)",
    [],
    { provider }
  );

  const borrowApy =
    (Math.pow(
      (borrowRatePerBlock / ethMantissa) * blocksPerDay + 1,
      daysPerYear
    ) -
      1) *
    100;

  return borrowApy;
};

const getTotalSupplyInUSD = async (cTokenAddress, underlyingDecimals) => {
  let totalSupply = await Compound.eth.read(
    cTokenAddress,
    "function totalSupply() public view returns (uint)",
    [],
    { provider }
  );

  let exchangeRate = await Compound.eth.read(
    cTokenAddress,
    "function exchangeRateCurrent() public view returns (uint)",
    [],
    { provider }
  );

  let underlyingPrice = await Compound.eth.read(
    oracle,
    "function getUnderlyingPrice(address cTokenAddress) external view returns (uint)",
    [cTokenAddress],
    { provider }
  );

  const mantissa = Math.pow(10, 36 - underlyingDecimals);
  underlyingPrice = +underlyingPrice.toString() / mantissa;

  exchangeRate = +exchangeRate.toString() / Math.pow(10, underlyingDecimals);

  const fixedTotalSupplyInUSD =
    (+totalSupply.toString() * exchangeRate * underlyingPrice) / ethMantissa;

  return fixedTotalSupplyInUSD;
};

const getTotalSupply = async (cTokenAddress, underlyingDecimals) => {
  const exchangeRate = await getExchangeRate(cTokenAddress, underlyingDecimals);

  let totalSupply = await Compound.eth.read(
    cTokenAddress,
    "function totalSupply() public view returns (uint)",
    [],
    { provider }
  );

  totalSupply = +totalSupply.toString();
  const fixedTotalSupply = totalSupply / exchangeRate / Math.pow(10, 8);

  return fixedTotalSupply;
};

const getTotalBorrow = async (cTokenAddress, underlyingDecimals) => {
  let totalBorrow = await Compound.eth.read(
    cTokenAddress,
    "function totalBorrows() public view returns (uint)",
    [],
    { provider }
  );

  totalBorrow = +totalBorrow.toString() / 10 ** underlyingDecimals;

  return totalBorrow;
};

const getTotalBorrowInUSD = async (cTokenAddress, underlyingDecimals) => {
  let totalBorrow = await Compound.eth.read(
    cTokenAddress,
    "function totalBorrows() public view returns (uint)",
    [],
    { provider }
  );

  let underlyingPrice = await Compound.eth.read(
    oracle,
    "function getUnderlyingPrice(address cTokenAddress) external view returns (uint)",
    [cTokenAddress],
    { provider }
  );

  const mantissa = Math.pow(10, 36 - underlyingDecimals);
  underlyingPrice = +underlyingPrice.toString() / mantissa;

  totalBorrow = +totalBorrow.toString() / 10 ** underlyingDecimals;
  const fixedTotalBorrow = totalBorrow * underlyingPrice;

  return fixedTotalBorrow;
};

const getCompRatePerDay = async () => {
  let compRate = await Compound.eth.read(
    comptroller,
    "function compRate() public view returns (uint)",
    [],
    { provider }
  );

  compRate = +compRate.toString() / ethMantissa;
  const compRatePerDay = compRate * blocksPerDay;

  return compRatePerDay;
};

const getCompSpeedPerDay = async (cTokenAddress) => {
  let compSpeed = await Compound.eth.read(
    comptroller,
    "function compSpeeds(address cTokenAddress) public view returns (uint)",
    [cTokenAddress],
    { provider }
  );

  compSpeed = +compSpeed.toString() / ethMantissa;
  const compSpeedPerDay = compSpeed * blocksPerDay;

  return compSpeedPerDay;
};

// Market Detail

const getUnderlyingPrice = async (cTokenAddress, underlyingDecimals) => {
  let underlyingPrice = await Compound.eth.read(
    oracle,
    "function getUnderlyingPrice(address cTokenAddress) external view returns (uint)",
    [cTokenAddress],
    { provider }
  );

  const mantissa = Math.pow(10, 36 - underlyingDecimals);
  underlyingPrice = +underlyingPrice.toString() / mantissa;

  return underlyingPrice;
};

const getTotalReserves = async (cTokenAddress, underlyingDecimals) => {
  let totalReserves = await Compound.eth.read(
    cTokenAddress,
    "function totalReserves() public view returns (uint)",
    [],
    { provider }
  );
  totalReserves = +totalReserves.toString() / Math.pow(10, underlyingDecimals);
  return totalReserves;
};

const getCTokenTotalSupply = async (cTokenAddress) => {
  let totalSupply = await Compound.eth.read(
    cTokenAddress,
    "function totalSupply() public view returns (uint)",
    [],
    { provider }
  );

  totalSupply = +totalSupply.toString() / Math.pow(10, cTokenDecimals);
  return totalSupply;
};

const getExchangeRate = async (cTokenAddress, underlyingDecimals) => {
  const exchangeRateCurrent = await Compound.eth.read(
    cTokenAddress,
    "function exchangeRateCurrent() public view returns (uint)",
    [],
    { provider }
  );

  const mantissa = 18 + underlyingDecimals - cTokenDecimals;
  //   const oneCTokenInUnderlying = exchangeRateCurrent / Math.pow(10, mantissa);
  const cTokensInOneUnderlying = Math.pow(10, mantissa) / exchangeRateCurrent;

  return cTokensInOneUnderlying;
};

const getCompSpeedPerBlock = async (cTokenAddress) => {
  let compSpeed = await Compound.eth.read(
    comptroller,
    "function compSpeeds(address cTokenAddress) public view returns (uint)",
    [cTokenAddress],
    { provider }
  );
  compSpeed = +compSpeed.toString() / ethMantissa;
  return compSpeed;
};

const getMarketListData = async (underlyingSymbol) => {
  const cTokenSymbol = "c" + underlyingSymbol;

  let underlyingDecimals = Compound.decimals[underlyingSymbol];
  let cTokenAddress = Compound.util.getAddress(cTokenSymbol);

  if (underlyingSymbol === "LINK") {
    cTokenAddress = "0xface851a4921ce59e912d19329929ce6da6eb0c7";
  } else if (underlyingSymbol === "WBTC") {
    cTokenAddress = "0xccf4429db6322d5c611ee964527d42e5d685dd6a";
  } else if (underlyingSymbol === "TUSD") {
    cTokenAddress = "0x12392f67bdf24fae0af363c24ac620a2f67dad86";
    underlyingDecimals = 18;
  }

  const [
    supplyApy,
    borrowApy,
    totalSupplyInUSD,
    totalBorrowInUSD,
    compSpeedPerDay,
  ] = await Promise.all([
    getSupplyApy(cTokenAddress),
    getBorrowApy(cTokenAddress),
    getTotalSupplyInUSD(cTokenAddress, underlyingDecimals),
    getTotalBorrowInUSD(cTokenAddress, underlyingDecimals),
    getCompSpeedPerDay(cTokenAddress),
  ]);

  return {
    symbol: underlyingSymbol,
    supplyApy,
    borrowApy,
    totalSupplyInUSD,
    totalBorrowInUSD,
    compSpeedPerDay,
  };
};

const getMarketDetailData = async (underlyingSymbol) => {
  const cTokenSymbol = "c" + underlyingSymbol;

  let underlyingDecimals = Compound.decimals[underlyingSymbol];
  let cTokenAddress = Compound.util.getAddress(cTokenSymbol);

  if (underlyingSymbol === "LINK") {
    cTokenAddress = "0xface851a4921ce59e912d19329929ce6da6eb0c7";
  } else if (underlyingSymbol === "WBTC") {
    cTokenAddress = "0xccf4429db6322d5c611ee964527d42e5d685dd6a";
  } else if (underlyingSymbol === "TUSD") {
    cTokenAddress = "0x12392f67bdf24fae0af363c24ac620a2f67dad86";
    underlyingDecimals = 18;
  }

  const [
    price,
    totalReserves,
    totalMintedAmount,
    exchangeRate,
    compSpeedPerBlock,
    compApy,
  ] = await Promise.all([
    getUnderlyingPrice(cTokenAddress, underlyingDecimals),
    getTotalReserves(cTokenAddress, underlyingDecimals),
    getCTokenTotalSupply(cTokenAddress),
    getExchangeRate(cTokenAddress, underlyingDecimals),
    getCompSpeedPerBlock(cTokenAddress),
    getCompApy(cTokenAddress, underlyingDecimals),
  ]);

  return {
    symbol: underlyingSymbol,
    price,
    totalReserves,
    totalMintedAmount,
    exchangeRate,
    compSpeedPerBlock,
    compApy,
  };
};

const getEstimatedCompPerBlock = async (underlyingSymbol, underlyingAmount) => {
  const cTokenSymbol = "c" + underlyingSymbol;

  let underlyingDecimals = Compound.decimals[underlyingSymbol];
  let cTokenAddress = Compound.util.getAddress(cTokenSymbol);

  if (underlyingSymbol === "LINK") {
    cTokenAddress = "0xface851a4921ce59e912d19329929ce6da6eb0c7";
  } else if (underlyingSymbol === "WBTC") {
    cTokenAddress = "0xccf4429db6322d5c611ee964527d42e5d685dd6a";
  } else if (underlyingSymbol === "TUSD") {
    cTokenAddress = "0x12392f67bdf24fae0af363c24ac620a2f67dad86";
    underlyingDecimals = 18;
  }

  const compSpeed = await getCompSpeedPerBlock(cTokenAddress);

  const totalSupply = await getTotalSupply(cTokenAddress, underlyingDecimals);
  const estimatedSupplyMarketShare = underlyingAmount / totalSupply;
  const estimatedSupplyCOMPPerBlock = estimatedSupplyMarketShare * compSpeed;

  const totalBorrow = await getTotalBorrow(cTokenAddress, underlyingDecimals);
  const estimatedBorrowMarketShare = underlyingAmount / totalBorrow;
  const estimatedBorrowCOMPPerBlock = estimatedBorrowMarketShare * compSpeed;

  const totalEstimatedCOMPPerBlock =
    estimatedSupplyCOMPPerBlock + estimatedBorrowCOMPPerBlock;

  return {
    estimatedSupplyCOMPPerBlock,
    estimatedBorrowCOMPPerBlock,
    totalEstimatedCOMPPerBlock,
  };
};

const getEstimatedCompPerDay = async (underlyingSymbol, underlyingAmount) => {
  const cTokenSymbol = "c" + underlyingSymbol;

  let underlyingDecimals = Compound.decimals[underlyingSymbol];
  let cTokenAddress = Compound.util.getAddress(cTokenSymbol);

  if (underlyingSymbol === "LINK") {
    cTokenAddress = "0xface851a4921ce59e912d19329929ce6da6eb0c7";
  } else if (underlyingSymbol === "WBTC") {
    cTokenAddress = "0xccf4429db6322d5c611ee964527d42e5d685dd6a";
  } else if (underlyingSymbol === "TUSD") {
    cTokenAddress = "0x12392f67bdf24fae0af363c24ac620a2f67dad86";
    underlyingDecimals = 18;
  }

  const compSpeed = await getCompSpeedPerDay(cTokenAddress);

  const totalSupply = await getTotalSupply(cTokenAddress, underlyingDecimals);
  const estimatedSupplyMarketShare = underlyingAmount / totalSupply;
  const estimatedSupplyCOMPPerDay = estimatedSupplyMarketShare * compSpeed;

  const totalBorrow = await getTotalBorrow(cTokenAddress, underlyingDecimals);
  const estimatedBorrowMarketShare = underlyingAmount / totalBorrow;
  const estimatedBorrowCOMPPerDay = estimatedBorrowMarketShare * compSpeed;

  const totalEstimatedCOMPPerDay =
    estimatedSupplyCOMPPerDay + estimatedBorrowCOMPPerDay;

  return {
    totalEstimatedCOMPPerDay,
    estimatedSupplyCOMPPerDay,
    estimatedBorrowCOMPPerDay,
  };
};

const getCompApy = async (cTokenAddress, underlyingDecimals) => {
  const cCompAddress = "0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4";

  const compPrice = await getUnderlyingPrice(cCompAddress, 18);
  const compPerDay = await getCompSpeedPerDay(cTokenAddress);

  const totalSupplyInUSD = await getTotalSupplyInUSD(
    cTokenAddress,
    underlyingDecimals
  );

  const totalBorrowInUSD = await getTotalBorrowInUSD(
    cTokenAddress,
    underlyingDecimals
  );

  const supplyCompApy =
    365 * ((compPerDay * compPrice) / totalSupplyInUSD) * 100;
  const borrowCompApy =
    365 * ((compPerDay * compPrice) / totalBorrowInUSD) * 100;

  return { supplyCompApy, borrowCompApy };
};

const getSupplyCompApy = async (underlyingSymbol) => {
  const cTokenSymbol = "c" + underlyingSymbol;
  const cCompAddress = "0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4";

  let underlyingDecimals = Compound.decimals[underlyingSymbol];
  let cTokenAddress = Compound.util.getAddress(cTokenSymbol);

  if (underlyingSymbol === "LINK") {
    cTokenAddress = "0xface851a4921ce59e912d19329929ce6da6eb0c7";
  } else if (underlyingSymbol === "WBTC") {
    cTokenAddress = "0xccf4429db6322d5c611ee964527d42e5d685dd6a";
  } else if (underlyingSymbol === "TUSD") {
    cTokenAddress = "0x12392f67bdf24fae0af363c24ac620a2f67dad86";
    underlyingDecimals = 18;
  }

  const totalSupplyInUSD = await getTotalSupplyInUSD(
    cTokenAddress,
    underlyingDecimals
  );

  const compPrice = await getUnderlyingPrice(cCompAddress, 18);
  const compPerDay = await getCompSpeedPerDay(cTokenAddress);

  const compApy = 365 * ((compPerDay * compPrice) / totalSupplyInUSD) * 100;

  return compApy;
};

const getBorrowCompApy = async (underlyingSymbol) => {
  const cTokenSymbol = "c" + underlyingSymbol;
  const cCompAddress = "0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4";

  let underlyingDecimals = Compound.decimals[underlyingSymbol];
  let cTokenAddress = Compound.util.getAddress(cTokenSymbol);

  if (underlyingSymbol === "LINK") {
    cTokenAddress = "0xface851a4921ce59e912d19329929ce6da6eb0c7";
  } else if (underlyingSymbol === "WBTC") {
    cTokenAddress = "0xccf4429db6322d5c611ee964527d42e5d685dd6a";
  } else if (underlyingSymbol === "TUSD") {
    cTokenAddress = "0x12392f67bdf24fae0af363c24ac620a2f67dad86";
    underlyingDecimals = 18;
  }

  const totalBorrowInUSD = await getTotalBorrowInUSD(
    cTokenAddress,
    underlyingDecimals
  );

  const compPrice = await getUnderlyingPrice(cCompAddress, 18);
  const compPerDay = await getCompSpeedPerDay(cTokenAddress);

  const compApy = 365 * ((compPerDay * compPrice) / totalBorrowInUSD) * 100;

  return compApy;
};

const markets = [
  "BAT",
  "COMP",
  "DAI",
  "ETH",
  "LINK",
  "TUSD",
  "UNI",
  "USDC",
  "USDT",
  "WBTC",
  "ZRX",
];

export {
  markets,
  getCompRatePerDay,
  getMarketListData,
  getMarketDetailData,
  getEstimatedCompPerBlock,
  getEstimatedCompPerDay,
  getSupplyApy,
  getBorrowApy,
};
