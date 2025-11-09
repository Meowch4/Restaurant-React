import axios from "axios"
import { useEffect } from "react"
import { useImmer } from "use-immer"
import { printOrder } from "./utils"

export type Order = {
  id: number,
  rid: number,
  did: number,
  deskName: string,
  customCount: number,
  details: [
    {
      amount: number,
      food: {
        id: number,
        rid: number,
        name: string,
        desc: string,
        price: number,
        img: string,
        category: string,
        status: string
      }
    }
  ],
  status: string,
  timestamp: string,
  totalPrice: number
}

export default function OrderManageView() {

  const [orders, updateOrders] = useImmer<Order[]>([])

  useEffect(() => {
    let ignore = false
    axios.get(`/api/restaurant/1/order`)
    .then(res => {
      if (ignore == false) {
        updateOrders(orders => {
          orders.push(...res.data)
        })
      }
    })
    return () => {
      ignore = true
    }
  }, [])

  async function confirmOrder(order: Order) {
    await axios.put(`/api/restaurant/:rid/order/${order.id}/status`, {
      status: 'confirmed',
    })
    order.status = 'confirmed'
  }
  async function completeOrder(order: Order) {
    await axios.put(`/api/restaurant/:rid/order/${order.id}/status`, {
      status: 'completed',
    })
    order.status = 'completed'
  }


  async function deleteOrder(id:number, idx:number) {
    await axios.delete(`/api/restaurant/1/order/${id}`)
    updateOrders(orders => {
      orders.splice(idx, 1)
    })
  }

  return (
    <div>
      订单管理页面
      <ul>
        {orders.map((order, idx) => {
          return (
            <li className="border " key={order.id}>
              <div>桌号：{ order.deskName }</div>
              <div>人数：{ order.customCount }</div>
              <div>状态：{ order.status }</div>
              <div>时间：{ order.timestamp }</div>
              { order.details.map((item, idx) => {
                return (
                  <div key={idx}>
                    <div>菜名：{ item.food.name }</div>
                    <div>数量：{ item.amount }</div>
                    <div>价格：{ item.food.price }&times;{ item.amount }</div>
                  </div>
                )
              })}
              <div>
                <button onClick={() => printOrder(order)}>打印</button>
                <button onClick={() => confirmOrder(order)}>确认</button>
                <button onClick={() => completeOrder(order)}>完成</button>
                <button onClick={() => deleteOrder(order.id, idx)}>删除</button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}