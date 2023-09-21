export interface IModel {
    path: string
    name: string
    id: string
    hash: string
    shortName: string
    link: string
    baseModel: 'SD 1.5' | 'SDXL 1.0'
    aliases: string[]
    defaultPrompt: string
    defaultImageUrl?: string
}

export const MODELS_CONFIG: IModel[] = [
    
]