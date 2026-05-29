<template>
  <div class="tabs-nav-container">
    <div
      v-for="tab in tabs"
      :key="tab.id"
      :class="['tab-item', { active: modelValue === tab.id }]"
      @click="handleTabClick(tab.id)"
    >
      {{ tab.name }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true,
    default: () => [],
  },
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const handleTabClick = (id) => {
  emit("update:modelValue", id);
  emit("change", id);
};
</script>

<style scoped>
.tabs-nav-container {
  display: flex;
  overflow-x: auto;
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
  scrollbar-width: none; /* Firefox */
}
.tabs-nav-container::-webkit-scrollbar {
  display: none; /* Safari/Chrome */
}
.tab-item {
  padding: 14px 20px;
  font-size: 15px;
  color: #4e5969;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}
.tab-item.active {
  color: #165dff;
  font-weight: 600;
}
.tab-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 20px;
  right: 20px;
  height: 3px;
  background-color: #165dff;
  border-radius: 2px;
}
</style>
