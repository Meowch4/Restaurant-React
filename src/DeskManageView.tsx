import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import QRCode from 'qrcode'



type Desk = {
  id: number,
  rid: number,
  name: string,
  capacity: number,
}


class DeskManager {
  desks: Desk[] = []
  addDesk(...desk: Desk[]) {
    this.desks.push(...desk)
  }
}



export default function DeskManageView() {
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
  })

  useEffect(() => {
    axios.get(`/api/restaurant/:rid/desk`)
    .then(res => {
      if (ignore == false) {
        manager.addDesk(...res.data)
      }
      setIgnore(true)
    })
  }, [ignore, manager])


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
                  <button>删除</button>
                  <button>打印二维码</button>
                </div>
              </div>
              <div className="p-2">
                <img src={qrcodes[idx]} alt="" className="w-24 h-24" />
              </div>
            </div>
          )
        })
      }
    </div>
  )
}