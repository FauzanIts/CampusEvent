// app/Models/Mongo/Event.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IEvent extends Document {
  title: string
  description: string
  date: Date
  time?: string
  location: string
  latitude?: number
  longitude?: number
  weatherInfo?: any
  createdBy: mongoose.Types.ObjectId
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String },
  location: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  weatherInfo: { type: Schema.Types.Mixed },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

export const EventModel = mongoose.model<IEvent>('Event', EventSchema)
