<script>
  import { push, location } from "svelte-spa-router";
  import { onDestroy } from "svelte";
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import { onMount } from "svelte";
  import { currentUserEmail } from "../store.js";
  const pb = new PocketBase(PocketBase_URL);
  let records = [];
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
    checkchan();
    checkUser();
  });

  let src = "userPicture.jpeg";
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
    <img {src} alt="user" class="button-img" />
    <p class="username">{username}</p>
    <button on:click={() => JumpNewPage("login")}> 登出 </button>
  </div>
  <div class="right-side">
    <button class="button-present" on:click={() => JumpNewPage("mychannel")}>
      频道</button
    >

    <button class="button-present" on:click={() => JumpNewPage("mynotice")}>
      通知
    </button>
    <button
      class="button-present"
      on:click={() => JumpNewPage("checkInformation")}
    >
      待办事项
    </button>
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
</style>
