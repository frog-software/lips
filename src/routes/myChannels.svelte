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
    currentchannelName,
  } from "../store.js";

  const pb = new PocketBase(PocketBase_URL);
  let src = "userPicture.jpeg";
  let channels = [];
  let createdChannels = [];
  let currentView = "joined"; // 'joined' 或 'created'

  async function getChannels() {
    const useremail = $currentUserEmail;
    const response_ = await pb.collection("users_channels").getFullList({
      sort: "-created",
      filter: `useremail="${useremail}"`,
    });
    channels = response_;
  }
  async function getCreatedChannels() {
    const useremail = $currentUserEmail;
    const response = await pb.collection("channels").getFullList({
      sort: "-created",
      filter: `useremail="${useremail}"`,
    });
    createdChannels = response;
  }

  function editChannel(channelName) {
    currentchannelName.set(channelName);
    push("/updateChannel");
  }

  async function leftChannel(channelname) {
    const currentUseremail = $currentUserEmail; // 确保这里正确获取当前用户邮箱
    if (!confirm("确定要退出这个频道吗？")) {
      return; // 用户取消操作，直接返回
    }
    try {
      // 使用 useremail 和 channelname 作为过滤条件
      const userChannels = await pb.collection("users_channels").getFullList({
        filter: `useremail="${currentUseremail}" && channelname="${channelname}"`,
      });

      for (const userChannel of userChannels) {
        await pb.collection("users_channels").delete(userChannel.id);
      }
      // 从本地列表中移除
      channels = channels.filter(
        (channel) => channel.channelname !== channelname,
      );

      // 重新获取频道列表，如果这是必要的
      getChannels();

      alert("成功退出频道。");
    } catch (error) {
      console.error("退出频道失败：", error);
      alert("退出频道失败。");
    }
  }

  async function deleteChannel(channelName) {
    if (!confirm("确定要删除这个频道吗？")) {
      return; // 用户取消操作，直接返回
    }
    try {
      // 查找channels集合中的指定频道
      const channels = await pb.collection("channels").getFullList({
        filter: `channelName="${channelName}"`,
      });
      for (const channel of channels) {
        // 删除找到的频道
        await pb.collection("channels").delete(channel.id);
      }

      // 查找并删除users_channels集合中所有与该频道相关的条目
      const userChannels = await pb.collection("users_channels").getFullList({
        filter: `channelname="${channelName}"`,
      });
      for (const userChannel of userChannels) {
        await pb.collection("users_channels").delete(userChannel.id);
      }
      // 使用.filter()方法移除条目后直接赋值
      createdChannels = createdChannels.filter(
        (channel) => channel.channelName !== channelName,
      );
      getCreatedChannels(); // 重新获取频道列表
      getChannels();
      alert("频道及相关数据删除成功。");
    } catch (error) {
      console.error("删除频道及相关数据失败：", error);
      alert("删除频道及相关数据失败。");
    }
  }

  function switchView(view) {
    currentView = view;
    if (view === "joined") {
      getChannels();
    } else {
      getCreatedChannels();
    }
  }

  function jumpnew(origin, name) {
    channelName.set(name);
    originChannelID.set(origin);
    push("/chantemplate");
  }
  onMount(() => {
    getChannels();
    getCreatedChannels();
  });
</script>

<Navbar />
<body>
  <div class="flex flex-col w-2/5 items-center h-dvh space-y-10 py-10">
    <img {src} alt="user" class="button-img" />
    <p class="text-7xl text-black">{$username}</p>
  </div>

  <div class="controls fixed right-12 top-14 p-4">
    <button class="toggle-btn" on:click={() => switchView("joined")}
      >已加入的频道</button
    >
    <button class="toggle-btn" on:click={() => switchView("created")}
      >我创建的频道</button
    >
  </div>

  <div class="channel-container fixed right-0 top-0 w-3/5">
    {#if currentView === "joined"}
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
            <button
              class="exit-btn"
              on:click={() => leftChannel(channel.channelname)}>退出</button
            >
            <div class="channel-date text-sm">
              {channel.year}年{channel.month}月{channel.day}日加入
            </div>
          </div>
        </div>
      {/each}
    {:else}
      {#each createdChannels as channel}
        <div class="channel bg-transparent border-b border-gray-400 p-4">
          <div
            class="channel-name text-3xl mb-2"
            on:click={() => jumpnew(channel.originid, channel.channelname)}
            role="button"
            tabindex="0"
            on:keypress
          >
            {channel.channelName}
          </div>
          <div class="channel-info flex justify-between items-center w-full">
            <div class="channel-description text-sm">
              {channel.channelDescription}
            </div>
            <button
              class="edit-btn"
              on:click={() => editChannel(channel.channelName)}>修改</button
            >
            <button
              class="delete-btn"
              on:click={() => deleteChannel(channel.channelName)}>删除</button
            >
            <div class="channel-date text-sm">
              {channel.year}年{channel.month}月{channel.day}日加入
            </div>
          </div>
        </div>
      {/each}
    {/if}
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

  .toggle-btn {
    margin-left: 20px; /* 如果您希望按钮之间有间距 */
    color: black;
  }

  .channel-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 10%; /* 或您想要的任何百分比 */
  }

  .exit-btn,
  .edit-btn,
  .delete-btn {
    /* 删除 margin-top 并添加必要的右边距 */
    padding: 5px 15px;

    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    /* 如果需要按钮右对齐，删除margin-right并使用以下属性 */
    margin-left: auto;
  }

  .exit-btn {
    background-color: #dc3545;
    color: white;
  }

  .exit-btn:hover {
    background-color: #c82333;
  }

  .edit-btn {
    background-color: #ffc107;
    color: white;
  }

  .edit-btn:hover {
    background-color: #e0a800;
  }

  .delete-btn {
    background-color: #28a745;
    color: white;
  }

  .delete-btn:hover {
    background-color: #218838;
  }
</style>
