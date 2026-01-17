export interface Profile {
  id: string
  firstName: string
  lastName: string
  avatar?: string
}

export interface CreateProfileData {
  firstName: string
  lastName: string
  avatarPath?: string
}
