import Login from './routes/login.svelte'
import MainPage from './routes/mainpage.svelte'
import DoorPage from './routes/doorPage.svelte'
import Register from './routes/register.svelte'
export default{
  '/':DoorPage,
  '/login-page':Login,
  '/main-page':MainPage,
  '/register-page':Register,
}
