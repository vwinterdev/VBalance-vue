import type { Raw } from '@/modules/common/types/Raw'

export enum WalletRole {
  OWNER = 'owner',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

export class Wallet {
    id: number;
    name: string;
    balance: number;
    currency: string;
    icon: string;
    color: string;
    role: WalletRole;
    createdAt: Date;

    constructor(raw: Raw) {
      this.id = raw.id
      this.name = raw.name
      this.balance = raw.balance
      this.currency = raw.currency
      this.icon = raw.icon
      this.color = raw.color
      this.role = raw.role
      this.createdAt = new Date(raw.createdAt)
    }
  
    static fromRaw(raw: Raw): Wallet {
      return new Wallet(raw)
    }

}