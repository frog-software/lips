<script>
  import { push } from "svelte-spa-router";
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import { onMount } from "svelte";
  import Modal from "./Modal.svelte";
  import EditChannelModal from "./EditChannelModal.svelte";
  import Navbar from "../components/Navbar.svelte";
  import {
    currentUserEmail,
    currentchannelid,
    currentnoticeid,
    currentchannelName,
    originChannelID,
    isJoinedTodo,
    username,
  } from "../store.js";
  
  const pb = new PocketBase(PocketBase_URL);
  let records = [];
  let createdChannels = []; // 存储用户创建的频道列表
  let currentTab = "joined"; // 控制显示'joined'或'created'列表
  let showModal = false;
  let showModal2 = false;
  let showModal3 = false;
  let showModal4 = false;
  let selectedChannel = null;

  function editChannel(channelName) {
    currentchannelName.set(channelName);
    push("/updateChannel");
    // const channel = createdChannels.find((c) => c.channelName === channelName);
    // if (channel) {
    //   selectedChannel = channel;
    // }
  }

  function handleUpdate() {
    fetchCreatedChannels(); // 重新获取频道列表
    checkchan();
    selectedChannel = null; // 重置selectedChannel，关闭编辑模态框
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
      fetchCreatedChannels(); // 重新获取频道列表
      checkchan();
      alert("频道及相关数据删除成功。");
    } catch (error) {
      console.error("删除频道及相关数据失败：", error);
      alert("删除频道及相关数据失败。");
    }
  }

  async function checkchan() {
    try {
      const userEmail = $currentUserEmail;
      const response = await pb.collection("users_channels").getFullList({
        sort: "-created",
        filter: `useremail="${userEmail}"`,
      });
      records = response;
    } catch (error) {
      alert("fail to find");
    }
  }

  async function fetchCreatedChannels() {
    try {
      const userEmail = $currentUserEmail;
      const response = await pb.collection("channels").getFullList({
        filter: `useremail="${userEmail}"`,
      });
      createdChannels = response;
    } catch (error) {
      alert("Failed to fetch created channels");
    }
  }

  let recordsNotice = [];
  async function checkNotice() {
    try {
      const userEmail = $currentUserEmail;
      const response = await pb.collection("notices").getFullList({
        sort: "-created",
        filter: `useremail="${userEmail}"`,
      });
      recordsNotice = response;
    } catch (error) {
      alert("fail to find");
    }
  }
  let todo = [];
  async function checkTodolist() {
    try {
      const userEmail = $currentUserEmail;
      const response = await pb.collection("todolist").getFullList({
        sort: "-created",
        filter: `useremail="${userEmail}"`,
      });
      todo = response;
    } catch (error) {
      alert("fail to find");
    }
  }

  async function check(id, title) {
    currentnoticeid.set(id);
    const uEmail = $currentUserEmail;
    const response = await pb.collection("todolist").getFullList({
      sort: "-created",
      filter: `useremail="${uEmail}"`,
    });

    for (const item of response) {
      if (item.tittle == title) {
        isJoinedTodo.set("find");
        break;
      } else {
        isJoinedTodo.set("noFind");
      }
    }
    push("/checknotice");
  }

  function toggleModal() {
    showModal = !showModal;
  }
  function toggleModal2() {
    showModal2 = !showModal2;
  }
  function toggleModal3() {
    showModal3 = !showModal3;
  }
  function toggleModal4() {
    showModal4 = !showModal4;
  }

  function jumpnew(id, origin) {
    currentchannelid.set(id);
    originChannelID.set(origin);
    push("/chantemplate");
  }
  // async function test(id,cN){
  //   currentchannelid.set(id);
  //   alert($currentchannelid);
  //   push("/chantemplate");
  //     const response_ = await pb.collection("channels").getFullList({
  //       sort: "-created",
  //       filter: `channelName="${cN}"`,
  //     });
  //     originChannelID.set(response_[0].id);
  //     originChannelID.set(response_[0].id);
  // }

  async function checkUser() {
    try {
      const userEmail = $currentUserEmail;
      const response_ = await pb.collection("users").getFullList({
        sort: "-created",
        filter: `email="${userEmail}"`,
      });
      username.set(response_[0].username)
    } catch (error) {
      alert("fail to find");
    }
  }

  
  //   function sleep(ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }

  // async function updateOriginChannelId(cN) {
  //   try {
  //     const response_ = await pb.collection("channels").getFullList({
  //       sort: "-created",
  //       filter: `channelName="${cN}"`,
  //     });
  //     originChannelID.set(response_[0].id);

  //       originChannelID.set(response_[0].id);

  //     alert($originChannelID);

  //   } catch {
  //     alert("error");
  //   }
  // }
  async function jumptodo(title) {
    const response_ = await pb.collection("notices").getFullList({
      sort: "-created",
      filter: `tittle="${title}"`,
    });

    currentnoticeid.set(response_[0].id);
    const uEmail = $currentUserEmail;
    const response = await pb.collection("todolist").getFullList({
      sort: "-created",
      filter: `useremail="${uEmail}"`,
    });

    for (const item of response) {
      if (item.tittle == title) {
        isJoinedTodo.set("find");
        break;
      } else {
        isJoinedTodo.set("noFind");
      }
    }
    push("/checknotice");
  }
  onMount(() => {
    checkUser();
    checkchan();
    checkNotice();
    fetchCreatedChannels();
    checkTodolist();
  });

  let src = "userPicture.jpeg";
  function JumpNewPage(address) {
    push("/" + address);
  }
