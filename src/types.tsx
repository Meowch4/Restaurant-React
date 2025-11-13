export type Order = {
  id: number,
  rid: number,
  did: number,
  deskName: string,
  customCount: number,
  details: Array<
    {
      amount: number,
      food: Food,
    }
  >,
  status: 'pending' | 'confirmed' | 'completed',
  timestamp: string,
  totalPrice: number
}

export type Food = {
  id: number,
  rid: number,
  name: string,
  desc: string,
  price: number,
  img: string,
  category: string,
  status: 'on' | 'off',
}

export type DeskInfo = {
  did: number, // 餐桌id
  rid: number, // 餐厅id
  name: string, // 餐桌/包间名称
  capacity: number, // 包间容量
  title: string, // 餐厅名称
}
