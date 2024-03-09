<script>
  import { push, location } from "svelte-spa-router";
  import { onDestroy } from "svelte";
  import CircleButtonForPush from "../components/CircleButtonForPush.svelte";
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import Modal from "./Modal.svelte";
  import { onMount } from "svelte";
  import { currentUserEmail } from "../store.js";
  const pb = new PocketBase(PocketBase_URL);
  let records = [];
  let showModal = false;
  let username = "";
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
  async function checkUser(){
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
  function toggleModal() {
    showModal = !showModal;
  }
  onMount(() => {
    checkchan();
    checkUser();
  });

  let src = "userPicture.jpeg";
  let showUserInformation = false;
  function ClickUser(state) {
    showUserInformation = !state;
  }

  function JumpNewPage(address) {
    push("/" + address);
  }
  let currentpath = "";
  const unsubscribe = location.subscribe(($location) => {
    currentpath = $location;
  });
  onDestroy(unsubscribe);
</script>

<h1>LIPS - Lightweight Information Portal Service</h1>

<body>
  <div class="left-side">
    <!-- 左边内容 -->
    <!-- <ul>
      <button class="circle" on:click={() => ClickUser(showUserInformation)}>
        <img {src} alt="user" class="button-img" />
      </button>
      <div style:display={showUserInformation ? "block" : "none"}>
        <li>
          <button on:click={() => JumpNewPage("checkInformation")}>
            Todolist
          </button>
        </li>
        <li>
          <button on:click={() => JumpNewPage("login")}> 登出 </button>
        </li>
      </div>
    </ul> -->
    <img {src} alt="user" class="button-img" />
    <p class="username">{username}</p>
    <button on:click={() => JumpNewPage("login")}> 登出 </button>
  </div>
  <div class="right-side">
    <!-- 右边内容 -->
    <button on:click={toggleModal} class="button-present">我的频道</button>
    <Modal isOpen={showModal} close={toggleModal}>
      <h2 style="color: black;">频道</h2>

      <div class="container">
        {#each records as record}
          <button class="button">#{record.channelname}</button>
        {/each}
      </div>
    </Modal>
    <button class="button-present"on:click={() => JumpNewPage("searchChannel")}> 搜索频道 </button>
    <button class="button-present"on:click={() => JumpNewPage("createChannel")}> 创建频道 </button>
    <button class="button-present"on:click={() => JumpNewPage("checkInformation")}> 待办事项 </button>
    <!-- <div class="button-manage">
      <CircleButtonForPush
        address="/searchChannel"
        info="查找频道"
        src="searchChannelPicture.jpg"
      />
      <CircleButtonForPush
        address="/createChannel"
        info="创建频道"
        src="createChannelPicture.jpg"
      />
      <CircleButtonForPush
        address="/selectTags"
        info="筛选标签"
        src="selectTagsPicture.jpg"
      />
      <CircleButtonForPush
        address="/postnotice"
        info="发送通知"
        src="postnoticePicture.jpg"
      />
      <CircleButtonForPush
        address="/participants"
        info="频道成员"
        src="participantsPicture.jpg"
      />
    </div>
  </div> -->
</body>

<!-- <body>
  {#if currentpath == "/main"}
    <ul>
      <button class="circle" on:click={() => ClickUser(showUserInformation)}>
        <img {src} alt="user" class="button-img" />
      </button>
      <div style:display={showUserInformation ? "block" : "none"}>
        <li>
          <button on:click={() => JumpNewPage("checkInformation")}>
            Todolist
          </button>
        </li>
        <li>
          <button on:click={() => JumpNewPage("login")}> 登出 </button>
        </li>
      </div>
    </ul>
  {/if} -->

<!-- </body> -->

<!-- <button on:click={toggleModal} class="button-present">我的频道</button>
<Modal isOpen={showModal} close={toggleModal}>
  <h2 style="color: black;">频道</h2>
  
  <div class="container">
    {#each records as record}
      <button class="button">#{record.channelname}</button>
    {/each}
  </div>

</Modal>
<div class="button-manage">

  <CircleButtonForPush
    address="/searchChannel"
    info="查找频道"
    src="searchChannelPicture.jpg"
  />
  <CircleButtonForPush
    address="/createChannel"
    info="创建频道"
    src="createChannelPicture.jpg"
  />
  <CircleButtonForPush
    address="/selectTags"
    info="筛选标签"
    src="selectTagsPicture.jpg"
  />
  <CircleButtonForPush
    address="/postnotice"
    info="发送通知"
    src="postnoticePicture.jpg"
  />
  <CircleButtonForPush
    address="/participants"
    info="频道成员"
    src="participantsPicture.jpg"
  />
</div> -->

<style>
  html,
  body {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    display: flex;
  }

  .username{
    font-size: 27px; /* 或任何您喜欢的大小 */
  }

  .left-side {
    width: 40%;
    height: 100vh;
    /* background-color: #f0f0f0; */
    /* 添加更多样式 */
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
    color: #FFFFFF; /* 选择一个与悬停背景色对比度高的颜色 */
    opacity: 1; /* 确保按钮和文本在悬停时不会变得透明 */
    /* 确保没有将文本设置为不可见 */
    background-color: #6a6d6e; /* 悬停时的背景颜色 */
    
}
  .circle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    border: none;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .button-img {
    width: 360px; /* 设置图像的宽度 */
    height: 360px; /* 设置图像的高度为与宽度相同的值，以确保图像是正方形的 */
    border-radius: 50%; /* 这将使图像的边角变圆，形成圆形 */
    object-fit: cover; /* 确保图像在调整大小时保持其宽高比 */
  }
  .button-manage {
    display: grid;
    grid-template-columns: 1fr;
    width: 30px;
    height: 150px;
  }

  .container {
    max-width: 300px;
    max-height: 200px; /* 设置列表的最大高度 */
    overflow-y: auto; /* 超出部分显示滚动条 */
    background: #f9f9f9; /* 背景色，可根据需要调整 */
    border-radius: 5px; /* 边框圆角 */
    padding: 10px; /* 内边距 */
  }
  .button {
    width: 60%;
    margin-top: 10px;
    padding: 10px;
    background-color: black;
    border-radius: 4px;
  }
</style>
