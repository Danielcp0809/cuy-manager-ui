

export interface ICageOptions {
  id: string
  code: string
  counters: ICounterOption[]
}

interface ICounterOption {
  amount: number
  category: {
    id: string
    name: string
  }
}
