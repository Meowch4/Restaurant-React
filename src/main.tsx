import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router";
import router from './router.tsx'

import { configure } from 'mobx'
configure({
  enforceActions: 'never',
})

import 'antd-mobile/es/global'

// @ts-ingnore
import { unstableSetRender } from 'antd-mobile'; // Support since version ^5.40.0

unstableSetRender((node, container) => {
  const c = container as HTMLElement & { _reactRoot?: ReturnType<typeof createRoot> }
  c._reactRoot ||= createRoot(c)
  const root = c._reactRoot

  root.render(node)

  return async () => {
    await new Promise(resolve => setTimeout(resolve, 0))
    root.unmount()
  }
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
)
