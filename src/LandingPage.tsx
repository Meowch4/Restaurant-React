import { useRequest } from "ahooks"
import axios from "axios"
import clsx from "clsx"
import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { deskInfoAtom } from "./store"
import { useAtom } from "jotai"
import { Checkbox } from "antd-mobile"
import { useDarkMode } from "./hooks"

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

  const [isDark, toggleDark] = useDarkMode()

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
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="font-bold text-xl w-full bg-gray-100 dark:bg-black p-2 flex justify-around">
        { loading ? 'Loading...' : data.title + ':' + data.name }
        <span>
          <Checkbox checked={isDark} onChange={toggleDark}/>
          <span className="text-base pl-2">深色模式</span>
        </span>
      </h1>
      <div className="grid grid-cols-4 justify-center gap-2 w-2/3 ">
        {
          new Array(12).fill('').map((_, idx) => {
            return (
            <div 
            key={idx}
            className={
              clsx(
                "[&.active]:bg-blue-500 bg-gray-100 dark:bg-black m-auto cursor-pointer border rounded w-8 h-8 flex items-center justify-center",
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
      className="dark:bg-black"
      disabled={customCount == 0}
      onClick={() => startOrdering()}>开始点餐</button>
    </div>
  )
}

export default LandingPage