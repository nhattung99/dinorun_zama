# Crypto Race FHE Frontend - Environment Configuration

**Author**: [@trungkts29](https://x.com/trungkts29)

## Cấu hình môi trường

### Biến môi trường cần thiết

Tạo file `.env.local` trong thư mục `frontend-fhe-race` với nội dung sau:

```env
# Contract Configuration
REACT_APP_FHEVM_CONTRACT_ADDRESS=0xD974B2200fb2723DC2Df33fbCDab52475FC563D5

# Network Configuration
REACT_APP_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
REACT_APP_CHAIN_ID=11155111

# FHEVM Configuration
REACT_APP_RELAYER_URL=https://relayer.testnet.zama.cloud

# API Keys
REACT_APP_ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY

# Race Configuration
REACT_APP_PRICE_PER_RACE=0.01

# Contract Addresses
REACT_APP_ZAMA_STANDARD_CONTRACT_ADDRESS=0x62c1E5607077dfaB9Fee425a70707b545F565620
REACT_APP_ZAMA_FHEVM_STANDARD_CONTRACT_ADDRESS=0xf72e7a878eCbF1d7C5aBbd283c10e82ddA58A721
REACT_APP_EXECUTOR_CONTRACT=0x848B0066793BcC60346Da1F49049357399B8D595
REACT_APP_ACL_CONTRACT=0x687820221192C5B662b25367F70076A37bc79b6c
REACT_APP_HCU_LIMIT_CONTRACT=0x594BB474275918AF9609814E68C61B1587c5F838
REACT_APP_KMS_VERIFIER_CONTRACT=0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC
REACT_APP_INPUT_VERIFIER_CONTRACT=0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4
REACT_APP_DECRYPTION_ORACLE_CONTRACT=0xa02Cda4Ca3a71D7C46997716F4283aa851C28812
REACT_APP_DECRYPTION_ADDRESS=0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1
REACT_APP_INPUT_VERIFICATION_ADDRESS=0x7048C39f048125eDa9d678AEbaDfB22F7900a29F

# Development Configuration
PORT=4000
```

### Chạy ứng dụng

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy ứng dụng trên cổng 4000:
```bash
npm start
```

Ứng dụng sẽ chạy tại: http://localhost:4000

### Các tính năng chính

- **Wallet Connection**: Kết nối MetaMask với mạng Sepolia
- **Buy Races**: Mua lượt quay với giá 0.01 ETH
- **Race Wheel**: Quay vòng quay với FHE encryption
- **Check In**: Check-in hàng ngày
- **Send GM**: Gửi GM hàng ngày
- **User Decryption**: Giải mã dữ liệu thông qua Relayer

### Cấu hình Contract

- **Main Contract**: CryptoRaceFHE với FHE encryption
- **Zama Standard Contract**: Contract chuẩn của Zama
- **Zama FHEVM Standard Contract**: Contract FHEVM chuẩn

### Network Configuration

- **Chain ID**: 11155111 (Sepolia)
- **RPC URL**: Alchemy Sepolia endpoint
- **Relayer**: Zama testnet relayer

### Gas Settings

- **Gas Limit**: 1,000,000
- **Max Fee Per Gas**: 30 gwei
- **Max Priority Fee Per Gas**: 5 gwei

## 📞 Support

- **Author**: [@trungkts29](https://x.com/trungkts29)
- **Issues**: [GitHub Issues](https://github.com/ntclick/luckyracegameFHE/issues)

---

**⚠️ Disclaimer**: This is a demo application for educational purposes. Use at your own risk. 