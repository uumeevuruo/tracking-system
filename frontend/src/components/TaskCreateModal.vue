<template>
  <!-- Bootstrap Modal -->
  <div class="modal fade" :class="{ show: show }" tabindex="-1" :style="{ display: show ? 'block' : 'none' }">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Create New Task</h5>
          <button type="button" class="btn-close" @click="$emit('close')" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="taskTitle" class="form-label">Title</label>
              <input 
                type="text" 
                class="form-control" 
                id="taskTitle" 
                v-model="form.title" 
                required
              >
              <span v-if="errors.title" class="text-danger">{{ errors.title }}</span>
            </div>
            
            <div class="mb-3">
              <label for="taskDescription" class="form-label">Description</label>
              <textarea 
                class="form-control" 
                id="taskDescription" 
                rows="3" 
                v-model="form.description"
              ></textarea>
              <span v-if="errors.description" class="text-danger">{{ errors.description }}</span>
            </div>
            
            <div class="mb-3">
              <label for="taskStatus" class="form-label">Status</label>
              <select 
                class="form-select" 
                id="taskStatus" 
                v-model="form.status" 
                required
              >
                <option v-for="status in taskStore.statusList" :key="status" :value="status">
                    {{ formatStatus(status) }}
                </option>
              </select>
            </div>
            
            <div class="mb-3">
              <label for="taskdue" class="form-label">Due Date</label>
              <input 
                type="datetime-local" 
                class="form-control" 
                id="taskdue" 
                v-model="form.due" 
                required
              >
              <span v-if="errors.due" class="text-danger">{{ errors.due }}</span>
            </div>
            
            <div v-if="taskStore.error" class="alert alert-danger mt-3">
              {{ taskStore.error }}
            </div>
            
            <div class="modal-footer">
              <button 
                type="button" 
                class="btn btn-secondary" 
                @click="$emit('close')"
                :disabled="taskStore.isLoading"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="taskStore.isLoading"
              >
                <span v-if="taskStore.isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {{ taskStore.isLoading ? 'Creating...' : 'Create Task' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Backdrop -->
  <div class="modal-backdrop fade" :class="{ show: show }" :style="{ display: show ? 'block' : 'none' }"></div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useTaskStore } from '@/server/taskStore'
import { formatStatus } from '@/util/formatter'

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'created'])

const taskStore = useTaskStore()
const errorMessage = ref('')
const errors = ref({})

const form = ref({
  title: '',
  description: '',
  status: 'NOT_STARTED',
  due: ''
})

const handleSubmit = async () => {
  errorMessage.value = ''
  try {
    const task = await taskStore.createTask({
      ...form.value,
      dueDate: new Date(form.value.due).toISOString()
    })
    emit('created', task)
    emit('close')
    form.value = { title: '', description: '', status: 'NOT_STARTED', due: '' } // Reset form
  } catch (error) {
    
    console.log(error.response.data.data)
    errors.value = error.response?.data?.data.errors || {};
    errorMessage.value = error.response?.data?.message || error.message
  }
}

// Reset form when modal closes
watch(() => props.show, (newVal) => {
  if (!newVal) {
    form.value = { title: '', description: '', status: 'NOT_STARTED', due: '' }
    errorMessage.value = ''
  }
})
</script>


<style scoped>
/* Custom modal animation */
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-backdrop {
  opacity: 0.5;
}
</style>