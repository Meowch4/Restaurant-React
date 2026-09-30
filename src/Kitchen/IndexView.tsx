import { Link } from "react-router";

export default function IndexView() {
  return (
    <div className="min-h-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <main className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border p-8 shadow-sm">
        <p className="text-sm text-blue-600 font-medium">Restaurant React · 在线演示</p>
        <h1 className="text-3xl font-bold mt-2">餐厅点餐与后厨管理系统</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-4">
          可以分别打开顾客端和后厨端，体验扫码点餐、实时购物车和新订单通知。
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          <Link className="rounded-xl bg-blue-600 text-white p-5" to="/landing/r/1/d/1">
            <strong className="block text-lg">进入顾客点餐端</strong>
            <span className="text-sm opacity-90">A01 桌 · 无需登录</span>
          </Link>
          <Link className="rounded-xl border border-slate-300 dark:border-slate-600 p-5" to="/login">
            <strong className="block text-lg">进入后厨管理端</strong>
            <span className="text-sm text-slate-500">演示账号：a / a</span>
          </Link>
        </div>
        <p className="text-xs text-slate-500 mt-6">这是可重置的演示环境，请勿填写真实个人信息。</p>
      </main>
    </div>
  )
}
