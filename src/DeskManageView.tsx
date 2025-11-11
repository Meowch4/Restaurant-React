import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import QRCode from 'qrcode'
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react"



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
  addDesk(...desk: Desk[]) {
    this.desks.push(...desk)
  }
  deleteDesk(idx: number) {
    this.desks.splice(idx, 1)
  }
}


function DeskManageView() {
  const [manager] = useState(new DeskManager())
  const [ignore, setIgnore] = useState(false)
  const [qrcodes, setQrcodes] = useState<string[]>([])

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
    axios.get(`/api/restaurant/1/desk`)
    .then(res => {
      if (ignore == false) {
        manager.addDesk(...res.data)
      }
      setIgnore(true)
    })
  }, [ignore, manager])

  function deleteDesk(desk: Desk, idx:number) {
    axios.delete(`/api/restuarant/1/desk/${desk.id}`)
    manager.deleteDesk(idx)
  }


  return (
    <div>
      <span className="font-bold text-2xl">
        餐桌管理
      </span>
      <Link to={'/home/add-desk'} className="mx-4">添加餐桌</Link>
      {
        manager.desks.map((desk, idx) => {
          return (
            <div key={ desk.id } className="border rounded flex p-2 m-2">
              <div className="border-r p-2">
                <div className="text-lg">名称：{ desk.name }</div>
                <div className="text-lg">人数：{ desk.capacity }</div>
                <div className="flex gap-2">
                  <button>编辑</button>
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
      }
    </div>
  )
}

const DeskManageViewObserver = observer(DeskManageView)
export default DeskManageViewObserver