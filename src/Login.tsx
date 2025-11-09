import axios from "axios"
import { useInput } from "./hooks"
import { useAtom } from "jotai"
import { isLoginAtom } from "./store"
import { Link, useNavigate } from "react-router"

export default function Login() {
  const name = useInput('')
  const password = useInput('')
  const captcha = useInput('')
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useAtom(isLoginAtom)

  async function login() {
    try {
      await axios.post('/api/login', {
        name: name.value,
        password: password.value,
        captcha: captcha.value,
      })
      setIsLogin(true)
      navigate('/home')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(e: any) {
      if (e.isAxiosError) {
        alert('登陆失败:' + e.response?.data.msg)
      } else {
        throw e
      }
    }
  }

  if (isLogin) {
    return (
      <div>
        已登录，去<Link to={'/home'}>管理页面</Link>
      </div>
    )
  }
  
  return (
    <div>
      <div className="h-12 m-2 items-center flex">
        <label className="flex gap-2">
          <span className="w-12 inline-block text-right ">用户名</span>
          <input type="text" {...name} name="name"></input>
        </label>
        {/* {...name}相当于把useInput解构，把onChange和value都拿出来 */}
      </div>
      <div className="h-12 m-2 items-center flex">
        <label className="flex gap-2">
          <span className="w-12 inline-block text-right ">密码</span>
          <input type="password" {...password} name="password"></input>
        </label>
      </div>
      {/* <div className="h-12 m-2 items-center flex">
        <label className="flex gap-2">
          <span className="w-12 inline-block text-right ">验证码</span>
          <img className="bg-white" src="/api/captcha" alt="验证码"></img>
          <input type="text" {...captcha} name="captcha"></input>
        </label>
      </div> */}
      <button className="m-2 ml-20" onClick={login}>登录</button>
    </div>
  )
}