# 🏁 Crypto Race Zama - Blockchain Game

An encrypted and provably fair dodge racing experience, developed with Zama’s FHEVM, offering confidential rewards and secure gameplay on Ethereum.

### 🔐 **Confidential Gameplay Model**
- **On-Chain Encrypted State**: Player information (races, pending ETH, scores) is fully protected with encryption on the blockchain.
- **Confidential Actions**: Every in-game move is executed using encrypted inputs.
- **ZK Verification**: Gameplay can be validated through zero-knowledge proofs without exposing the race results.
- **Player-Controlled Decryption**: Users have full authority to decrypt and access their own data.

### 🎮 **How to Play**
- **Dodge Race Gameplay**:
  - Control your racer with arrow keys or WASD
  - Dodge obstacles in 3 lanes for 15 seconds
  - Score points by successfully avoiding obstacles
  - Difficulty increases over time (faster obstacles, more frequent spawns)
- **Race Rewards**: Score-based ETH rewards and daily leaderboard competitions
- **KMS Claim System**: Decentralized ETH claiming with Key Management Service

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask wallet
- Sepolia ETH for gas fees

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/hoasine/cryptoracezama.git
cd cryptoracezama
```

2. **Install dependencies**
```bash
# Frontend
cd frontend-fhe-race
npm install

# Backend (optional)
cd ../server
npm install
```

3. **Configure environment**
```bash
# Copy .env.example to .env
cp .env.example .env

# Update with your configuration
REACT_APP_FHEVM_CONTRACT_ADDRESS=0x561D05BbaE5a2D93791151D02393CcD26d9749a2
REACT_APP_RELAYER_URL=https://relayer.testnet.zama.cloud
REACT_APP_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
REACT_APP_ETHERSCAN_API_KEY=your-etherscan-api-key
```

4. **Start the application**
```bash
# Frontend
cd frontend-fhe-race
npm start

# Backend (optional)
cd ../server
npm start
```

5. **Connect your wallet**
- Open MetaMask and connect to Sepolia Testnet
- Connect your wallet to the application
- Grant user-decrypt authorization when prompted

## 🎯 How to Play

### 1. **Get Started**
- Connect your MetaMask wallet
- Perform daily check-in to receive free races

### 2. **Play the Dodge Race**
- Click "Start Race" to begin the 15-second dodge game
- Use arrow keys or WASD to move between 3 lanes
- Dodge obstacles to score points (difficulty increases over time)
- Your score determines your rewards

### 3. **Claim Rewards**
- **ETH Rewards**: Use the "Claim ETH" button to withdraw to your wallet
- **Leaderboard**: Publish your score to compete with others

## 🔧 Smart Contracts

### Contract Addresses
```
Sepolia: 0x561D05BbaE5a2D93791151D02393CcD26d9749a2 (CryptoRaceFHE_KMS_Final)
```

### Key Functions
- `raceLite()` - Consume a race and compute outcome
- `settlePrize(uint8 slot)` - Apply rewards based on race performance
- `dailyGm()` - Daily check-in for free races
- `requestClaimETH(uint256 amountWei)` - Request ETH withdrawal
- `getUserRaces(address user)` - Get encrypted race count
- `getEncryptedPendingEthWei(address user)` - Get encrypted pending ETH
- `getEncryptedScore(address user)` - Get encrypted score

## 🛠️ Development

### Project Structure
```
luckyracegameFHE/
├── contracts/                    # Smart contracts
├── frontend-fhe-race/           # React frontend
├── server/                      # Express API server
├── deploy/                      # Deployment scripts
├── scripts/                     # Utility scripts
└── README.md
```

### Development Commands
```bash
# Compile contracts
npx hardhat compile

# Deploy to Sepolia
npx hardhat run deploy/06b_deploy_kms_final_js.js --network sepolia

# Start frontend
cd frontend-fhe-race
npm start

# Build for production
cd frontend-fhe-race
npm run build
```

## 🔒 Security Features

- **Encryption**: All sensitive data encrypted on-chain using FHE
- **Access Control**: ACL system for data permissions
- **Verification**: EIP-712 signatures for secure authorization
- **Commitment Scheme**: For race outcomes

## 🌐 Network Configuration

### Sepolia Testnet
- **RPC URL**: `https://rpc.sepolia.org`
- **Chain ID**: 11155111
- **Block Explorer**: https://sepolia.etherscan.io
- **Faucet**: https://sepoliafaucet.com

## Acknowledgments

- **Zama Team** - For the amazing FHEVM technology
- **Ethereum Foundation** - For the blockchain infrastructure
- **MetaMask** - For wallet integration

## Created by: [hoatranrom](https://x.com/HoaTranRom)
