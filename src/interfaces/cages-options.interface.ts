

export interface ICageOptions {
  id: string
  code: string
  counters: [
    {
      amount: number
      category: {
        id: string
        name: string
      }
    }
  ];
}
