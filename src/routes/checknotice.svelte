<!-- 显示通知具体内容 -->

<script>
  import { currentUserEmail, currentnoticeid } from "../store.js";
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import { onMount } from "svelte";

  const pb = new PocketBase(PocketBase_URL);
  let records = [];
  async function noticedisplay() {
    try {
      const createid = $currentnoticeid;
      const response = await pb.collection("notices").getFullList({
        sort: "-created",
        filter: `id="${createid}"`,
      });
      records = response;
    } catch (error) {
      alert("fail to find");
    }
  }
  async function copy(check) {
    try {
      const userEmail = $currentUserEmail;
      const newRecord = {
        tittle: check.tittle,
        body: check.body,
        tag: check.tag,
        year: check.year,
        month: check.month,
        day: check.day,
        useremail: userEmail,
        noticeid: check.id,
        username: check.username,
      };
      await pb.collection("todolist").create(newRecord);
      alert("添加成功！");
    } catch (error) {
      alert("添加失败。");
    }
  }
  onMount(() => {
    noticedisplay();
  });
</script>


{#each records as record}
  <div class="record">
    <div class="tittle">{record.tittle}</div>
    <div class="meta">
      {record.year}.{record.month}.{record.day}/#{record.tag}/from:{record.username}
    </div>
    <div>{record.body}</div>
    <button class="but" on:click={() => copy(record)}>+ todolist</button>

  </div>
</body>

<style>
  .bodydiv {
    height: 100vh; /* 设置高度为视口的100% */
    width: 100vw; /* 设置宽度为视口的100% */
    margin: 0; /* 移除默认的外边距 */
    padding: 0; /* 移除默认的内边距 */
  }
  .meta .date,
  .meta .tag {
    display: inline; /* 保持日期和标签在同一行 */
  }

  .meta .from {
    display: block; /* 新的一行显示from信息 */
  }

  /* .noticeBody{
    color: black;
    font-size: 200px;
  } */

  .noticeSize {
    width: 80%; /* 宽度占屏幕宽度的80% */
    margin: 0 auto; /* 水平居中显示 */
    padding: 20px; /* 增加内边距，让边界和文本之间有足够的空间 */
    font-family: Arial, sans-serif; /* 使用易读的字体 */
    background-color: #f9f9f9; /* 轻微的背景色，减轻眼睛疲劳 */
    border-radius: 10px; /* 圆角边框，视觉上更柔和 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 轻微的阴影效果，增加立体感 */
    margin-top: 20px; /* 距离页面顶部的距离 */
  }

  .record {
    width: auto;
    border: 1px solid #ccc;
    padding: 15px;
    margin: 10px 0;
    background-color: #f9f9f9;

  }

  .tittle {
    font-size: 40px; /* 标题字体大小 */
    font-weight: bold; /* 加粗显示 */
    margin-bottom: 10px; /* 标题与其他内容之间增加空间 */
    color: #333; /* 深色字体，增加对比，易于阅读 */
  }

  .meta {
    font-size: 14px; /* 元数据使用更小的字体 */
    color: #666; /* 浅色字体，区分正文 */
    margin-bottom: 10px; /* 与正文内容分隔 */
  }

  .noticeBody {
    font-size: 20px; /* 正文适中的字体大小 */
    line-height: 1.6; /* 增加行高，提高阅读舒适度 */
    color: #444; /* 正文颜色，深于元数据，浅于标题 */
  }

  .but {
    color: black; /* 设置字体颜色为黑色 */
  }
</style>
