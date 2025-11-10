import {
  createBrowserRouter,
  redirect,
} from "react-router";

import HomeView from './HomeView'
import Login from "./Login";
import IndexView from "./IndexView";
import React from "react";
import AddFoodView from "./AddFoodView";

const OrderManageView = React.lazy(() => import('./OrderManageView'))
const FoodManageView = React.lazy(() => import('./FoodManageView'))
const DeskManageView = React.lazy(() => import('./DeskManageView'))

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
    ]
  },
  {
    path: '/login',
    element: <Login />,
  }
]);

export default router
