import { WalletRole } from "../adapters/Wallet"

export const roleToDisplay = (role: WalletRole) => {
  switch (role) {
    case WalletRole.OWNER:
      return 'Владелец'
    case WalletRole.EDITOR:
      return 'Редактор'
    case WalletRole.VIEWER:
      return 'Наблюдатель'
    default:
      return 'Неизвестная роль'
  }
}