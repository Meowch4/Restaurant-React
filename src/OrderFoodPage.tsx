import { useRequest, useToggle } from "ahooks"
import axios from "axios"
import { useParams } from "react-router"
import type { Food } from "./OrderManageView"
import { useEffect, useState } from "react"
import { useImmer } from "use-immer"

function getMenu(rId: number | string): Promise<Food[]> {
  return axios.get('/api/menu/restaurant/' + rId)
  .then(res => {
    return res.data
  })
}


function OrderFoodPage() {
  const params = useParams()
  const [foodCount, updateFoodCount] = useImmer<number[]>([])

  const [expand, {toggle}] = useToggle(true)

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

  function totalPrice() {
    return menu!.map(it => it.price)
      .map((price: number, idx: number) => {
        return price * foodCount[idx]
      }).reduce((a, b) => a + b, 0)
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
  function placeOrder() {
    axios.post(`/api/restaurant/1/desk/2/order`, {
      // deskName: params.deskId,
      // customCount: ,
      // totalPrice: ,
      // foods: [

      // ],
    })
  }

  if (loading) {
    return 'Loading...'
  }

  function selectedFood() {
    return foodCount.map((count, idx) => {
      return {
        idx,
        count,
        food: menu![idx],
      }
    }).filter(it => it.count > 0)
  }

  function selectedFoodSum() {
    return selectedFood().map(it => it.count).reduce((a, b) => a + b, 0)
  }

  return (
    <div>
      <h1>点餐页面</h1>
      <div className="pb-16">
        {
          menu!.map((foodItem: Food, idx: number) => (
              <div className="border flex p-2 m-2 rounded" key={idx}>
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

      <div className="fixed bottom-0 bg-slate-700 w-full ">
        <div data-detail="当前购物车详情" hidden={expand}>
          <div className="flex">
            <div className="grow basis-0">菜品</div>
            <div className="grow basis-0">数量</div>
            <div className="grow basis-0">小计</div>
          </div>
          {
            selectedFood()
            .map(entry => {
              return (
                <div key={entry.idx} className="flex">
                  <div className="grow basis-0">{ entry.food.name }</div>
                  <div className="grow basis-0">{ entry.count }</div>
                  <div className="grow basis-0">{ entry.count * entry.food.price }</div>
                </div>
              )
            })
          }
        </div>
        <div className="flex items-center justify-between">
          <button className="relative" onClick={toggle}>
            展开
            <span 
            hidden={selectedFoodSum() == 0} 
            className="absolute -right-1 -top-1 bg-red-500 text-white rounded-full text-sm w-6 h-6 flex items-center justify-center">
              { selectedFoodSum() }
            </span>
          </button>
          <span>￥ { totalPrice() }</span>
          <button onClick={placeOrder}>下单</button>
        </div>

      </div>
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