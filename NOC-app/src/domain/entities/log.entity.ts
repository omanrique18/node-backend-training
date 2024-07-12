export enum LogSeverityLevel {
  low = 'low',
  medium = 'medium',
  high = 'high'
}

export interface LogEntityProperties {
  level: LogSeverityLevel
  message: string
  origin: string
  createdAt?: Date
} 

export class LogEntity {

  public level: LogSeverityLevel
  public message: string
  public origin: string
  public createdAt: Date

  constructor( properties: LogEntityProperties ) {
    const { level, message, origin, createdAt = new Date() } = properties
    this.level = level
    this.message = message
    this.origin = origin
    this.createdAt = createdAt
  }

  static fromJson = ( json: string ): LogEntity => {
    const { level, message, origin, createdAt } = JSON.parse( json )
    const log = new LogEntity({
      level,
      message,
      origin,
      createdAt
    })
    
    return log
  }

  static fromObject = ( object: { [key: string]: any } ): LogEntity => {
    const { level, message, origin, createdAt } = object
    const log = new LogEntity({
      level,
      message,
      origin,
      createdAt
    })
    
    return log
  }
}