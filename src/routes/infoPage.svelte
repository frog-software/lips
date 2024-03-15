<script>
</script>

<div class="container">
  <div class="left">
    <div class="top">左上</div>
    <div class="bottom">左下</div>
  </div>
  <div class="right">右边</div>
</div>

<style>
  .container {
    display: flex;
    height: 100vh; /* 让容器占据整个视口高度 */
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
  }

  .top,
  .bottom {
    flex: 1; /* 使左侧上下两部分平分空间 */
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    border: 1px solid #ddd; /* 添加边框以便视觉区分 */
  }
</style>
