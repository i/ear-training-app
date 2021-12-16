export class Api {
  baseUri: string;

  constructor(baseUri: string) {
    this.baseUri = baseUri;
  }


  public async getTest() {
    try {
      const response = await fetch(this.baseUri + '/test');
      return await response.json();
    } catch (error) {
      // Handle the error.
      console.log(error);
    }
    return null;
  }

  public async getAudios() {
    try {
      const response = await fetch(this.baseUri + '/audio');
      return await response.json();
    } catch (error) {
      // Handle the error.
      console.log(error);
    }
    return null;
  }

}

