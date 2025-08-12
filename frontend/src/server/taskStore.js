import { defineStore } from 'pinia'
import api from './api'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    currentPage: 0,
    totalPages: 0,
    searchByTitle: '',
    searchByStatus: '',
    sortBy: '',
    sortOrder: '',
    statusList: ['OPEN', 'IN_PROGRESS', 'ON_HOLD', 'NOT_STARTED', 'CANCELLED', 'OVERDUE', 'COMPLETED'],
    currentTask: null,
    isLoading: false,
    error: null
  }),
  actions: {
    async fetchTasks() {
      this.isLoading = true
      try {
        const response = await api.getTasks({title: this.searchByTitle, status: this.searchByStatus, page: this.currentPage, sortBy: this.sortBy, sortOrder: this.sortOrder})
        this.tasks = response.data.data.tasks
        this.totalPages = response.data.data.totalPage -1
      } catch (error) {
        this.error = error.response?.data?.message || error.message
      } finally {
        this.isLoading = false
      }
    },
    async fetchTask(id) {
      this.isLoading = true
      try {
        const response = await api.getTask(id)
        this.currentTask = response.data.data.task
      } catch (error) {
        this.error = error.response?.data?.message || error.message
      } finally {
        this.isLoading = false
      }
    },
    async createTask(taskData) {
      this.isLoading = true
      try {
        const response = await api.createTask(taskData)
        this.tasks.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async updateTaskStatus({ id, taskData }) {
      this.isLoading = true
      try {
        await api.updateTask(id, taskData)
        const taskIndex = this.tasks.findIndex(t => t.id === id)
        // if (taskIndex !== -1) {
        //   this.tasks[taskIndex].status = status
        // }
        // if (this.currentTask?.id === id) {
        //   this.currentTask.status = status
        // }
      } catch (error) {
        this.error = error.response?.data?.message || error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async deleteTask(id) {
      this.isLoading = true
      try {
        await api.deleteTask(id)
        this.tasks = this.tasks.filter(t => t.id !== id)
        if (this.currentTask?.id === id) {
          this.currentTask = null
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})