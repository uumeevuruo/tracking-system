import axiosInstance from "./axios";

class TaskService{
    getTask(id){
        return axiosInstance.get(`/case/${id}`);
    }

    getTasks(form){
        return axiosInstance.get('/case/', {params: form});
    }

    createTask(form){
        return axiosInstance.post('/case/', form);
    }

    updateTask(form){
        return axiosInstance.put('/case/', form);
    }

    deleteTask(id){
        return axiosInstance.delete(`/case/${id}`);
    }
}

export default new TaskService();