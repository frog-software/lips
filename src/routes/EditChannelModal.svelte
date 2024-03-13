<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "./Modal.svelte";
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";

  const dispatch = createEventDispatcher();
  const pb = new PocketBase(PocketBase_URL);

  // 假设这个是通过某种方式从上层组件或者页面加载逻辑获取的频道对象
  export let channel = { id: "", channelName: "", channelDescription: "" };
  let originalChannelName = channel.channelName;
  // 更新users_channels集合中所有记录的channelName字段
  async function updateUsersChannels(originalChannelName, updatedChannelName) {
    try {
      // 查询所有与该原始频道名称相关的users_channels记录
      const response = await pb.collection("users_channels").getFullList({
        filter: `channelname='${originalChannelName}'`,
      });

      // 遍历这些记录并逐一更新它们
      for (const userChannel of response) {
        await pb.collection("users_channels").update(userChannel.id, {
          channelname: updatedChannelName, // 更新为新的频道名称
        });
      }
    } catch (error) {
      console.error("Failed to update users_channels records:", error);
    }
  }

  // 保存频道更改
  async function saveChanges() {
    try {
      await pb.collection("channels").update(channel.id, {
        channelName: channel.channelName,
        channelDescription: channel.channelDescription,
      });

      // 如果频道名称有变更，调用更新users_channels集合的函数
      if (originalChannelName !== channel.channelName) {
        await updateUsersChannels(originalChannelName, channel.channelName);
      }

      dispatch("update");
      alert("Channel updated successfully");
    } catch (error) {
      console.error("Failed to update channel", error);
      alert("Failed to update channel");
    }
  }
</script>

<Modal isOpen={true} close={() => dispatch("close")}>
  <form on:submit|preventDefault={saveChanges}>
    <input bind:value={channel.channelName} placeholder="Channel Name" />
    <textarea
      bind:value={channel.channelDescription}
      placeholder="Channel Description"
    ></textarea>
    <button type="submit">Save Changes</button>
  </form>
</Modal>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 20px; /* 输入框和按钮之间的间隔 */
    width: 80%; /* 或者指定一个宽度，如300px */
    height: 80%;
    max-width: 600px; /* 最大宽度，确保在大屏幕上也不会太宽 */
    padding: 5px; /* 表单内边距 */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 轻微的阴影效果 */
    border-radius: 8px; /* 轻微的圆角效果 */
  }

  input,
  textarea {
    padding: 10px; /* 输入区域的内边距 */
    border: 1px solid #ccc; /* 边框颜色 */
    border-radius: 4px; /* 输入区域的圆角 */
    font-size: 16px; /* 文本大小 */
  }

  button[type="submit"] {
    padding: 10px 20px;
    background-color: #007bff; /* 按钮背景颜色 */
    color: white; /* 按钮文字颜色 */
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }

  button[type="submit"]:hover {
    background-color: #0056b3; /* 鼠标悬停时的按钮背景颜色 */
  }
</style>
