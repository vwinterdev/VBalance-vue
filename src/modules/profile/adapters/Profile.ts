import type { Raw } from "@/modules/common/types/Raw"

export class User {
  id: string
  email: string
  createdAt: string
  isVerified: boolean

  constructor(raw: Raw) {
    this.id = raw.id
    this.email = raw.email
    this.createdAt = raw.createdAt
    this.isVerified = raw.isVerified
  }

  static fromRaw(raw: Raw): User {
    return new User(raw)
  }
}


export class Profile {
    id: string
    firstName: string
    lastName: string
    balance: number
    user: User
    
    constructor(raw: Raw) {
        this.id = raw.id
        this.firstName = raw.firstName
        this.lastName = raw.lastName
        this.balance = raw.balance
        this.user = User.fromRaw(raw.user)
    }

    static fromRaw(raw: Raw): Profile {
        return new Profile(raw)
    }
}