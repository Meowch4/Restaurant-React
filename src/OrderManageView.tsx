import axios from "axios"
import { useEffect, useState } from "react"
import { printOrder } from "./utils"
import { makeAutoObservable, observable } from "mobx"
import { observer } from "mobx-react"

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

class OrderManager {
  orders: Order[] = []
  constructor() {
    makeAutoObservable(this)
  }
  deleteOrder(idx: number) {
    this.orders.splice(idx,1)
  }
  changeOrderStatus(idx: number, status: Order['status']) {
    this.orders[idx].status = status
  }
  addOrders(...orders: Order[]) {
    this.orders.push(...orders)
  }
}

const OrderManageViewObserver =  observer(OrderManageView)

function OrderManageView() {

  const [manager] = useState(() => observable(new OrderManager()))

  useEffect(() => {
    let ignore = false
    axios.get(`/api/restaurant/1/order`)
    .then(res => {
      if (ignore == false) {
        manager.addOrders(...res.data)
      }
    })
    return () => {
      ignore = true
    }
  }, [])

  async function confirmOrder(idx:number) {
    const order = manager.orders[idx]
    await axios.put(`/api/restaurant/:rid/order/${order.id}/status`, {
      status: 'confirmed',
    })
    manager.changeOrderStatus(idx, 'confirmed')
  }
  async function completeOrder(idx:number) {
    const order = manager.orders[idx]
    await axios.put(`/api/restaurant/:rid/order/${order.id}/status`, {
      status: 'completed',
    })
    manager.changeOrderStatus(idx, 'completed')
  }


  async function deleteOrder(id:number, idx:number) {
    await axios.delete(`/api/restaurant/1/order/${id}`)
    manager.deleteOrder(idx)
  }

  return (
    <div>
      订单管理页面
      <ul>
        {manager.orders.map((order, idx) => {
          return (
            <li className="border flex rounded p-2 m-2" key={order.id}>
              <div>
                <div>桌号：{ order.deskName }</div>
                <div>人数：{ order.customCount }</div>
                <div>状态：{ order.status == 'pending' ? '待确认' : order.status == 'confirmed' ? '已确认' : '已完成'}</div>
                <div>时间：{ order.timestamp }</div>
                <div>
                  <button onClick={() => printOrder(order)}>打印</button>
                  {order.status == 'pending' &&
                    <button onClick={() => confirmOrder(idx)}>确认</button>
                  }
                  {order.status == 'confirmed' &&
                    <button onClick={() => completeOrder(idx)}>完成</button>
                  }
                  <button onClick={() => deleteOrder(order.id, idx)}>删除</button>
                </div>
              </div>
              <div className="border grow">
                <div className="flex justify-around ">
                  <span className="w-1/3 text-right">菜名</span>
                  <span className="w-1/3 text-right">数量</span>
                  <span className="w-1/3 text-right">价格</span>
                </div>
                { order.details.map((item, idx) => {
                  return (
                    <div key={idx} className="flex grow">
                      <span className="w-1/3 text-right">{ item.food.name }</span>
                      <span className="w-1/3 text-right">{ item.amount }</span>
                      <span className="w-1/3 text-right">{ item.food.price }&times;{ item.amount }</span>
                    </div>
                  )
                })}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default OrderManageViewObserver