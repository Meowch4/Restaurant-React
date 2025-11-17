import { makeAutoObservable } from "mobx"
import { type Food } from "../types"
import { useEffect, useRef, useState } from "react"
import { observer } from "mobx-react"
import axios from "axios"
import { Link } from "react-router"
import { useInput } from "../hooks"
import _ from "lodash"
import { Tabs } from "antd-mobile"

class FoodManager {
  foods: Food[] = []
  constructor() {
    makeAutoObservable(this)
  }
  addFood(...food: Food[]) {
    this.foods.push(...food)
  }
  setFoodStatus(idx:number, status: Food['status']) {
    this.foods[idx].status = status
  }
  deleteFood(idx: number) {
    this.foods.splice(idx, 1)
  }
  get grouped() {
    return _.groupBy(this.foods, 'category')
  }
}
function FoodManageView() {
  const [manager] = useState(() => new FoodManager())

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
  }, [manager])

  const groups = Object.entries(manager.grouped)

  if (groups.length === 0) {
    return <div>加载中...</div>
  }

  const defaultActiveKey = groups[0][0]

  const items = groups.map(entry => {
    const [category, foods] = entry
    return (
        <Tabs.Tab title={category} key={category}>
          {
            foods.map((food, idx) => {
              return <FoodItem key={food.id} manager={manager} foodItem={food} idx={idx}/>
            })
          }
        </Tabs.Tab>
    )
  })


  return (
    <div>
      <span className="font-bold text-2xl">
        菜品管理
      </span>
      <Link to="/home/add-food" className="mx-4">添加菜品</Link>
      <Tabs defaultActiveKey={defaultActiveKey}>
        {items}
      </Tabs>
      <div className="hidden">
        {
          manager.foods.map((food, idx) => {
            return <FoodItem key={food.id} manager={manager} foodItem={food} idx={idx}/>
          })
        }
      </div>

    </div>
  )
}

const FoodManageViewObserver = observer(FoodManageView)

export default FoodManageViewObserver

type FoodItemProp = {
  manager: FoodManager,
  foodItem: Food,
  idx: number,
}

// 菜品管理页面的一个菜品条目
const FoodItem: React.FC<FoodItemProp> = observer(({ manager, foodItem, idx }) => {

  const [editing, setEditing] = useState(false)

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
  async function deleteFood(idx: number) {
    const food = manager.foods[idx]
    await axios.delete(`/api/restaurant/1/food/${food.id}`)
    manager.deleteFood(idx)
  }

  const name = useInput(foodItem.name)
  const price = useInput(String(foodItem.price))
  const desc = useInput(foodItem.desc)
  const category = useInput(foodItem.category)
  const imgInputRef = useRef<HTMLInputElement | null>(null)
  

  function handleEdit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault()

    const fd = new FormData()

    fd.append('name', name.value)
    fd.append('price', price.value)
    fd.append('desc', desc.value)
    fd.append('category', category.value)
    fd.append('status', 'on')
    // 如果选了文件就上传新的文件，否则就不上传，后端会沿用以前的文件
    if (imgInputRef.current!.files!.length > 0) {
      fd.append('img', imgInputRef.current!.files![0])
    }

    axios.put(`/api/restaurant/1/food/${foodItem.id}`, fd).then(res => {
      manager.foods[idx] = res.data
    })
    setEditing(false)
  }

  if (editing == true) {
    return (
      <div className="border m-2 p-1 flex rounded gap-2">
        <img className="w-24 h-24 m-2" src={'/upload/' + foodItem.img} alt="" />
        <div>
          <div className="p-1">名称：<input className="rounded" type="text" {...name} /></div>
          <div className="p-1">价格：<input className="rounded" type="text" {...price} /></div>
          <div className="p-1">描述：<input className="rounded" type="text" {...desc} /></div>
          <div className="p-1">分类：<input className="rounded" type="text" {...category} /></div>
          <div className="p-1">图片：<input className="rounded" type="file" ref={imgInputRef}/></div>

          <div className="flex gap-2">
            <button onClick={ e => handleEdit(e) }>完成</button>
            <button onClick={ () => setEditing(false) }>取消</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border m-2 p-1 flex gap-2 rounded">
      <img className="w-24 h-24 m-2" src={'/upload/' + foodItem.img} alt="" />
      <div>
        <div className="font-bold text-base p-1">{ foodItem.name }</div>
        <div className="p-1">价格：{ foodItem.price }</div>
        <div className="p-1">描述：{ foodItem.desc }</div>
        <div className="p-1">分类：{ foodItem.category }</div>
        <div className="p-1">上架状态：{ foodItem.status == 'on' ? '上架中' : '未上架' }</div>
        <div className="flex gap-2">
          {foodItem.status == 'on' && <button onClick={() => offShelf(idx)}>下架</button>}
          {foodItem.status == 'off' && <button onClick={() => onShelf(idx)}>上架</button>}
          <button onClick={() => setEditing(true)}>编辑</button>
          <button onClick={() => deleteFood(idx)}>删除</button>
        </div>
      </div>
    </div>
  )
})
