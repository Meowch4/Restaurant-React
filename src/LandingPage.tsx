import { useRequest } from "ahooks"
import axios from "axios"
import clsx from "clsx"
import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { deskInfoAtom } from "./store"
import { useAtom } from "jotai"

function getDeskInfo(deskId: number | string) {
  return axios.get('/api/deskinfo?did=' + deskId)
  .then (res => {
    return res.data
  })
}

function LandingPage() {
  const [customCount, setCustomCount] = useState(0)
  const navigate = useNavigate()
  const params = useParams()
  // console.log(params)

  const [,setDeskInfo] = useAtom(deskInfoAtom)

  const { data, loading } = useRequest(getDeskInfo, {
    defaultParams: [params.deskId!],
    onSuccess: data => {
      setDeskInfo(data)
    }
  })

  function startOrdering() {
    navigate(`/r/1/d/${params.deskId}/?c=` + customCount)
  }

  return (
    <div>
      <h1>{ loading ? 'Loading...' : data.title + ':' + data.name }</h1>
      <div className="flex flex-wrap gap-2">
        {
          new Array(12).fill('').map((_, idx) => {
            return (
            <div 
            key={idx}
            className={
              clsx(
                "[&.active]:bg-blue-400 cursor-pointer border rounded w-8 h-8 flex items-center justify-center",
                { active: customCount == idx + 1},
              )
            }
            onClick={ () => setCustomCount(idx + 1) }
            >
              { idx + 1 }
            </div>
            )
          })
        }
      </div>
      <button 
      disabled={customCount == 0}
      onClick={() => startOrdering()}>开始点餐</button>
    </div>
  )
}

export default LandingPage