<template>
  <div class="panel empty-state">
    <slot>暂无数据</slot>
  </div>
</template>

<style scoped>
.empty-state {
  min-height: 140px;
  display: grid;
  place-items: center;
  color: #6b7280;
}
</style>
