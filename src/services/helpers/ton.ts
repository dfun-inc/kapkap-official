// utils/getUserNfts.ts
import { TonClient, Address } from "@ton/ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { Cell } from "@ton/core";

/** 转换 IPFS 链接为 HTTP 链接 */
function normalizeIpfsUrl(url?: string): string | null {
  if (!url) return null;
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return url;
}

/** 解析 TON Cell 中的字符串 */
function readStringFromCell(cell: any): string {
  const decoder = new TextDecoder();
  let result = "";

  const readCell = (c: any) => {
    const slice = c.beginParse();
    const arr = slice.array || [];
    result += decoder.decode(arr);
    if (c.refs && c.refs.length > 0) {
      readCell(c.refs[0]);
    }
  };

  readCell(cell);
  return result.replace(/\0/g, "").trim();
}

/** 从单个 NFT 合约地址中获取 NFT 的 metadata URL */
export async function getNftItemUrl(client: TonClient, nftAddress: string) {
  const address = Address.parse(nftAddress);
  console.log(address)

  const res = await client.runMethod(address, "get_nft_data");
  // 部分合约布局不同，可打印 res.stack 看哪个 index 是 content
  const stack = res.stack;
  console.log(stack)
  const contentCell = stack.readCell();
  console.log(contentCell)

  const content = readStringFromCell(contentCell);
  console.log(content)
  return normalizeIpfsUrl(content);
}

/** 获取某个合集(collection)中属于指定钱包的所有 NFT */
export async function getUserNftsInCollection(nftAddr: any[]) {
  const endpoint = await getHttpEndpoint({ network: "mainnet" });
  const client = new TonClient({ endpoint });
  let nftItems: any[] = [];

  for (let i = 0; i < nftAddr.length; i++) {
    try {
      /*
      // 获取第 i 个 NFT 地址
      const res = await client.runMethod(collection, "get_nft_address_by_index", [
        { type: "int", value: BigInt(i) },
      ]);

      const nftAddr = res.stack.readAddress().toString();
      */
      console.log(nftAddr[i]?.address)
      console.log(Address.parse(nftAddr[i]?.address))
      const nftRes = await client.runMethod(Address.parse(nftAddr[i]?.address), "get_nft_data");
      console.log(nftRes)
      console.log(nftRes.stack)
      return;

      // 4. 解析 Cell 数据，得到 metadata URI
      const intValue = nftRes.stack.readBigNumber(); // 或者 stack.readInt()，根据返回类型选择
      console.log("Integer value (token ID or index):", intValue.toString());

      const contentCell = nftRes.stack.readCell();
      console.log(contentCell)
      const metadataUri = readStringFromCell(contentCell);
      console.log(metadataUri)

      /*
      // 结构通常是： [init, index, collection, owner, content]
      const nftStack = nftRes.stack;
      console.log(nftStack)
      nftStack.readBoolean(); // skip initialized flag
      const index = Number(nftStack.readBigNumber());
      nftStack.readAddress(); // skip collection
      const owner = nftStack.readAddress().toString();
      const contentCell = nftStack.readCell();
      const content = readStringFromCell(contentCell);
      const contentUrl = normalizeIpfsUrl(content);
      console.log(contentUrl)
      */

      nftItems.push({});
    } catch (e) {
      console.warn("Error reading NFT", i, e);
    }
  }


  console.log(nftItems)

  return nftItems;
}
