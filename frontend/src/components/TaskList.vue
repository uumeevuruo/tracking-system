
<template>
  <div class="container my-5">
    <!-- Header with Search and Create Button -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h2 class="mb-0">Task List</h2>

        <div class="d-flex flex-grow-1 gap-3 align-items-center">
            <div class="input-group">
            <input
            type="text"
            v-model="taskStore.searchByTitle"
            @input="handleSearch"
            class="form-control"
            placeholder="Search task..."
            />

            <!-- Filter Icon Button -->
            <button
            class="btn btn-sm btn-outline-secondary toggle-filter"
            @click="toggleFilterDropdown"
            >
            <i class="fas fa-filter"></i>
            </button>
            </div>
            
            <!-- Filter Dropdown with Transition -->
            <transition name="fade">
            <div
                v-if="showFilters"
                class="hide-filter position-absolute bg-white border rounded shadow p-3"
                style="top: 25%; right: 0; z-index: 10; min-width: 250px;"
            >
                <h6 class="mb-2">Filters</h6>

                <div class="row g-3 mb-3">
                    <!-- Left Column: Filters -->
                    <div class="col-md-6">
                        <div class="d-flex flex-column gap-2">
                            <!-- Status Filter -->
                            <div>
                                <label class="form-label">Status</label>
                                <select v-model="taskStore.searchByStatus" class="form-select form-select-sm">
                                  <option value="">All</option>
                                  <option v-for="status in taskStore.statusList" :key="status" :value="status">
                                      {{ formatStatus(status) }}
                                  </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Sorting -->
                    <div class="col-md-6">
                        <h6 class="mb-2">Sort</h6>
                        <div class="d-flex flex-column gap-2">
                        <!-- Sort By -->
                        <div>
                            <label class="form-label">Sort By</label>
                            <select v-model="taskStore.sortBy" class="form-select form-select-sm">
                            <option value="">Default</option>
                            <option value="title">Title</option>
                            <option value="status">Status</option>
                            <option value="due">Due Date</option>
                            </select>
                        </div>

                        <!-- Sort Direction -->
                        <div>
                            <label class="form-label">Direction</label>
                            <select v-model="taskStore.sortOrder" class="form-select form-select-sm">
                            <option value="ASC">Ascending</option>
                            <option value="DESC">Descending</option>
                            </select>
                        </div>

                        <!-- Find task Button -->
                        <div>
                            <button @click="handleSearch" class="btn btn-primary btn-sm w-100">
                            Find Task
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>

            </div>
            </transition>

             <!-- Create Task Button - Now triggers the component's modal -->
            <button 
                class="btn btn-outline-secondary d-flex align-items-center gap-2" 
                @click="handleTaskCreated"
            >
                <i class="fas fa-plus"></i>
                <span class="vr"></span>
                <span>Create</span>
            </button>
            

            <!-- modal component -->
            <TaskCreateModal 
            v-if="showModal"
            @close="showModal = false"
            @created="handleTaskCreated"
            />
        </div>
    </div>


    <div v-if="taskStore.isLoading" class="text-muted">Loading tasks...</div>
    <!-- <div v-else-if="taskStore.error" class="alert alert-danger">{{ taskStore.error }}</div> -->
    <div v-else>
      <div class="table-responsive">
        <table class="table product-table">
          <thead class="table-light">
            <tr>
                <!-- <th scope="col">
                <input
                    type="checkbox"
                    @change="toggleSelectAll($event)"
                    :checked="areAllSelected"
                />
                </th> -->
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Status</th>
                <th scope="col">Due Date</th>
                <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="task in taskStore.tasks"
              :key="task.id"
              class="table-row"
            >
              <!-- <td>
                <input
                    type="checkbox"
                    :value="product.id"
                    v-model="selectedProducts"
                />
              </td> -->
              <td>
                <a :href="`/task/${task.id}`" class="fw-semibold text-decoration-none text-dark">
                  {{ task.title }}
                </a>
              </td>
              <td class="text-muted">{{ task.description }}</td>
              <td>
                <span>
                  {{ formatStatus(task.status) }}
                </span>
              </td>
              <td><span>{{ formatDate(task.due) }}</span></td>
              <td>
                <div class="d-flex gap-2">
                    <!-- <router-link :to="`/product/${product.id}`" class="btn btn-sm btn-outline-secondary">
                    <i class="fas fa-eye me-1"></i>
                    </router-link> -->
                    <button class="btn btn-sm btn-outline-secondary">
                    <i class="fas fa-pencil me-1"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" @click="deleteTask(task.id)">
                    <i class="fas fa-trash-alt me-1"></i>
                    </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination Controls -->
      <div class="d-flex justify-content-between align-items-center mt-4">
        <button
          class="btn btn-outline-secondary"
          :disabled="taskStore.currentPage === 0"
          @click="taskStore.currentPage--; taskStore.fetchTasks(searchQuery)"
        >
          ← Previous
        </button>
        <span class="text-muted">Page {{ taskStore.currentPage }} of {{ taskStore.totalPages }}</span>
        <button
          class="btn btn-outline-secondary"
          :disabled="taskStore.currentPage === taskStore.totalPages"
          @click="taskStore.currentPage++; taskStore.fetchTasks(searchQuery)"
        >
          Next →
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted  } from 'vue'
import { useTaskStore } from '@/server/taskStore'
import TaskCreateModal from '@/components/TaskCreateModal.vue'
import { formatDate, formatStatus } from '@/util/formatter'

const taskStore = useTaskStore()
const searchTimeout = ref(null);
const showFilters = ref(false);
const showModal = ref(false);

const deleteTask = async (id) => {
  if (confirm('Are you sure you want to delete this task?')) {
    await taskStore.deleteTask(id)
  }
}

const handleTaskCreated = (task) => {
  console.log("Created:"+task)
  showModal.value = true
  taskStore.fetchTasks() // Refresh the list
}

const handleSearch = () => {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    taskStore.currentPage = 0;
    taskStore.fetchTasks();
  }, 300); // debounce for smoother UX
};

const toggleFilterDropdown = () => {
  showFilters.value = true;
};

// Optional: close dropdown when clicking outside
const handleClickOutside = (event) => {
  const toggle = document.querySelector('.toggle-filter');
  const hide = document.querySelector('.hide-filter')
  if (toggle && !toggle.contains(event.target)) {
    if(hide && !hide.contains(event.target)){
        showFilters.value = false;
    }
  }
};

const handleKeyDown = (event) => {
  if (event.key === 'Escape') {
    showFilters.value = false;
  }
};

onMounted(() => {
  taskStore.fetchTasks();
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeyDown);
});

</script>

<style scoped>
.product-table {
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  overflow: hidden;
}

.product-table th,
.product-table td {
  vertical-align: middle;
  border-color: #dee2e6;
}

.table-row {
  transition: box-shadow 0.2s ease, background-color 0.2s ease;
}

.table-row:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background-color: #f9f9f9;
}
.table-row {
  position: relative;
  transition: box-shadow 0.2s ease, background-color 0.2s ease;
  z-index: 1;
}

.table-row:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.128);
  background-color: #f9f9f9;
  z-index: 2;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
