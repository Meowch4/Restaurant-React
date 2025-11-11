import {
  createBrowserRouter,
  redirect,
} from "react-router";

import HomeView from './HomeView'
import Login from "./Login";
import IndexView from "./IndexView";
import React from "react";

const OrderManageView = React.lazy(() => import('./OrderManageView'))
const FoodManageView = React.lazy(() => import('./FoodManageView'))
const DeskManageView = React.lazy(() => import('./DeskManageView'))
const AddDeskView = React.lazy(() => import('./AddDeskView'))
const AddFoodView = React.lazy(() => import('./AddFoodView'))

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexView />,
  },
  {
    path: '/home',
    element: <HomeView/>,
    children: [
      {
        path: '',
        loader: () => redirect('/home/orders')
      },
      {
        path: 'orders',
        element: <OrderManageView />,
      },
      {
        path: 'foods',
        element: <FoodManageView />,
      },
      {
        path: 'add-food',
        element: <AddFoodView />
      },
      {
        path: 'desks',
        element: <DeskManageView />,
      },
      {
        path: 'add-desk',
        element: <AddDeskView />,
      }
    ]
  },
  {
    path: '/login',
    element: <Login />,
  }
]);

export default router
