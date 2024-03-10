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
import Mychannel from "./routes/mychannel.svelte";
import Mynotice from "./routes/mynotice.svelte";
import Chantemplate from "./routes/chantemplate.svelte";
import Checknotice from "./routes/checknotice.svelte";

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
  "/mychannel": Mychannel,
  "/mynotice": Mynotice,
  "/chantemplate": Chantemplate,
  "/checknotice": Checknotice,
};
