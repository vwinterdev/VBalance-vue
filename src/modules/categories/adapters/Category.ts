import type { Raw } from "@/modules/common/types/Raw.ts"

export class Category {
    id: number
    name: string
    icon: string
    color: string
    secondColor: string

    constructor(raw: Raw){
        this.id = raw.id
        this.name = raw.name
        this.icon = raw.icon
        this.color = raw.color
        this.secondColor = raw.second_color
    }
    
    static fromRaw(raw: Raw): Category  {
        return new Category(raw) 
    }
}