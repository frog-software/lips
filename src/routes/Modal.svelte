<!-- Modal.svelte -->
<script>
  export let isOpen = false; // 控制模态对话框是否显示的变量
  export let close; // 关闭模态对话框的函数
</script>

{#if isOpen}
  <div
    class="modal-overlay"
    role="button"
    tabindex="0"
    on:click={close}
    on:keypress
  >
    <div
      class="modal-content"
      on:keypress
      on:click|stopPropagation
      role="button"
      tabindex="0"
    >
      <slot />
      <!-- 用于插入模态对话框的内容 -->
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: #333; /* 暗色主题背景 */
    color: #ccc; /* 浅色文字 */
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); /* 更为显著的阴影效果 */
    width: auto;
    max-width: 600px;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
</style>



