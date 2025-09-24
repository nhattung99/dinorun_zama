# 🎰 Crypto Race FHE Frontend

Frontend React cho vòng quay may mắn sử dụng Fully Homomorphic Encryption (FHE) trên FHEVM.

**Author**: [@trungkts29](https://x.com/trungkts29)

## 🚀 Tính năng

- **🔐 FHE Encryption**: Mã hóa dữ liệu quay số theo chuẩn FHE
- **🎯 Vòng quay 8 ô**: 2 ô không thưởng, 1 ô 0.1 ETH, 1 ô NFT, 4 ô 0.01 ETH
- **💰 Mua lượt quay**: 0.01 ETH/lượt
- **📅 Điểm danh hàng ngày**: Nhận lượt quay miễn phí
- **👋 GM hàng ngày**: Nhận bonus lượt quay
- **🎨 Giao diện đẹp**: Responsive design với gradient và animation
- **🔒 Bảo mật**: Sử dụng biến môi trường cho thông tin nhạy cảm

## 🛠️ Cài đặt

```bash
# Cài đặt dependencies
npm install

# Tạo file .env từ .env.example
cp .env.example .env

# Cập nhật thông tin trong file .env
# REACT_APP_CONTRACT_ADDRESS=your_contract_address
# REACT_APP_SEPOLIA_RPC_URL=your_rpc_url

# Chạy development server
npm start
```

## 📋 Yêu cầu

- Node.js 16+
- MetaMask hoặc wallet tương thích
- Sepolia testnet ETH
- Contract CryptoRaceFHE_Complete.sol đã được deploy

## ⚙️ Cấu hình

### 1. Tạo file .env

Tạo file `.env` trong thư mục `frontend-fhe-race` với nội dung:

```env
# Contract Configuration
REACT_APP_CONTRACT_ADDRESS=0xa70DFA470B27d1Db1612E64c8Fb8c094FB3202E7

# Network Configuration
REACT_APP_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
REACT_APP_CHAIN_ID=11155111

# FHEVM Configuration
REACT_APP_RELAYER_URL=https://relayer.testnet.zama.cloud

# Race Configuration
REACT_APP_PRICE_PER_RACE=0.01
```

### 2. Cập nhật thông tin

- **REACT_APP_CONTRACT_ADDRESS**: Địa chỉ contract đã deploy
- **REACT_APP_SEPOLIA_RPC_URL**: RPC URL cho Sepolia testnet
- **REACT_APP_CHAIN_ID**: Chain ID của Sepolia (11155111)

### 3. Kết nối wallet

Kết nối MetaMask với Sepolia testnet

## 🔧 Cấu trúc Project

```
src/
├── App.tsx              # Component chính
├── App.css              # Styling
├── config.ts            # Cấu hình contract và network (sử dụng env vars)
└── react-app-env.d.ts  # TypeScript declarations
```

## 🎮 Cách sử dụng

1. **Kết nối Wallet**: Click "Connect Wallet" để kết nối MetaMask
2. **Mua lượt quay**: Click "Buy Races" để mua lượt quay (0.01 ETH/lượt)
3. **Điểm danh**: Click "Check In" để nhận lượt quay miễn phí hàng ngày
4. **Gửi GM**: Click "Send GM" để nhận bonus lượt quay
5. **Quay số**: Click "Race" để quay vòng quay may mắn

## 🔐 FHE Integration

Frontend sử dụng `@zama-fhe/relayer-sdk` để:

- **Khởi tạo FHE instance**: `initSDK()` và `createInstance()`
- **Mã hóa dữ liệu**: `encrypt8()` cho pool index
- **Tạo input proof**: `generateInputProof()` cho verification
- **Gọi contract**: `raceAndClaimReward()` với encrypted data

## 🎯 Vòng quay

Vòng quay gồm 8 ô với phân bố phần thưởng:

- **Slot 0**: 0.1 ETH (1% chance)
- **Slot 1**: 0.01 ETH (1% chance)
- **Slots 2-4**: Miss (no reward)
- **Slot 5**: 5 GM tokens
- **Slot 6**: 15 GM tokens
- **Slot 7**: 30 GM tokens

## 🚀 Deployment

### Build cho Production

```bash
npm run build
```

### Deploy lên Vercel/Netlify

1. Connect repository với Vercel/Netlify
2. Set environment variables
3. Deploy tự động khi push

## 📞 Support

- **Author**: [@trungkts29](https://x.com/trungkts29)
- **Issues**: [GitHub Issues](https://github.com/ntclick/luckyracegameFHE/issues)

---

**⚠️ Disclaimer**: This is a demo application for educational purposes. Use at your own risk.
