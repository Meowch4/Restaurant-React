import { Link } from "react-router";

export default function IndexView() {
  return (
    <div>
      <Link to={'/login'}>登录</Link>
      |
      <Link to={'/register'}>注册</Link>
    </div>
  )
}