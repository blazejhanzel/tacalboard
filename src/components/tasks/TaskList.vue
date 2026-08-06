<template>
  <div class="space-y-3">
    <TaskItem
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @remove="remove(task.id)"
    />
  </div>
</template>


<script setup lang="ts">

import TaskItem from "./TaskItem.vue"


defineProps<{
  tasks: any[]
}>()


const emit = defineEmits<{
  remove: [id:number]
}>()


function remove(id:number){
  emit("remove", id)
}

</script>