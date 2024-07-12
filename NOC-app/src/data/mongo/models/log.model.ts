import mongoose from 'mongoose'

const logSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: [ 'low', 'medium', 'high' ],
    default: 'low',
  },
  message: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
})

export const LogModel = mongoose.model( 'Log', logSchema )