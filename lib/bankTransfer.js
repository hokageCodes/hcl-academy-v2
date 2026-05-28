export function getBankTransferDetails() {
  return {
    bankName: process.env.BANK_NAME?.trim() || "Access Bank",
    accountName: process.env.BANK_ACCOUNT_NAME?.trim() || "HCL Academy",
    accountNumber: process.env.BANK_ACCOUNT_NUMBER?.trim() || "0000000000",
    supportWhatsApp:
      process.env.BANK_SUPPORT_WHATSAPP?.trim() || "+2349035104366",
  };
}

