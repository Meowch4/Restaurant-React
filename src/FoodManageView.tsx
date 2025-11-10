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

  return (
    <div>
      <span className="font-bold text-2xl">
        菜品管理
      </span>
      <Link to="/home/add-food" className="mx-4">添加菜品</Link>
      {manager.foods.map(food => {
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
                  <button>下架</button>
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
