# 🚀 CryptoRace Zama - Demo Deployment Guide

This guide will help you deploy your CryptoRace Zama project to create a public demo link.

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Railway account (free) or Render account
- MetaMask wallet with Sepolia ETH

## 🎯 Quick Demo Setup

### Option 1: One-Click Deploy (Recommended)

#### Frontend (Vercel)
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import from GitHub: `https://github.com/hoasine/cryptoracezama.git`
4. Set Root Directory: `frontend-fhe-race`
5. Add Environment Variables:
   ```
   REACT_APP_FHEVM_CONTRACT_ADDRESS=0xD974B2200fb2723DC2Df33fbCDab52475FC563D5
   REACT_APP_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
   REACT_APP_RELAYER_URL=https://relayer.testnet.zama.cloud
   REACT_APP_ETHERSCAN_API_KEY=YourEtherscanApiKey
   ```
6. Click "Deploy"

#### Backend (Railway)
1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Set Root Directory: `server`
5. Add Environment Variables:
   ```
   PORT=4009
   REACT_APP_FHEVM_CONTRACT_ADDRESS=0xD974B2200fb2723DC2Df33fbCDab52475FC563D5
   REACT_APP_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
   REACT_APP_RELAYER_URL=https://relayer.testnet.zama.cloud
   REACT_APP_ETHERSCAN_API_KEY=YourEtherscanApiKey
   ORACLE_PRIVATE_KEY=your_oracle_private_key
   ```
6. Click "Deploy"

### Option 2: Manual Deployment

#### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend-fhe-race

# Deploy
vercel --prod

# Set environment variables
vercel env add REACT_APP_FHEVM_CONTRACT_ADDRESS
vercel env add REACT_APP_SEPOLIA_RPC_URL
vercel env add REACT_APP_RELAYER_URL
vercel env add REACT_APP_ETHERSCAN_API_KEY
```

#### Backend Deployment (Railway)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

## 🔧 Environment Variables

### Frontend (Vercel)
```env
REACT_APP_FHEVM_CONTRACT_ADDRESS=0xD974B2200fb2723DC2Df33fbCDab52475FC563D5
REACT_APP_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
REACT_APP_RELAYER_URL=https://relayer.testnet.zama.cloud
REACT_APP_ETHERSCAN_API_KEY=YourEtherscanApiKey
REACT_APP_CHAIN_ID=11155111
```

### Backend (Railway/Render)
```env
PORT=4009
REACT_APP_FHEVM_CONTRACT_ADDRESS=0xD974B2200fb2723DC2Df33fbCDab52475FC563D5
REACT_APP_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
REACT_APP_RELAYER_URL=https://relayer.testnet.zama.cloud
REACT_APP_ETHERSCAN_API_KEY=YourEtherscanApiKey
ORACLE_PRIVATE_KEY=your_oracle_private_key
```

## 🌐 Demo Links

After deployment, you'll get:

- **Frontend Demo**: `https://your-project.vercel.app`
- **Backend API**: `https://your-project.railway.app`

## 🎮 How to Use the Demo

1. **Connect Wallet**: Users need MetaMask with Sepolia testnet
2. **Get Test ETH**: Use [Sepolia Faucet](https://sepoliafaucet.com)
3. **Play Game**: 
   - Daily check-in for free races
   - Play the dodge race game
   - Claim ETH rewards
   - Compete on leaderboard

## 🔒 Security Notes

- All sensitive data is encrypted using FHEVM
- Private keys should be kept secure
- Use environment variables for all secrets
- Test on Sepolia testnet only

## 📞 Support

- GitHub Issues: [Repository Issues](https://github.com/hoasine/cryptoracezama/issues)
- Documentation: [README.md](README.md)

## 🚀 Quick Start Commands

```bash
# Clone repository
git clone https://github.com/hoasine/cryptoracezama.git
cd cryptoracezama

# Install dependencies
npm install
cd frontend-fhe-race && npm install
cd ../server && npm install

# Start locally
cd ../server && node index.js &
cd ../frontend-fhe-race && npm start
```

Your demo will be available at:
- Frontend: http://localhost:4002
- Backend: http://localhost:4009
