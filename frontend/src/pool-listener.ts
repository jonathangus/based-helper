import { createPublicClient, getAddress, http, PublicClient } from 'viem';
import { base } from 'viem/chains';

const poolAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'amount0',
        type: 'int256',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'amount1',
        type: 'int256',
      },
      {
        indexed: false,
        internalType: 'uint160',
        name: 'sqrtPriceX96',
        type: 'uint160',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'liquidity',
        type: 'uint128',
      },
      { indexed: false, internalType: 'int24', name: 'tick', type: 'int24' },
    ],
    name: 'Swap',
    type: 'event',
  },
] as const;

const tokenAbi = [
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Initialize the public client
const publicClient = createPublicClient({
  chain: base,
  transport: http(), // Replace with your Infura/Alchemy URL
});

const buildPagination = (input: number, perPage = 1000, max_pools = 6000) => {
  const result: number[] = [];
  for (let i = 0; i < Math.min(input, max_pools); i += perPage) {
    result.push(i);
  }
  return result;
};

const sqrtToPrice = (
  sqrt: string,
  decimals0: string,
  decimals1: string,
  token0IsInput = true
) => {
  const numerator = BigInt(sqrt) ** 2n;
  const denominator = 2n ** 192n;
  let ratio = Number(numerator) / Number(denominator);
  const shiftDecimals = Math.pow(10, Number(decimals0) - Number(decimals1));
  ratio = ratio * shiftDecimals;
  if (!token0IsInput) {
    ratio = 1 / ratio;
  }
  return ratio;
};

const delay = async (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const PER_PAGE = 1000;
const MAX_POOLS = 6000;

// Define an interface for the pool data
interface Token {
  id: string;
  symbol: string;
}

interface Pool {
  id: string;
  liquidity: string;
  token0: Token;
  token1: Token;
}

interface FactoryResponse {
  data: {
    factory: {
      poolCount: string;
    };
  };
}

interface PoolsResponse {
  data: {
    pools: Pool[];
  };
}

export const startPoolListener = async () => {
  const URL =
    'https://gateway.thegraph.com/api/0e163ea392de9fd0e95290fd0a06d71a/subgraphs/id/GqzP4Xaehti8KSfQmv3ZctFSjnSUYZ4En5NRsiTbvZpz';

  const factoryQuery = `
    {
      factory(id: "0x33128a8fC17869897dcE68Ed026d694621f6FDfD" ) {
        poolCount
      }
    }
  `;

  const factoryResults = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: factoryQuery }),
  });
  const factoryData = (await factoryResults.json()) as FactoryResponse;
  const poolCount = factoryData.data.factory.poolCount;
  console.log('poolCount', poolCount);

  const offsets = buildPagination(Number(poolCount), PER_PAGE, MAX_POOLS);
  console.log('offsetsBefore', offsets);

  const requests = offsets.map(async (offset) => {
    const testQuery = `
      {
        pools(first: ${PER_PAGE} skip: ${offset}, where:{
    volumeUSD_gt: 1000
  } ) {
          id,
          liquidity,
          token0 {
            id, symbol
          },
          token1 {
            id, symbol
          }
        }
      }
    `;
    const result = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: testQuery }),
    });
    const data = (await result.json()) as PoolsResponse;
    return data.data.pools;
  });

  const poolDatas = await Promise.all(requests);
  const poolData = poolDatas.flat();

  await addListeners(poolData, publicClient);
};

async function addListeners(poolData: Pool[], client: PublicClient) {
  console.log('poolData', poolData.length);
  const addresses = poolData.map((pool) => getAddress(pool.id));
  console.log('addresses', addresses);

  client.watchContractEvent({
    address: addresses,
    abi: poolAbi,
    eventName: 'Swap',
    onLogs: (logs) => {
      console.log('Detected Swap events:', logs);
      for (const log of logs) {
        const priceRatio = sqrtToPrice(
          log.args.sqrtPriceX96!.toString(),
          '18',
          '18'
        );
        console.log(
          `Pool: ${log.address} |`,
          `Price: ${priceRatio.toString()} |`,
          `From: ${log.args.sender}`
        );
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return;
  for (const data of poolData) {
    try {
      const token0Symbol = data.token0.symbol;
      const token1Symbol = data.token1.symbol;

      try {
        const [token0Decimals, token1Decimals] = await client.multicall({
          contracts: [
            {
              address: data.token0.id as `0x${string}`,
              abi: tokenAbi,
              functionName: 'decimals',
            },
            {
              address: data.token1.id as `0x${string}`,
              abi: tokenAbi,
              functionName: 'decimals',
            },
          ],
        });

        // const token1Decimals = await client.readContract({
        //   address: data.token1.id as `0x${string}`,
        //   abi: tokenAbi,
        //   functionName: 'decimals',
        // });

        client.watchContractEvent({
          address: data.id as `0x${string}`,
          abi: poolAbi,
          eventName: 'Swap',
          onLogs: (logs) => {
            for (const log of logs) {
              const priceRatio = sqrtToPrice(
                log.args.sqrtPriceX96!.toString(),
                '18',
                token1Decimals?.result?.toString() || '18'
              );
              console.log(
                `Pool: ${token0Symbol}/${token1Symbol} |`,
                `Price: ${priceRatio.toString()} |`,
                `From: ${log.args.sender}`
              );
            }
          },
        });
      } catch (e) {
        console.error(e);
      }

      console.log(`${token0Symbol}/${token1Symbol} added`);
    } catch (err) {
      console.log('failed:', err.message);
    }
    await delay(100);
  }

  console.log('complete');
}
