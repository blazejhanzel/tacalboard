<template>
  <Card>
    <CardContent class="flex items-center gap-4 p-4">

      <Checkbox
        :checked="task.done"
        @update:checked="toggle"
      />

      <div class="flex-1">
        <p
          :class="{
            'line-through text-muted-foreground': task.done
          }"
        >
          {{ task.title }}
        </p>
      </div>

      <Badge
        variant="secondary"
      >
        {{ task.priority }}
      </Badge>

      <Button
        variant="ghost"
        size="sm"
        @click="$emit('remove')"
      >
        Usuń
      </Button>

    </CardContent>
  </Card>
</template>


<script setup lang="ts">

import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"


interface Task {
  id: number
  title: string
  done: boolean
  priority: string
}


const props = defineProps<{
  task: Task
}>()


const emit = defineEmits<{
  remove: []
  toggle: []
}>()


function toggle() {
  emit("toggle")
}

</script>