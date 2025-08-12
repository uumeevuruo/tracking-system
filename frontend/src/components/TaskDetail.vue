<template>
  <div class="container py-4">
    <!-- Breadcrumb Navigation -->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/">Task List</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page" v-if="taskStore.currentTask">
          {{ taskStore.currentTask.title || 'Task Details' }}
        </li>
      </ol>
    </nav>

    <!-- Action Buttons -->
    <div class="d-flex justify-content-between mb-4">
      <div>
        <router-link to="/" class="btn btn-outline-secondary me-2">
          <i class="bi bi-arrow-left me-1"></i> Update Task
        </router-link>
      </div>
      <div v-if="taskStore.currentTask">
        <button @click="deleteTask" class="btn btn-danger">
          <i class="bi bi-trash me-1"></i> Delete Task
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="taskStore.isLoading && !taskStore.currentTask" class="d-flex justify-content-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="taskStore.error" class="alert alert-danger" role="alert">
      {{ taskStore.error }}
    </div>
    
    <!-- Task Details -->
    <div v-else-if="taskStore.currentTask" class="card">
      <div class="card-header bg-primary text-white">
        <h1 class="h4 mb-0">{{ taskStore.currentTask.title }}</h1>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label fw-bold">Description:</label>
          <p class="form-control-plaintext">{{ taskStore.currentTask.description || 'None' }}</p>
        </div>
        
        <div class="mb-3">
          <label class="form-label fw-bold">Status:</label>
          <p class="form-control-plaintext">{{ formatStatus(taskStore.currentTask.status) }}</p>
        </div>
        
        <div class="mb-3">
          <label class="form-label fw-bold">Due Date:</label>
          <p class="form-control-plaintext">{{ formatDate(taskStore.currentTask.due) }}</p>
        </div>
      </div>
    </div>
    
    <!-- Not Found State -->
    <div v-else class="alert alert-warning" role="alert">
      Task not found
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/server/taskStore'
import { formatDate, formatStatus } from '@/util/formatter'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

taskStore.fetchTask(route.params.id)

watch(() => route.params.id, (newId) => {
  taskStore.fetchTask(newId)
})

const updateStatus = async () => {
  await taskStore.updateTaskStatus({
    id: route.params.id,
    status: taskStore.currentTask.status
  })
}

const deleteTask = async () => {
  if (confirm('Are you sure you want to delete this task?')) {
    await taskStore.deleteTask(route.params.id)
    router.push('/')
  }
}
</script>