</script>

<Navbar/>

<body>
  <div class="flex flex-col w-2/5 items-center h-dvh space-y-10 py-10">
    <img {src} alt="user" class="button-img" />
    <p class="text-7xl text-black">{$username}</p>
    <button class="btn" on:click={() => JumpNewPage("login")}> 登出 </button>
  </div>

  <div class="flex flex-col space-y-10 w-3/5 h-dvh py-10">
    <button class="btn w-4/5 h-1/5 text-5xl" on:click={toggleModal}
      >频道管理</button
    >
    <Modal isOpen={showModal} close={toggleModal}>
      <h2 style="color: black;">频道管理</h2>
      <div class="container flex flex-col space-y-3 items-center">
        <!-- {#each records as record}
          <button class="button01" on:click={() => jumpnew(record.id)}
            >#{record.channelname}</button
          >
        {/each} -->
        <button
          class="btn btn-primary w-2/3 text-lg"
          on:click={() => JumpNewPage("createChannel")}
        >
          创建频道
        </button>
        <button
          class="btn btn-primary w-2/3 text-lg"
          on:click={() => JumpNewPage("searchChannel")}
        >
          查找频道
        </button>
        <button class="btn btn-primary w-2/3 text-lg" on:click={toggleModal2}
          >我的频道</button
        >
      </div>
    </Modal>

    <Modal isOpen={showModal2} close={toggleModal2}>
      <div class="tabs">
        <button
          class="tab-btn"
          class:selected={currentTab === "joined"}
          on:click={() => (currentTab = "joined")}>已加入的频道</button
        >
        <button
          class="tab-btn"
          class:selected={currentTab === "created"}
          on:click={() => (currentTab = "created")}>我创建的频道</button
        >
      </div>
      {#if currentTab === "joined"}
        <div class="container01">
          {#each records as record}
            <button
              class="button02"
              on:click={() => jumpnew(record.id, record.originid)}
              >#{record.channelname}</button
            >
          {/each}
        </div>
      {/if}
      {#if currentTab === "created"}
        <div class="container01">
          {#each createdChannels as channel}
            <div class="channel-row">
              <button
                class="button02"
                on:click={() => jumpnew(channel.id, channel.originid)}
              >
                #{channel.channelName}
              </button>
              <button
                class="edit-btn"
                on:click={() => editChannel(channel.channelName)}>修改</button
              >
              <button
                class="delete-btn"
                on:click={() => deleteChannel(channel.channelName)}>删除</button
              >
            </div>
          {/each}
        </div>
      {/if}
      {#if selectedChannel}
        <EditChannelModal
          channel={selectedChannel}
          on:update={handleUpdate}
          on:close={() => (selectedChannel = null)}
        />
      {/if}
    </Modal>
    <!-- <button class="button-present" on:click={() => JumpNewPage("mychannel")}>
      频道</button
    > -->

    <!-- <button class="button-present" on:click={() => JumpNewPage("mynotice")}>
      通知管理
    </button> -->
    <button class="btn w-4/5 h-1/5 m-100 text-5xl" on:click={toggleModal3}
      >通知管理</button
    >
    <Modal isOpen={showModal3} close={toggleModal3}>
      <h2 style="color: black;">通知管理</h2>
      <div class="container">
        {#each recordsNotice as record}
          <div
            class="record"
            role="button"
            tabindex="0"
            on:click={() => check(record.id, record.tittle)}
            on:keypress
          >
            <div class="title">{record.tittle}</div>
            <div class="content">#{record.tag}</div>
            <div class="author">from:{record.username}</div>
          </div>
        {/each}
      </div>
    </Modal>

    <button class="btn w-4/5 h-1/5 text-5xl" on:click={toggleModal4}
      >待办事项</button
    >
    <Modal isOpen={showModal4} close={toggleModal4}>
      <h2 style="color: black;">待办事项</h2>
      <div class="container">
        {#each todo as todothing}
          <div
            class="record"
            role="button"
            tabindex="0"
            on:click={() => jumptodo(todothing.tittle)}
            on:keypress
          >
            <div class="title">{todothing.tittle}</div>
            <div class="content">#{todothing.tag}</div>
            <div class="author">
              from:{todothing.year}/{todothing.month}/{todothing.day}
            </div>
          </div>
        {/each}
      </div>
    </Modal>
    <!-- <button
      class="button-present"
      on:click={() => JumpNewPage("checkInformation")}
    >
      待办事项
    </button> -->
  </div></body
>

<style>
  .button-img {
    width: 360px; /* 设置图像的宽度 */
    height: 360px; /* 设置图像的高度为与宽度相同的值，以确保图像是正方形的 */
    border-radius: 50%; /* 这将使图像的边角变圆，形成圆形 */
    object-fit: cover; /* 确保图像在调整大小时保持其宽高比 */
  }
  .container {
    width: 300px;
    height: 220px; /* 设置列表的最大高度 */
    overflow-y: auto; /* 超出部分显示滚动条 */
    background: #f9f9f9; /* 背景色，可根据需要调整 */
    border-radius: 5px; /* 边框圆角 */
    padding: 10px; /* 内边距 */
  }
  .record {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #ffffff;
  }

  .title {
    color: black;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .content {
    color: black;
    font-size: 16px;
  }

  .author {
    font-size: 14px;
    color: #666;
  }
  .tabs {
    display: flex;
    justify-content: center; /* 居中对齐以适应现代设计 */
    background-color: #333; /* 深色背景以强调选项卡 */
    padding: 1rem;
    gap: 1rem; /* 添加间隙确保视觉分隔 */
  }

  .tab-btn {
    background-color: transparent;
    border: none;
    padding: 0.5rem 1rem;
    color: #ccc; /* 淡色字体 */
    font-size: 1rem;
    cursor: pointer;
    transition:
      color 0.3s,
      background-color 0.3s; /* 平滑过渡效果 */
  }

  .tab-btn:hover,
  .tab-btn.selected {
    color: #fff; /* 高亮颜色 */
    background-color: #555; /* 按钮背景变化 */
    border-radius: 20px; /* 圆角效果 */
  }

  .button02 {
    width: 50%;
    margin-top: 0.5rem;
    padding: 0.5rem 0;
    color: #fff;
    background: linear-gradient(to right, #575757, #414141); /* 添加渐变背景 */
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease-in-out; /* 平滑所有过渡效果 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 添加轻微阴影效果 */
    position: relative; /* 为了做出点击效果，需要相对定位 */
    overflow: hidden; /* 防止子元素溢出 */
  }

  .button02::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(255, 255, 255, 0.1); /* 轻微的白色覆盖层 */
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .button02:hover {
    background: linear-gradient(
      to right,
      #656565,
      #4b4b4b
    ); /* 悬停时更深的渐变色 */
  }

  .button02:hover::after {
    opacity: 1; /* 鼠标悬停时显示白色覆盖层 */
  }

  .button02:active {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2); /* 按钮按下时的内部阴影 */
  }

  .container01 {
    background-color: #2c2c2c; /* 深色背景 */
    max-width: 100%; /* 充满可用宽度 */
    max-height: 200px; /* 固定高度 */
    overflow-y: auto; /* 启用滚动 */
    padding: 1rem; /* 更多内边距 */
    border-radius: 10px; /* 圆角效果 */
    margin-top: 1rem; /* 与选项卡分隔 */
  }
  /* 滚动条样式 */
  .container01::-webkit-scrollbar {
    width: 6px;
  }

  .container01::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
  }

  .container01::-webkit-scrollbar-track {
    background-color: #333;
  }
  .edit-btn,
  .delete-btn {
    margin-left: 0.5rem;
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
    background-color: #4e4e4e; /* 按钮的背景颜色 */
    color: white;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .edit-btn:hover {
    background-color: #5c5c5c; /* 修改按钮悬停时的背景颜色 */
  }

  .delete-btn:hover {
    background-color: #a54444; /* 删除按钮悬停时的背景颜色 */
  }

  .channel-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
</style>
