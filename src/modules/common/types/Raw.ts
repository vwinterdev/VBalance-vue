export interface Raw {
    [key: string]: any | Raw
}

export interface ResponseList {
    list: Raw[]
} 