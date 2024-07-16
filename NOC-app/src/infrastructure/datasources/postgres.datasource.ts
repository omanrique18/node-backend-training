import { PrismaClient, SeverityLevel } from "@prisma/client";
import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

const prismaClient = new PrismaClient() 

const severityConverter = {
  low: SeverityLevel.LOW,
  medium: SeverityLevel.MEDIUM,
  high: SeverityLevel.HIGH,
}

export class PostgresLogDatasource implements LogDatasource {

  async saveLog( log: LogEntity ): Promise<void> {
    const level = severityConverter[log.level]

    const newLog = await prismaClient.logModel.create({
      data: {
        ...log,
        level,
      } })

    console.log( 'Postgres log created with id: ', newLog.id )
  }

  async getLogs( severityLevel: LogSeverityLevel ): Promise<LogEntity[]> {
    const level = severityConverter[severityLevel]

    const dbLogs = await prismaClient.logModel.findMany({
      where: { level }
    })

    return dbLogs.map( LogEntity.fromObject )
  }

}