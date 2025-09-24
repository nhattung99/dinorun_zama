// Zama FHEVM Configuration
export const ZAMA_CONFIG = {
  // Relayer Configuration
  RELAYER_URL: "https://relayer.testnet.zama.cloud",
  
  // RPC Configuration
  SEPOLIA_RPC_URL: "https://eth-sepolia.g.alchemy.com/v2/oppYpzscO7hdTG6hopypG6Opn3Xp7lR_",
  
  // Contract Addresses
  FHEVM_CONTRACT_ADDRESS: "0x72eEA702E909599bC92f75774c5f1cE41b8B59BA",
  ZAMA_STANDARD_CONTRACT_ADDRESS: "0x62c1E5607077dfaB9Fee425a70707b545F565620",
  ZAMA_FHEVM_STANDARD_CONTRACT_ADDRESS: "0xf72e7a878eCbF1d7C5aBbd283c10e82ddA58A721",
  
  // API Keys
  ETHERSCAN_API_KEY: "SMYU9ZMV9DB55ZAFPW5JKN56S52RVBIWX6",
  
  // Private Key (for testing only - should be in .env in production)
  PRIVATE_KEY: "859b25f164df967d1b6b04b81693a9f53785a6f2b03bf3c6b20796f60ca8d814"
};

// Network Configuration
export const NETWORK_CONFIG = {
  sepolia: {
    chainId: 11155111,
    rpcUrl: ZAMA_CONFIG.SEPOLIA_RPC_URL,
    explorer: "https://sepolia.etherscan.io",
    contracts: {
      fhevm: ZAMA_CONFIG.FHEVM_CONTRACT_ADDRESS,
      zamaStandard: ZAMA_CONFIG.ZAMA_STANDARD_CONTRACT_ADDRESS,
      zamaFHEVMStandard: ZAMA_CONFIG.ZAMA_FHEVM_STANDARD_CONTRACT_ADDRESS
    }
  }
};

// Hardhat Configuration
export const HARDHAT_CONFIG = {
  mnemonic: "test test test test test test test test test test test junk",
  infuraApiKey: "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
  etherscanApiKey: ZAMA_CONFIG.ETHERSCAN_API_KEY
}; 