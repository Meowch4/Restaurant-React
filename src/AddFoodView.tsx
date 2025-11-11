import { useRef } from "react"
import { useInput } from "./hooks"
import axios from "axios"
import { useNavigate } from "react-router"

export default function AddFoodView() {

  const name = useInput()
  const price = useInput()
  const desc = useInput()
  const category = useInput()
  const navigate = useNavigate()

  const imgInputRef = useRef<HTMLInputElement | null>(null)

  function addFood(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault()

    const fd = new FormData()

    fd.append('name', name.value)
    fd.append('price', price.value)
    fd.append('desc', desc.value)
    fd.append('category', category.value)
    fd.append('status', 'on')
    fd.append('img', imgInputRef.current!.files![0])

    axios.post(`/api/restaurant/1/food`, fd)
    .then(() => {
      navigate('/home/foods')
    })
  }

  return (
    <div>
      <div className="h-12 font-bold text-xl">添加菜品</div>
      <form>
        <div className="h-12">
          名称
          <input className="border rounded mx-2" type="text" {...name}></input>
        </div>
        <div className="h-12">
          价格
          <input className="border rounded mx-2" type="text" {...price}></input>
        </div>
        <div className="h-12">
          描述
          <input className="border rounded mx-2" type="text" {...desc}></input>
        </div>
        <div className="h-12">
          分类
          <input className="border rounded mx-2" type="text" {...category}></input>
        </div>
        <div className="h-12">
          图片
          <input type="file" className="mx-2" ref={imgInputRef}></input>
        </div>
        <button onClick={addFood}>提交</button>
        <button onClick={() => navigate('/home/desks')}>取消</button>
      </form>
    </div>
  )
}