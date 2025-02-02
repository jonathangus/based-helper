import { http } from 'viem';

import { createPaymasterClient } from 'viem/account-abstraction';

export const paymasterClient = createPaymasterClient({
  transport: http(process.env.PAYMASTER_SERVICE_URL!),
});

export const revalidate = 60;

export async function handler(req: Request) {
  console.log(req.body);
  console.log(req.method);
  const method = req.method;

  console.log(req.url);
}
export async function POST(req: Request) {
  console.log(req.body);

  console.log(req.method);
  const method = req.method;

  console.log(req.url);
  const [userOp, entrypoint, chainId] = req.params;
  //   const sponsorable = await willSponsor({ chainId, entrypoint, userOp });
  //   if (!sponsorable) {
  //     return Response.json({ error: 'Not a sponsorable operation' });
  //   }

  console.log({ userOp });
  if (method === 'pm_getPaymasterStubData') {
    const result = await paymasterClient.getPaymasterStubData({
      userOperation: userOp,
    });
    return Response.json({ result });
  } else if (method === 'pm_getPaymasterData') {
    const result = await paymasterClient.getPaymasterData({
      userOperation: userOp,
    });
    return Response.json({ result });
  }
  return Response.json({ error: 'Method not found' });
}
