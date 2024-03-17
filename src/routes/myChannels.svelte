<script>
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import { onMount } from "svelte";
  import Navbar from "../components/Navbar.svelte";
  import { push } from "svelte-spa-router";
  import { currentUserEmail, username, originChannelID } from "../store.js";

  const pb = new PocketBase(PocketBase_URL);
  let src = "userPicture.jpeg";
  let channels = [];

  async function getChannels() {
    const useremail = $currentUserEmail;
    const response_ = await pb.collection("users_channels").getFullList({
      sort: "-created",
      filter: `useremail="${useremail}"`,
    });
    channels = response_;
  }
  function jumpnew(origin) {
    originChannelID.set(origin);
    push("/chantemplate");
  }
  onMount(() => {
    getChannels();
  });
</script>

<Navbar />
<body>
  <div class="flex flex-col w-2/5 items-center h-dvh space-y-10 py-10">
    <img {src} alt="user" class="button-img" />
    <p class="text-7xl text-black">{$username}</p>
  </div>

  <div class="channel-container fixed right-0 top-0 w-3/5">
    {#each channels as channel}
      <div class="channel bg-transparent border-b border-gray-400">
        <button class="text-5xl" on:click={() => jumpnew(channel.originid)}
          >{channel.channelname}</button
        >
      </div>
    {/each}
  </div>
</body>

<style>
  .button-img {
    width: 360px; /* 设置图像的宽度 */
    height: 360px; /* 设置图像的高度为与宽度相同的值，以确保图像是正方形的 */
    border-radius: 50%; /* 这将使图像的边角变圆，形成圆形 */
    object-fit: cover; /* 确保图像在调整大小时保持其宽高比 */
  }
  .channel-container {
    position: fixed; /* 或absolute，根据需求和上下文确定 */
    top: 15vh; /* 从视口顶部向下20%的位置开始 */
    right: 0;
    width: 60%; /* 占据屏幕宽度的60% */
    height: 80vh; /* 占视口高度的80% */
    overflow-y: auto; /* 内容超出时显示滚动条 */
  }
  .channel {
    height: 25%; /* 每个频道占容器高度的20% */
  }
</style>
