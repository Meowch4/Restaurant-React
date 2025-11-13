import { useRequest, useToggle } from "ahooks"
import axios from "axios"
import { useNavigate, useParams, useSearchParams } from "react-router"
import { useImmer } from "use-immer"
import type { Food } from "./types"
import { useAtom } from "jotai"
import { deskInfoAtom } from "./store"
import { useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"

function getMenu(rId: number | string): Promise<Food[]> {
  return axios.get('/api/menu/restaurant/' + rId)
  .then(res => {
    return res.data
  })
}

function OrderFoodPage() {
  const navigate = useNavigate()

  const params = useParams()
  const [query] = useSearchParams()

  const [foodCount, updateFoodCount] = useImmer<number[]>([])
  const [checkedFood, updateCheckedFood] = useImmer<boolean[]>([])

  const [expand, {toggle}] = useToggle(true)

  const [deskInfo] = useAtom(deskInfoAtom)

  // 请求餐厅的菜单信息
  // data: menu是把data解构后别名menu
  const { data: menu, loading } = useRequest(getMenu, {
    defaultParams: [params.restaurantId!],
    onSuccess: (data) => {
      updateFoodCount(Array(data.length).fill(0))
      updateCheckedFood(Array(data.length).fill(true))
    }
  })

  console.log(deskInfo)

  // 让多个函数都能访问到client
  const clientRef = useRef<Socket | null>(null)
  useEffect(() => {
    // 最开始的menu是undefined 所以把逻辑放在menu非空的if里
    if (menu) {
      clientRef.current = io(`ws://${location.host}`, {
        path: '/desk',
        transports:['websocket', 'polling'],
        query: {
          desk: `desk:${deskInfo!.id}`//要加入的桌号
        }
      })
  
      // 连接成功后触发，告知此桌已加入购物车的菜品
      clientRef.current.on('cart food', (foodAry) => {
  
      })
  
      // 此桌已点的菜更新时
      clientRef.current.on('new food', (info: {desk: string, food: Food, amount: number}) => {
        const foodId = info.food.id
        const idx = menu!.findIndex(it => it.id == foodId)
        if (idx > 0) {
          updateFoodCount(foodCount => {
            foodCount[idx] = info.amount
          })
        }
      })
  
      // 此桌已（被其他用户）下单
      clientRef.current.on('placeorder success', order => {
  
      })
    }

    return () => {
      clientRef.current?.close()
      clientRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu])

  function setFoodCount(idx: number, count: number) {
    updateFoodCount(draft => {
      draft[idx] = count
    })
    // 不放到上面函数的内部是因为开发阶段会运行两次
    // 向服务器发送某个菜品数量变化的事件
    // 服务器会通知该桌子上所有点菜的人
    clientRef.current?.emit('new food', {
      desk: 'desk:' + params.deskId,
      food: menu![idx],
      amount: count,
    })
  }

  // 计算总价
  function totalPrice() {
    return menu!.map(it => it.price)
      .map((price: number, idx: number) => {
        return price * foodCount[idx]
      }).reduce((a, b) => a + b, 0)
  }

  // 下单按钮函数
  async function placeOrder() {
    const order = {
      deskName: deskInfo?.name,
      customCount: query.get('c'),
      totalPrice: totalPrice(),
      foods: selectedFood().filter(it => it.checked).map(it => {
        return {
          amount: it.count,
          food: it.food,
        }
      })
    }
    await axios.post(`/api/restaurant/${deskInfo!.rid}/desk/${deskInfo!.id}/order`, order)
    navigate('/order-success')
  }

  if (loading) {
    return 'Loading...'
  }

  // 这是返回选择数量大于0的菜，不管有没有check
  function selectedFood() {
    return foodCount.map((count, idx) => {
      return {
        idx,
        count,
        food: menu![idx],
        checked: checkedFood[idx],
      }
    }).filter(it => it.count > 0)
  }

  // 配合checkbox的onchange修改菜品check状态的函数
  function setCheckedFood(idx: number, checked: boolean) {
    updateCheckedFood(draft => {
      draft[idx] = checked
    })
  }

  // 一共选了多少个菜品（不去重），放在菜品数量小红点里的
  function selectedFoodSum() {
    return selectedFood().map(it => it.count).reduce((a, b) => a + b, 0)
  }

  return (
    <div>
      <h1>点餐页面</h1>
      <div className="pb-16 p-2">
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
                <Counter value={foodCount[idx]} min={0} max={5} onChange={c => setFoodCount(idx, c)}/>
              </div>
          ))
        }
      </div>

      <div className="fixed bottom-0 left-2 right-2 bg-slate-100 w-full p-2">
        <div data-detail="当前购物车详情" hidden={expand} className="divide-y p-2">
          {/* <div className="flex ">
            <div className="grow basis-0">菜品</div>
            <div className="grow basis-0">数量</div>
            <div className="grow basis-0">小计</div>
          </div> */}
          <div className="divide-y">
          {
            selectedFood()
            .map(entry => {
              return (
                <div key={entry.idx} className="flex py-2 gap-2">
                  <div>
                    <input type="checkbox" checked={entry.checked} onChange={(e) => setCheckedFood(entry.idx, e.target.checked)} />
                  </div>
                  <div className="grow basis-0">{ entry.food.name }</div>
                  <div className="grow basis-0 text-right pr-8">{ entry.count * entry.food.price }￥</div>
                  <Counter value={entry.count} onChange={c => setFoodCount(entry.idx, c)}/>
                </div>
              )
            })
          }
          </div>
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
          <button onClick={ placeOrder }>下单</button>
        </div>

      </div>
    </div>
  )
}

export default OrderFoodPage


type CounterProps = {
  min?: number,
  max?: number,
  value?: number,
  step?: number,
  onChange?: (current: number) => void
}

// Counter被实现成了受控组件，取value属性的值为多少，里面一定显示为多少
// 这样一来，把同一个变量传给两个Couter组件，他们就能同步
export function Counter({ max = 10, min = 0, value = 0, step = 1, onChange = () => {}}: CounterProps) {

  function inc() {
      let t = value + step
      if (t > max) {
        t = max
      }
      onChange(t)
  }

  function dec() {
      let t = value - step
      if (t < min) {
        t = min
      }
      onChange(t)
  }


  return (
    <div className="flex gap-1 items-center self-center">
      <button onClick={dec} className="text-xs w-8 h-8 font-bold bg-yellow-400 rounded-full flex justify-center items-center">-</button>
      <span>{ value }</span>
      <button onClick={inc} className="text-xs w-8 h-8 font-bold bg-yellow-400 rounded-full flex justify-center items-center">+</button>
    </div>
  )
}