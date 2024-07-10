import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import fs from 'fs'


export  class FileSystemDatasource implements LogDatasource {

  private readonly logPath = './logs/'
  private readonly logFilesPaths = {
    allLogsFile: './logs/logs-all.log',
    mediumLogsFile: './logs/logs-medium.log',
    highLogsFile: './logs/logs-high.log',
  }

  constructor() {
    this.createLogsFiles()
  }

  private createLogsFiles = () => {
    if ( !fs.existsSync(this.logPath) ) {
      fs.mkdirSync(this.logPath)
    }
    
    const files = Object.values(this.logFilesPaths)

    files.forEach( path => {
      if ( !fs.existsSync( path ) ) {
        fs.writeFileSync( path,'' )
      }
      return
    })
  }

  private getLogsFromFile = ( path: string ): LogEntity[] => {
    const fileContent = fs.readFileSync( path, 'utf-8' )
    const logs = fileContent.split( '\n' ).map( LogEntity.fromJson )
    return logs
  }

  async saveLog( log: LogEntity ): Promise<void> {
    const logAsJson = `${JSON.stringify( log )}\n`

    fs.appendFileSync( this.logFilesPaths.allLogsFile, logAsJson )

    if ( log.level === LogSeverityLevel.low ) {
      return
    }

    if ( log.level === LogSeverityLevel.medium ) {
      fs.appendFileSync( this.logFilesPaths.mediumLogsFile, logAsJson )
    } else {
      fs.appendFileSync( this.logFilesPaths.highLogsFile, logAsJson )
    }
  }

  async getLogs( severityLevel: LogSeverityLevel ): Promise<LogEntity[]> {
    switch ( severityLevel ) {
      case LogSeverityLevel.low:
        return this.getLogsFromFile( this.logFilesPaths.allLogsFile )
      case LogSeverityLevel.medium:
        return this.getLogsFromFile( this.logFilesPaths.mediumLogsFile )
      case LogSeverityLevel.high:
        return this.getLogsFromFile( this.logFilesPaths.highLogsFile )
      default:
        throw new Error( `invalid severity level: ${ severityLevel }` )
    }
  }

}