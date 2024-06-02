<script>
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import {
    currentUserEmail,
    originChannelID,
    username,
    channelName,
  } from "../store.js";
  import { push } from "svelte-spa-router";
  import { onMount } from "svelte";
  import Navbar from "../components/Navbar.svelte";

  const pb = new PocketBase(PocketBase_URL);
  let isFind = false;
  let myChannel = [];
  let recChannel = [];
  async function checkIsJoined() {
    try {
      const userEmail = $currentUserEmail;
      const response = await pb.collection("users_channels").getFullList({
        sort: "-created",
        filter: `useremail="${userEmail}"`,
      });
      const records = await pb.collection("channels").getFullList();
      recChannel = records;
      myChannel = response;
      if (myChannel != null) {
        isFind = true;
      }
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
      username.set(response_[0].username);
    } catch (error) {
      alert("fail to find");
    }
  }
  function jumpnew(origin, Cname) {
    //currentchannelid.set(id);
    originChannelID.set(origin);
    channelName.set(Cname);
    //alert(channelName);
    push("/chantemplate");
  }

  onMount(() => {
    checkIsJoined();
    checkUser();
  });
</script>

<Navbar />

<div class="genshin">
  <div class="container">
    <div class="left">
      <div class="top">
        <div class="blockTitle">My channels</div>
        {#if isFind}
          {#each myChannel.slice(0, 5) as mychannel}
            <button class="channel" on:click={() => jumpnew(mychannel.originid)}
              >{mychannel.channelname}</button
            >
          {/each}
        {:else}
          <p style="color:black">您还没有加入频道，快去加入一个吧!</p>
        {/if}
      </div>
      <div class="bottom">
        <div class="blockTitle">Recommended channels</div>
        {#each recChannel.slice(0, 5) as mychannel}
          <button class="channel" on:click={() => jumpnew(mychannel.id)}
            >{mychannel.channelName}</button
          >
        {/each}
      </div>
    </div>

    <div class="right">
      <h1 class="articleHead">欢 迎 来 到 LIPS！</h1>
      <p class="articleBody">
        关于lips：
        我们是一个轻量型信息门户网站，在这里，你可以根据自己的需求选择你想要加入的频道，你可以寻找频道里志同道合的伙伴，你可以发布频道招兵买马亦或是寻求帮助，你也可以浏览不同的频道，得到一些对自己有用的信息，总而言之，在lips开启你的探索之旅吧！
        关于左侧的两个方框，如果你是一名初来乍到的新用户，我们建议你到推荐频道里看看，在这里我们为你精心准备了五个热门频道，你可以点击查看并寻找有没有你喜欢的领域。或者你可以把视线拉到右上角的搜索框，去搜索你想要寻找的频道，如果你发现了中意的频道，你可以点击并申请加入，如果没有密码的话你可以直接成为频道成员，与此同时，我们在一开始的左侧的方框里设置了我的频道，你可以找到你最近加入的五个频道。
        同时，你可能会好奇加入频道的功能，我们再把视线拉回到搜索框右侧，第一个按钮里有你的待办事项，你可以点击并查看对你比较重要的频道内的通知。并且右上角你还能看到你的头像，点进去你会看到你所有加入的频道以及个人信息，你甚至可以在我的频道这个选项中创建一个属于你自己的频道，并成为频道管理者。如果你的事情都办理好了的话，你可以注销账号，来保证自己的安全性，当然，如果是你自己的电脑，你可以把账号信息保留，以便下次使用。
        最后，祝你使用愉快！
      </p>
    </div>
  </div>
</div>

<style>
  .genshin {
    background-image: url("/public/new.png"); /* 设置背景*/
    background-position: center; /* 水平和垂直居中背景图 */
    background-size: cover; /* 或者使用contain根据具体需求 */
  }
  .container {
    display: flex;
    height: 100vh; /* 让容器占据整个视口高度 */
  }

  .blockTitle {
    font-size: x-large;
    color: black;
    text-align: center;
  }

  .left {
    display: flex;
    flex-direction: column;
    width: 30%;
    height: 93%; /* 左侧部分占据全部高度 */
    margin-top: auto;
  }

  .right {
    width: 70%;
    height: 100%; /* 右侧部分占据剩余宽度和全部高度 */
    background-color: #f0f0f0; /* 为右侧部分添加背景色以区分 */
    background-image: url("/public/new.png"); /* 设置背景*/
    overflow-y: auto; /* 允许垂直方向上的滚动 */
    background-position: center; /* 水平和垂直居中背景图 */
    margin-left: 3%; /* 居中显示 */
    border: 1px solid #ccc; /* 为了清楚地看到容器的边界 */
    background-size: cover; /* 或者使用contain根据具体需求 */
    padding: 10px; /* 内边距 */
  }

  .channel {
    font-weight: bolder;
    color: black; /* 设置文本颜色 */
    margin-bottom: 10px; /* 设置记录之间的间隔 */
    font-size: xx-large;
    padding-left: 15px; /* 右侧外边距，根据需要调整 */
  }

  .top,
  .bottom {
    flex: 1; /* 使左侧上下两部分平分空间 */
    display: block;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    border: 1px solid #ddd; /* 添加边框以便视觉区分 */
    text-align: left; /* 使内容靠右对齐 */
  }

  .articleHead {
    color: #000000;
    font-size: 40px;
    margin-top: 35px;
    font-weight: bolder;
  }

  .articleBody {
    color: #000000;
  }
  p {
    white-space: pre-wrap; /* 允许文本换行并保留空白处，包括空格和换行符 */
    font-family: "heiti";
    font-weight: bolder;
    font-weight: 900;
    font-size: 30px;
    text-align: justify;
    margin-top: 50px;
    line-height: 200%;
  }
</style>
