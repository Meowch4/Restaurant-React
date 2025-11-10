import { makeAutoObservable, observable } from "mobx"
import { type Food } from "./OrderManageView"
import { useEffect, useState } from "react"
import { observer } from "mobx-react"
import axios from "axios"
import { Link } from "react-router"

class FoodManager {
  foods: Food[] = []
  constructor() {
    makeAutoObservable(this)
  }
  addFood(...food: Food[]) {
    this.foods.push(...food)
  }
  setFoodStatus(idx:number, status: 'on' | 'off') {
    this.foods[idx].status = status
  }
}
function FoodManageView() {
  const [manager] = useState(() => observable(new FoodManager()))

  useEffect(() => {
    let ignore = false
    axios.get(`/api/restaurant/1/food`)
    .then(res => {
      if (ignore == false) {
        manager.addFood(...res.data)
      }
    })
    return () => {
      ignore = true
    }
  }, [])

  async function offShelf(idx: number) {
    const food = manager.foods[idx]
    await axios.put(`/api/restaurant/1/food/${food.id}`,
      {status: 'off'})
    manager.setFoodStatus(idx, 'off')
  }
  async function onShelf(idx: number) {
    const food = manager.foods[idx]
    await axios.put(`/api/restaurant/1/food/${food.id}`,
      {status: 'on'})
    manager.setFoodStatus(idx, 'on')
  }

  return (
    <div>
      <span className="font-bold text-2xl">
        菜品管理
      </span>
      <Link to="/home/add-food" className="mx-4">添加菜品</Link>
      {manager.foods.map((food, idx) => {
        return (
          <li key={food.id} className="">
            <div className="border m-2 p-1 flex rounded">
              <img className="w-24 h-24 m-2" src="{food.img}" alt="" />
              <div>
                <div className="font-bold p-1">{ food.name }</div>
                <div className="p-1">价格：{ food.price }</div>
                <div className="p-1">描述：{ food.desc }</div>
                <div className="p-1">分类：{ food.category }</div>
                <div className="p-1">上架状态：{ food.status == 'on' ? '上架中' : '未上架' }</div>
                <div>
                  {food.status == 'on' && <button onClick={() => offShelf(idx)}>下架</button>}
                  {food.status == 'off' && <button onClick={() => onShelf(idx)}>上架</button>}
                  <button>编辑</button>
                  <button>删除</button>
                </div>
              </div>
            </div>

          </li>
        )
      })}

    </div>
  )
}

const FoodManageViewObserver = observer(FoodManageView)

export default FoodManageViewObserver
