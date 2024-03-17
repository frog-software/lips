import Login from "./routes/login.svelte";
import MainPage from "./routes/mainpage.svelte";
import DoorPage from "./routes/doorPage.svelte";
import Register from "./routes/register.svelte";
import CreateChannel from "./routes/createChannel.svelte";
import CheckInformation from "./routes/checkInformation.svelte";
import SearchChannel from "./routes/searchChannel.svelte";
import SendNotification from "./routes/sendNotification.svelte";
import Participants from "./routes/participants.svelte";
import SelectTags from "./routes/selectTags.svelte";
import Mynotice from "./routes/mynotice.svelte";
import Chantemplate from "./routes/chantemplate.svelte";
import Checknotice from "./routes/checknotice.svelte";
import UpdateChannel from "./routes/updateChannel.svelte";
import Jumptag from "./routes/jumptag.svelte";
import InfoPage from "./routes/infoPage.svelte";
import Updatenotice from "./routes/updatenotice.svelte";
import Mychannels from "./routes/myChannels.svelte";
export default {
  "/": DoorPage,
  "/login": Login,
  "/main": MainPage,
  "/register": Register,
  "/createChannel": CreateChannel,
  "/checkInformation": CheckInformation,
  "/searchChannel": SearchChannel,
  "/postnotice": SendNotification,
  "/participants": Participants,
  "/selectTags": SelectTags,
  "/mynotice": Mynotice,
  "/chantemplate": Chantemplate,
  "/checknotice": Checknotice,
  "/updateChannel": UpdateChannel,
  "/jumptag": Jumptag,
  "/infoPage": InfoPage,
  "/updatenotice": Updatenotice,
  "/myChannels": Mychannels,
};
