import mongoose, { Schema, model } from 'mongoose'
import { TASK_STATUS } from '../constant.ts'

const KanbanSchema = new Schema(
  {
    boardName: String,
    tasks: [
      {
        title: String,
        description: String,
        subtasks: [
          {
            name: String,
            status: {
              type: String,
              default: 'undone',
            },
          },
        ],
        status: {
          type: String,
          enum: Object.values(TASK_STATUS),
          default: TASK_STATUS.TASK,
        },
      },
    ],
    statusCount: {
      task: Number,
      progress: Number,
      completed: Number,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

export default model('Board', KanbanSchema)
