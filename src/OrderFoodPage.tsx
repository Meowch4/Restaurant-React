import { useRequest } from "ahooks"
import axios from "axios"
import { useParams } from "react-router"
import type { Food } from "./OrderManageView"
import { useEffect, useState } from "react"
import { useImmer } from "use-immer"

function getMenu(rId: number | string) {
  return axios.get('/api/menu/restaurant/' + rId)
  .then(res => {
    return res.data
  })
}


function OrderFoodPage() {
  const params = useParams()
  const [foodCount, updateFoodCount] = useImmer<number[]>([])

  // data: menu是把data解构后别名menu
  const { data: menu, loading } = useRequest(getMenu, {
    defaultParams: [params.restaurantId!],
    onSuccess: (data) => {
      updateFoodCount(Array(data.length).fill(0))
    }
  })

  function setFoodCount(idx: number, count: number) {
    updateFoodCount(draft => {
      draft[idx] = count
    })
  }


//   ### POST /restaurant/:rid/desk/:did/order

// ```json
// {
//   deskName:
//   customCount:
//   totalPrice:
//   foods: [{id, amount}, {}, {}]
// }
// ```
  // function placeOrder() {
  //   axios.post(`/api/restaurant/1/desk/2/order`, {
  //     deskName: params.deskId,
  //     customCount: ,
  //     totalPrice: ,
  //     foods: [

  //     ],
  //   })
  // }

  if (loading) {
    return 'Loading...'
  }

  return (
    <div>
      <h1>点餐页面</h1>
      <div>
        {
          menu.map((foodItem: Food, idx: number) => (
              <div className="border flex" key={idx}>
                <img 
                className="w-24 h-24"
                src={`/upload/${foodItem.img}`} alt="" />
                <div className="grow">
                  <div>{ foodItem.name }</div>
                  <div>{ foodItem.desc }</div>
                  <div>￥{ foodItem.price }</div>
                </div>
                <Counter min={0} max={5} onChange={c => setFoodCount(idx, c)}/>
              </div>
          ))
        }
      </div>
      <button onClick={placeOrder}>下单</button>
    </div>
  )
}

export default OrderFoodPage


type CounterProps = {
  min?: number,
  max?: number,
  start?: number,
  step?: number,
  onChange?: (current: number) => void
}

export function Counter({ max = 10, min = 0, start = 0, step = 1, onChange = () => {}}: CounterProps) {
  const [current, setCurrent] = useState(start)

  function inc() {
    setCurrent(c => {
      let t = c + step
      if (t > max) {
        t = max
      }
      return t
    })
  }

  function dec() {
    setCurrent(c => {
      let t = c - step
      if (t < min) {
        t = min
      }
      return t
    })
  }

  useEffect(() => {
    onChange(current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])


  return (
    <div className="flex gap-1 items-center self-center">
      <button onClick={dec} className="w-8 h-8 rounded-full flex justify-center items-center">-</button>
      <span>{ current }</span>
      <button onClick={inc} className="w-8 h-8 rounded-full flex justify-center items-center">+</button>
    </div>
  )
}