<script>
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import {
    currentUserEmail,
    originChannelID,
  } from "../store.js";
  import { push } from "svelte-spa-router";
  import { onMount } from "svelte";

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
  function jumpnew(origin) {
    //currentchannelid.set(id);
    originChannelID.set(origin);
    push("/chantemplate");
  }

  onMount(() => {
    checkIsJoined();
  });
</script>

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
    右边
    <article>
      <h1 class="articleBody">欢 迎 来 到 LIPS！</h1>
      <p class="articleBody">
        关于lips：
        我们是一个轻量型信息门户网站，在这里，你可以根据自己的需求选择你想要加入的频道，你可以寻找频道里志同道合的伙伴，你可以发布频道招兵买马亦或是寻求帮助，你也可以浏览不同的频道，得到一些对自己有用的信息，总而言之，你可以在lips开启你的探索之旅！
        查找（或者加入）频道：
        如果你是第一次来lips，不妨看看你有什么感兴趣的频道，输入一个你已经在大脑里涌现的频道名，看看能否找到你的心之所想，或者是有朋友叫上你一块搭建频道，输入好朋友给你的频道名，点击搜索，即可找到你的好朋友，也许他已经在那里等候多时，开始行动吧！
        （使用手册）
        普通用户填写用户名和所属团体注册账号后，可以通过如下方式查找并加入一个频道，在搜索模块根据频道的id，名字，关键词查找指定的频道，搜索模块会根据频道用户数量，和用户的所属团体等信息推荐相关频道，如果频道需要密码，在输入正确的密码后（管理者没设置则不需要）可加入频道，此时加入频道的用户名会根据加入时间在频道的管理者处生成list。则说明用户已经加入频道。
        当然，用户也可以自愿随时退出频道，毕竟人各有志。 创建频道：
        在这里，你可以根据自己的需求去创建一个频道，同时给你的频道命名，所谓频道就是你可以找到与你同频共振的用户，你可以给自己的频道贴上标签，这些标签或许不只是一个，其他用户可以根据你选择的标签找到你发布的频道，从而成为你频道内的伙伴。
        （使用手册）
        首先，我们进入创建频道页面，通过填写频道的名字，简介，密码（可选），所属团体等频道相关信息申请创建一个属于自己频道，设置密码是为了使得频道更具有针对性，以找到更合适的队友，频道的名字是独一无二的，当频道名字出现重复时，频道不能创建成功。此时创建者需改变名字。当频道创建成功后，所有频道内的用户就都可以在频道内发布通知了。
        请注意，频道一旦被建立，就无法被删除，请一定要慎重建立。每个频道都是独一无二的。
        另外，对于设置密码有特殊指向团体的频道，管理者可在list处查看加入频道的用户信息，如发现不相关人员并可以将其删除，以减少频道管理的麻烦。
        筛选标签：
        我们很好奇你会为自己贴上什么标签，或者说你会对哪些标签更感兴趣，在这里你可以根据那些频道创建者们对于自己频道的所贴上的标签来找到他们的频道，这些频道说不定会吸引你向他们靠近，你或许会看到很多打着相同标签的频道出现在这里，同样，你也可以选择多个看起来很像的频道，去发现他们的不同之处，也许也是一个不错的选择。
        （使用手册）
        我们可以根据标签看到我们加入的频道，或者是获取具有相关标签的通知。同时，用户在浏览通知过程中，可选择标记通知，被标记的通知，会在用户特别注意模块根据标记时间生成list，处于list中的通知，会在ddl结束前三天自动给用户发送提醒通知
        发送通知：
        如果你是一位频道管理者，你想要对你的频道进行维护，或者是做一些通知发布来得到频道加入者的注意，你可以在这里发布你的通知，也许是招兵买马，也或许是你只想给你的加入者们一些好的建议或者是希望大家能够一起维护这个频道，都是一项不错的选择，如果这是你的第一条通知，不妨大胆一点，让频道的加入者知道你的创建初心，开始吧！
        （使用手册）
        当频道创建成功后，系统会给频道自动分配一个ID，并根据标题生成搜索索引，此时所有用户可以搜索到频道并且可以选择加入频道。
        频道的创建者可在自己的频道内发布通知，通知需带有标题，tag，持续时间，地点，ddl，附件（可选），等元素，通知审核通过后会自动在频道内按发布时间在频道内生成list
        编辑者如发现发布通知有误，可随时删除发布的信息
        同时，如果你是频道成员，你也可以像频道创建者一样，在这个频道内发布通知，具体步骤和创建者发布通知是一样的。
        同时，因为通知具有时效性，在频道内登记的通知，如已不在有效时间内，会被打上特殊标记，并自动给管理者发送信息，管理者可选择性的将其删除，以减少当前频道的信息量，防止信息冲突。
        频道成员：
        如果你是频道的参与者或者是管理者，你可以在这里看到你的志同道合的伙伴们，他们身上或许有一些与你相似的气质，一起维护你们心爱的频道吧！
        Lips旨在建立一个高效，面向多类型用户的信息门户网站，主要负责输出一些重要通知（有明确的ddl）。网站提供给编辑创建频道的权限，并在创建频道后可以在频道内输入需要发布的通知。发布通知提交后由相关审核人员处理,普通用户则能通过该网站订阅不同频道，并在订阅的频道内浏览通过审核的通知，并进行个性化操作。因此我们的目标是容易上手并且足够简洁，使得信息更具有时效性，以减少不必要的信息的出现。同时我们也希望有更多具有相同兴趣爱好的人在这里找到共友，以更好地协作。
        总而言之，身处一个信息量爆炸的时代，我们希望这样一个信息门户网站能为用户提供便捷的访问和获取信息的渠道，促进信息的传递、共享和协作。与此同时它具有个性化、定制化、业务流程集成和数据分析等功能，为用户和组织提供了更高效、智能和有价值的信息服务。
      </p>
    </article>
  </div>
</div>

<style>
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
    height: 100%; /* 左侧部分占据全部高度 */
  }

  .right {
    width: 70%;
    height: 100%; /* 右侧部分占据剩余宽度和全部高度 */
    background-color: #f0f0f0; /* 为右侧部分添加背景色以区分 */
    overflow-y: auto; /* 允许垂直方向上的滚动 */
    margin: auto; /* 居中显示 *
  border: 1px solid #ccc; /* 为了清楚地看到容器的边界 */
    padding: 10px; /* 内边距 */
  }
  .channel {
    display: block;
    color: black; /* 设置文本颜色 */
    margin-bottom: 10px; /* 设置记录之间的间隔 */
    font-size: large;
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

  .articleBody {
    color: black;
  }
  p {
    white-space: pre-wrap; /* 允许文本换行并保留空白处，包括空格和换行符 */
  }
</style>
