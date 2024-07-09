interface CheckServiceUseCase {
  execute( url: string ): Promise<boolean>
}

export class CheckService implements CheckServiceUseCase {

  async execute( url: string ): Promise<boolean> {
    try {
      const req = await fetch( url )
      if( !req.ok ) {
        throw new Error( `Request to ${ url } failed with status ${ req.status }` )
      }
      console.log( `Request to ${ url } succeeded with status ${ req.status }` )

      return true
      
    } catch (error) {
      console.log(error)

      return false
    }

  }

}