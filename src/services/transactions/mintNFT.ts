import { toast } from 'react-toastify';
import { estimateGas, writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { encodeFunctionData } from 'viem';

import { tgtChain, config as wagmiConfig } from '@/config/wagmi';
import FACTORYABI from '@/config/abis/NFTFactory.json';

export default async(mintData:any, account:any, chainConfig:any) => {
  return new Promise(async(resolve, reject) => {
    const chainId = tgtChain.id;
    console.log(chainId);

    const ercType = '1155';

    const conditionData = [
      mintData.condition.costErc20,
      mintData.condition.collect,
      mintData.condition.maxMintAmount,
      mintData.condition.userLimitAmount,
      mintData.condition.batchNo,
      mintData.condition.ids,
      mintData.condition.prices,
      mintData.condition.amounts,
      mintData.condition.signCode,
      mintData.condition.wlSignature
    ];
    const sig = mintData.dataSignature.signature;
    console.log({ercType, conditionData, sig})

    let gas:any = 0;
    try {
      gas = await estimateGas(wagmiConfig, {
        to: chainConfig.NFTFactory,
        data: encodeFunctionData({abi: FACTORYABI, functionName: 'mintNFTWithETH', args: [ercType, conditionData, sig]}),
        account: account,
      })
    }
    catch(err) {
      console.log(err);
      return reject(err);
    }

    console.log('gas:', gas);
    if(gas == 0) {
      toast.error('RPC Error, Please Try Later');
      return reject();
    }
    else {
      let hash = null;
      await writeContract(wagmiConfig, {
        address: chainConfig.NFTFactory,
        abi: FACTORYABI,
        functionName: 'mintNFTWithETH',
        account: account,
        args: [ercType, conditionData, sig],
        gas: BigInt(parseInt(String(Number(gas) * 1.2)))
      })
      .then((res:any) => {
        console.log(res)
        hash = res;
      })
      .catch(err => {
        return reject(err);
      })

      if(hash) {
        let result:any = true;
        await waitForTransactionReceipt(wagmiConfig, {
          hash,
        })
        .then(res => {
          console.log(res);
          result = res;
        })
        .catch(err => {
          console.log(err);
          toast.warning('The contract execution has been successful. Please patiently await confirmation through block processing or consider refreshing the website.');
          // return reject(err);
        })
        return resolve(result);
      }
    }

    return reject();
  })
}