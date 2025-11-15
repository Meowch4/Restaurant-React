import { useAtom } from "jotai";
import { Suspense, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { isLoginAtom } from "./store";
import axios from "axios";

type RestaurantInfo = {
  id: string,
  name: string,
  title: string,
}

export default function HomeView() {
  const [isLogin] = useAtom(isLoginAtom)
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState<null | RestaurantInfo>(null)

  useEffect(() => {
    axios.get('/api/userinfo').then(res => {
      setUserInfo(res.data)
    })

  }, [isLogin])

  useEffect(() => {
    if (isLogin == false) {
      navigate('/login')
    }
  }, [isLogin, navigate])

  if (isLogin == false) return null
 
  return (
    <div className="h-full flex flex-col">
      <h1 className="border-b flex justify-between items-center p-2">
        <span className="font-bold text-xl px-4">{ userInfo?.title }</span>
        <button>退出</button>
      </h1>
      <div className="flex grow overflow-hidden">
        <div className="w-48 p-4 border-r flex flex-col gap-2 items-center shrink-0">
          <Link className="[&.active]:bg-slate-700 text-base block p-2" to={'/home/orders'}>订单管理</Link>
          <Link className="[&.active]:bg-slate-700 text-base block p-2" to={'/home/foods'}>菜品管理</Link>
          <Link className="[&.active]:bg-slate-700 text-base block p-2" to={'/home/desks'}>餐桌管理</Link>
        </div>
        
        <div className="grow p-4 overflow-auto">
          <Suspense fallback={'Loading...'}>
            <Outlet></Outlet>
          </Suspense>
        </div>
      </div>
    </div>
  )
}