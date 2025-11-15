import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import { printOrder } from "./utils"
import { makeAutoObservable, observable } from "mobx"
import { observer } from "mobx-react"
import type { Order } from "./types"
import { io } from "socket.io-client"
import { notification } from 'antd';
import React from "react"


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

const Context = React.createContext({ name: 'Default' });

function OrderManageView() {
  const [api, contextHolder] = notification.useNotification();

  const [manager] = useState(() => observable(new OrderManager()))

  // const music = useRef<HTMLAudioElement | null>(null)

  // 加载订单数据
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
  }, [manager])


  // 利用ws实现实时下单功能
  useEffect(() => {
    const client = io(`ws://${location.host}`, {
      path: '/restaurant',
      transports:['websocket', 'polling'],
      query: {
        restaurant: 'restaurant:1'//要监听的餐厅id
      }
    })

    client.on('new order', (newOrder) => {
      console.log('有新的订单', newOrder)
      manager.orders.unshift(newOrder)

      // 来新订单播放音乐
      // music.current?.play()

      // antd的弹窗通知
      api.info({
      message: `有新的订单`,
      description: <Context.Consumer>{({ name }) => `Hello, ${name}!`}</Context.Consumer>,
      placement: 'top',
      duration: null, // 不自动关闭
      });
    })

    return () => {
      client.close()
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <div>
        {/* <audio src="xxx.mp3" ref={music}></audio> */}
        <span className="font-bold text-2xl">
          订单管理
        </span>
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
                <div className="border grow p-2 rounded" >
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
                        <span className="w-1/3 text-right">{ item.food.price * item.amount }</span>
                      </div>
                    )
                  })}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </Context.Provider>
  )
}

export default OrderManageViewObserver