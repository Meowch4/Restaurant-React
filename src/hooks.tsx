import { Checkbox } from "antd"
import { useCallback, useEffect, useMemo, useState } from "react"


export function useInput(init: string = '') {
  const [value, setValue] = useState(init)

  const onChange = useCallback(function(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }, [])

  return {
    value, 
    onChange,
  }
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState(localStorage.isDark ? true : false)
  
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-prefers-color-scheme', 'dark')
      document.documentElement.setAttribute('data-prefers-color', 'dark')
      localStorage.isDark = 'true'
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.removeAttribute('data-prefers-color-scheme')
      document.documentElement.removeAttribute('data-prefers-color')
      localStorage.isDark = ''
    }
  }, [isDark])

  const toggle = useCallback(() => {
    setIsDark(it => !it)
  }, [])

  const el = useMemo(() => {
    return (
      <span>
        <Checkbox checked={isDark} onChange={toggle}/>
        <span className="pl-2 text-base">深色模式</span>
      </span>
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark])

  // 加上as const 可以让他返回的东西顺序固定，不用担心类型推导错误
  return [isDark, toggle, el] as const
}