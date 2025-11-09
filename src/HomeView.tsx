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
    <div className="flex">
      <div className="w-48 p-4 border-r flex flex-col gap-2 items-center">
        <span className="font-bold text-lg">{ userInfo?.name }</span>
        <Link className="block" to={'/home/orders'}>订单管理</Link>
        <Link className="block" to={'/home/foods'}>菜品管理</Link>
        <Link className="block" to={'/home/desks'}>桌面管理</Link>
        <button>退出</button>
      </div>
      <div className="grow p-4">
        <Suspense fallback={'Loading...'}>
          <Outlet></Outlet>
        </Suspense>
      </div>
    </div>
  )
}