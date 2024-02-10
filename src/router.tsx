/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PageUrl } from './constants/urls';

const Home = lazy(() => import('./pages/Home'));
const CreateBitmap = lazy(() => import('./pages/CreateBitmap'));
const EditBitmap = lazy(() => import('./pages/EditBitmap'));
const CreateBitmapFromImage = lazy(() => import('./pages/CreateBitmapFromImage'));

export const router = createBrowserRouter([
  {
    path: PageUrl.Home,
    element: <Home />,
  },
  {
    path: PageUrl.CreateBitmap,
    element: <CreateBitmap />,
  },
  {
    path: PageUrl.EditBitmap,
    element: <EditBitmap />,
  },
  {
    path: PageUrl.CreateBitmapFromImage,
    element: <CreateBitmapFromImage />,
  },
]);
