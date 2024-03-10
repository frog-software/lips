<script>
  import { push } from "svelte-spa-router";
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import { onMount } from "svelte";
  import Modal from "./Modal.svelte";
  import { currentUserEmail, currentchannelid ,currentnoticeid } from "../store.js";

  const pb = new PocketBase(PocketBase_URL);
  let username = "";
  let records = [];
  let showModal = false;
  let showModal2 = false;
  let showModal3 = false;
  let showModal4 = false;

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
  
  function check(id) {
    currentnoticeid.set(id);
    push("/checknotice");
  }

  function toggleModal() {
    showModal = !showModal;
  }
  function toggleModal2(){
    showModal2 = !showModal2;
  }
  function toggleModal3(){
    showModal3 = !showModal3;
  }
  function toggleModal4(){
    showModal4 = !showModal4;
  }


  function jumpnew(id) {
    currentchannelid.set(id);
    push("/chantemplate");
  }

  async function checkUser() {
    try {
      const userEmail = $currentUserEmail;
      const response_ = await pb.collection("users").getFullList({
        sort: "-created",
        filter: `email="${userEmail}"`,
      });
      username = response_[0].username;
    } catch (error) {
      alert("fail to find");
    }
  }
  onMount(() => {
    checkUser();
    checkchan();
    checkNotice();
  });

  let src = "userPicture.jpeg";
  function JumpNewPage(address) {
    push("/" + address);
  }
</script>

<h1>LIPS - Lightweight Information Portal Service</h1>

<body>
  <div class="left-side">
    <img {src} alt="user" class="button-img" />
    <p class="username">{username}</p>
    <button on:click={() => JumpNewPage("login")}> 登出 </button>
  </div>

  <div class="right-side">
    <button class="button-present" on:click={toggleModal}>频道管理</button>
    <Modal isOpen={showModal} close={toggleModal}>
      <h2 style="color: black;">频道管理</h2>
      <div class="container">
        <!-- {#each records as record}
          <button class="button01" on:click={() => jumpnew(record.id)}
            >#{record.channelname}</button
          >
        {/each} -->
        <button class="button01" on:click={() => JumpNewPage("createChannel")}>
          创建频道
        </button>
        <button class="button01" on:click={() => JumpNewPage("searchChannel")}>
          查找频道
        </button>
        <button class="button01" on:click={toggleModal2}>我的频道</button>
        <Modal isOpen={showModal2} close={toggleModal2}>
          <div>
            <h2 style="color: black;">频道管理</h2>
      <div class="container">
        {#each records as record}
          <button class="button01" on:click={() => jumpnew(record.id)}
            >#{record.channelname}</button
          >
        {/each}
      </div>
          </div>
        </Modal>
      </div>
    </Modal>
    <!-- <button class="button-present" on:click={() => JumpNewPage("mychannel")}>
      频道</button
    > -->

    <!-- <button class="button-present" on:click={() => JumpNewPage("mynotice")}>
      通知管理
    </button> -->
    <button class="button-present" on:click={toggleModal3}>通知管理</button>
    <Modal isOpen={showModal3} close={toggleModal3}>
      <h2 style="color: black;">通知管理</h2>
      <div class="container">
        {#each recordsNotice as record}
      <div
        class="record"
        role="button"
        tabindex="0"
        on:click={() => check(record.id)}
        on:keypress
      >
        <div class="title">{record.tittle}</div>
        <div class="content">#{record.tag}</div>
        <div class="author">from:{record.username}</div>
      </div>
    {/each}
      </div>
    </Modal>

    <button class="button-present" on:click={toggleModal4}>待办事项</button>
    <Modal isOpen={showModal4} close={toggleModal4}>
      <h2 style="color: black;">待办事项</h2>
      <div class="container">
        
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
  body {
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
  }
  .username {
    font-size: 27px; /* 或任何您喜欢的大小 */
  }

  .left-side {
    width: 40%;
    height: 100vh;
    /* background-color: #f0f0f0; */
    /* 添加更多样式 */
  }
  .button01 {
    width: 200px;
    margin-top: 10px;
    padding: 15px;
    background-color: black;
    border-radius: 4px;
  }
  .button01:hover {
    color: #ffffff;
    opacity: 1;
    background-color: #6a6d6e;
  }
  .right-side {
    width: 60%;
    height: 100vh;
    /* background-color: #fff; */
    /* 添加更多样式 */
  }
  .button-present {
    /* display: flex; */
    justify-content: center;
    align-items: center;
    font-size: 50px; /* 或者更大，根据需要调整 */
    letter-spacing: 50px; /* 增加字符间距，可以根据需要调整这个值 */
    width: 80%; /* 增加宽度比例至90% */
    margin-top: 10px;
    padding: 10px 20px; /* 维持水平内边距以增加按钮的宽度 */
    background-color: black;
    border-radius: 20px; /* 增加border-radius的值使角变得更圆 */
    margin-right: 20px; /* 为每个按钮添加右边距 */
    margin-bottom: 20px; /* 为每个按钮下方添加10px的间隔 */
    text-align: center;
  }

  .button-present:hover {
    color: #ffffff; /* 选择一个与悬停背景色对比度高的颜色 */
    opacity: 1; /* 确保按钮和文本在悬停时不会变得透明 */
    /* 确保没有将文本设置为不可见 */
    background-color: #6a6d6e; /* 悬停时的背景颜色 */
  }
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
</style>
