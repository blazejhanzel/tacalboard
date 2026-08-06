<template>
  <Menubar>
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          New Tab <MenubarShortcut>⌘T</MenubarShortcut>
        </MenubarItem>
        <MenubarItem>New Window</MenubarItem>
        <MenubarSeparator />
        <MenubarItem>Share</MenubarItem>
        <MenubarSeparator />
        <MenubarItem>Print</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
  <header>
    <div class="wrapper">
      <TaskList
        :tasks="tasks"
      />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />

</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from "vue"
import TaskList from "@/components/tasks/TaskList.vue"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar'

interface Task {
  id: number
  title: string
  done: boolean
}

const newTask = ref("")

const tasks = ref<Task[]>([
  {
    id: 1,
    title: "Poznać Vue",
    done: false,
  },
  {
    id: 2,
    title: "Zrobić aplikację zadań",
    done: false,
  },
])


function addTask() {
  if (!newTask.value.trim()) return

  tasks.value.push({
    id: Date.now(),
    title: newTask.value,
    done: false,
  })

  newTask.value = ""
}


function removeTask(id: number) {
  tasks.value = tasks.value.filter(
    task => task.id !== id
  )
}
</script>