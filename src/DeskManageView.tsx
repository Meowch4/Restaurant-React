import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import QRCode from 'qrcode'
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react"
import { useInput } from "./hooks"



type Desk = {
  id: number,
  rid: number,
  name: string,
  capacity: number,
}


class DeskManager {
  desks: Desk[] = []
  constructor() {
    makeAutoObservable(this)
  }
  addDesks( ...desks: Desk[]) {
    this.desks.push(...desks)
  }
  deleteDesk(idx: number) {
    this.desks.splice(idx, 1)
  }
}


function DeskManageView() {
  const [manager] = useState(new DeskManager())
  const [qrcodes, setQrcodes] = useState<string[]>([])

  // 处理二维码url
  useEffect(() => {
    Promise.all(
      // 把每张桌子都映射为对应的地址创建的url
      manager.desks.map(desk => {
        return QRCode.toDataURL(`localhost://5002/restuarant/1/desk/${desk.id}`)
      })
      // 拿到urls数组
    ).then(urls => {
      setQrcodes(urls)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager.desks.length])

  useEffect(() => {
    let ignore = false
    axios.get(`/api/restaurant/1/desk`)
    .then(res => {
      if (!ignore) {
        manager.addDesks(...res.data)
      }
    })
    return () => {ignore = true}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <div>
      <span className="font-bold text-2xl">
        餐桌管理
      </span>
      <Link to={'/home/add-desk'} className="mx-4">添加餐桌</Link>
      {
        manager.desks.map((desk, idx) => {
          return <DeskItem key={desk.id} manager={manager} desk={desk} idx={idx} qrcodes={qrcodes}/>
        })
      }
    </div>
  )
}

const DeskManageViewObserver = observer(DeskManageView)
export default DeskManageViewObserver

type DeskItemProps = {
  manager: DeskManager,
  desk: Desk,
  idx: number,
  qrcodes: string[],
}

const DeskItem: React.FC<DeskItemProps> = observer(( {manager, desk, idx, qrcodes} ) => {
  const [editing, setEditing] = useState(false)

  const name = useInput(desk.name)
  const capacity = useInput(String(desk.capacity))

  function editHandler() {
    axios.put(`/api/restaurant/1/desk/${desk.id}`, {
      name: name.value,
      capacity: capacity.value,
    }).then(res => {
      manager.desks[idx] = res.data
    })
    setEditing(false)
  }

  if (editing == true) {
    return (
    <div className="border rounded flex p-2 m-2">
      <div className="border-r p-2">
        <div className="text-lg">名称：
          <input className="rounded p-1 m-1" type="text" {...name} />
        </div>
        <div className="text-lg">人数：
          <input className="rounded p-1 m-1" type="text" {...capacity}/>
        </div>
        <div className="flex gap-2">
          <button onClick={editHandler}>完成</button>
          <button onClick={() => setEditing(false)}>取消</button>
        </div>
      </div>
    </div>
    )
  }

  function deleteDesk(desk: Desk, idx:number) {
    axios.delete(`/api/restaurant/1/desk/${desk.id}`)
    manager.deleteDesk(idx)
  }

  return (
    <div className="border rounded flex p-2 m-2">
      <div className="border-r p-2">
        <div className="text-lg">名称：{ desk.name }</div>
        <div className="text-lg">人数：{ desk.capacity }</div>
        <div className="flex gap-2">
          <button onClick={() => setEditing(true)}>编辑</button>
          <button onClick={() => deleteDesk(desk, idx)}>删除</button>
          <button>打印二维码</button>
        </div>
      </div>
      <div className="p-2">
        <img data-url={`https://10.3.3.3:5173/r/1/d/${desk.id}`} src={qrcodes[idx]} alt="" className="w-24 h-24" />
      </div>
    </div>
  )
})