import Login from './routes/login.svelte'
import MainPage from './routes/mainpage.svelte'
import DoorPage from './routes/doorPage.svelte'
import Register from './routes/register.svelte'
<<<<<<< HEAD
import CreateChannel from './routes/createChannel.svelte'
import CheckInformation from './routes/checkInformation.svelte'
import YourChannel from './routes/yourChannel.svelte'
export default {
  '/': DoorPage,
  '/login': Login,
  '/main': MainPage,
  '/register': Register,
  '/createChannel': CreateChannel,
  '/checkInformation': CheckInformation,
  '/yourChannel': YourChannel,

=======
export default{
  '/':DoorPage,
  '/login-page':Login,
  '/main-page':MainPage,
  '/register-page':Register,
>>>>>>> origin/frame
}
