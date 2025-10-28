# 🦖 Crypto Dino Run - Blockchain Game

An encrypted and provably fair endless runner game (Dinosaur Game style), developed with Zama's FHEVM, offering confidential rewards and secure gameplay on Ethereum.

## 🎮 Live Demo

**Play Now**: [https://zamafhe-silk.vercel.app/](https://zamafhe-silk.vercel.app/)

- Tutorial: Use arrow keys or WASD to control your racer

### 🔐 **Confidential Gameplay Model**
- **On-Chain Encrypted State**: Player information (races, pending ETH, scores) is fully protected with encryption on the blockchain.
- **Confidential Actions**: Every in-game move is executed using encrypted inputs.
- **ZK Verification**: Gameplay can be validated through zero-knowledge proofs without exposing the race results.
- **Player-Controlled Decryption**: Users have full authority to decrypt and access their own data.

### 🎮 **How to Play**
- **Dino Run Gameplay** (inspired by Chrome Dinosaur Game):
  - Press Space, Up Arrow, or W to jump
  - **Avoid cactus on the ground** - jump to dodge them
  - **Score increases continuously** as you run (distance-based)
  - Stay on ground when cactus passes = HIT!
  - Speed increases over time
  - Game lasts 15 seconds with increasing difficulty
- **Game Rewards**: Score-based ETH rewards and daily leaderboard competitions
- **KMS Claim System**: Decentralized ETH claiming with Key Management Service

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MetaMask wallet
- Sepolia ETH for gas fees

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/nhattung99/dinorun_zama.git
cd zamafhe
```

2. **Install dependencies**
```bash
# Frontend
cd frontend-the-race
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
cd frontend-the-race
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
- Buy plays from your wallet to start playing

### 2. **Play the Dino Run**
- Click "🦖 Start Running" to begin the 15-second running game
- Press Space, Up Arrow, or W to jump
- **Jump to avoid cactus on the ground**
- **Score increases automatically** as you run (distance-based scoring)
- Stay on ground when cactus passes = HIT!
- Speed and difficulty increase over time (faster cactus, more frequent spawns)
- Your total score determines your rewards

### 3. **Submit Score & Compete**
- **Submit Total Score**: After playing multiple rounds, submit your accumulated score to the wallet
- **Leaderboard**: Your published score appears on the leaderboard to compete with others

## 🔧 Smart Contracts

### Contract Addresses
```
Sepolia: 0x561D05BbaE5a2D93791151D02393CcD26d9749a2 (CryptoDinoRun_KMS_Final)
```

### Key Functions
- `publishScore(uint256 score)` - Submit your score to the blockchain
- `dailyGm()` - Daily check-in for free plays
- `buyGmTokensFHE()` - Buy GM tokens with ETH to purchase plays
- `requestClaimETH(uint256 amountWei)` - Request ETH withdrawal
- `getEncryptedPendingEthWei(address user)` - Get encrypted pending ETH
- `getEncryptedScore(address user)` - Get encrypted score

## 🛠️ Development

### Project Structure
```
cryptoracezamaFHE/
├── contracts/                    # Smart contracts
├── frontend-the-race/           # React frontend
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
cd frontend-the-race
npm start

# Build for production
cd frontend-the-race
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

## Created by: [nhattung99](https://x.com/nhattung99)
