import axios from 'axios'

const customFetch = axios.create({
  baseURL: 'https://kanban-task-management-api-five.vercel.app/',
})

export default customFetch
