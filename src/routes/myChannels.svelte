<script>
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import { onMount } from "svelte";
  import Navbar from "../components/Navbar.svelte";
  import { push } from "svelte-spa-router";
  import {
    currentUserEmail,
    username,
    originChannelID,
    channelName,
  } from "../store.js";

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
  function jumpnew(origin, name) {
    channelName.set(name);
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
      <div class="channel bg-transparent border-b border-gray-400 p-4">
        <div
          class="channel-name text-3xl mb-2"
          on:click={() => jumpnew(channel.originid, channel.channelname)}
          role="button"
          tabindex="0"
          on:keypress
        >
          {channel.channelname}
        </div>
        <div class="channel-info flex justify-between items-center w-full">
          <div class="channel-description text-sm">
            {channel.channelDescription}
          </div>
          <div class="channel-date text-sm">
            {channel.year}年{channel.month}月{channel.day}日加入
          </div>
        </div>
      </div>
    {/each}
  </div>
</body>

<style>
  .channel-container {
    display: flex;
    flex-direction: column;
  }

  .channel {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* 确保内容靠父容器的左边 */
  }

  .channel-name {
    /* 字体最大，您已经在HTML中通过text-5xl设置了 */
    margin-left: 10px; /* 紧靠父容器左边并保留一定距离 */
  }

  .channel-description {
    /* 字体偏中，通过text-xl设置 */
    margin-top: 2px; /* 与上一行保留一定距离 */
    margin-left: 10px; /* 紧靠父容器左边并保留一定距离 */
  }

  .channel-date {
    /* 字体最小，通过text-sm设置 */
    margin-top: 4px; /* 与上一行保留一定距离 */
    margin-left: 10px; /* 紧靠父容器左边并保留一定距离 */
  }

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
