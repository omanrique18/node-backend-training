import mongoose from 'mongoose'


interface ConnectionProperties {
  mongoUrl: string
  dbName: string
}

export class MongoDataBase {

  static async connect( properties: ConnectionProperties ): Promise<void> {
    const { mongoUrl, dbName } = properties

    try {
      await mongoose.connect( mongoUrl, { 
        dbName
       } )
      console.log( 'MongoDB connected' )
      
    } catch (error) {
      console.log( `MongoDB connection error: ${ error }` )
      throw error
    }
  }

}