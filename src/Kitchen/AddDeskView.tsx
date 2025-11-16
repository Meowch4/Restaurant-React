import { useInput } from "../hooks"
import axios from "axios"
import { useNavigate } from "react-router"

export default function AddFoodView() {

  const name = useInput()
  const capacity = useInput()
  const navigate = useNavigate()

  function addDesk(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault()

    axios.post(`/api/restaurant/1/desk`, {
      name: name.value,
      capacity: capacity.value,
    })
    .then(() => {
      navigate('/home/desks')
    })
  }

  return (
    <div>
      <div className="h-12 font-bold text-xl">添加餐桌</div>
      <form>
        <div className="h-12">
          <span className="w-16 inline-block text-right">
            名称
          </span>
          <input className="p-1 border rounded mx-2" type="text" {...name}></input>
        </div>
        <div className="h-12">
          <span className="w-16 inline-block text-right">
            座位数量
          </span>
          <input className="p-1 border rounded mx-2" type="text" {...capacity}></input>
        </div>
        <button onClick={addDesk}>提交</button>
        <button onClick={() => navigate('/home/desks')}>取消</button>
      </form>
    </div>
  )
}