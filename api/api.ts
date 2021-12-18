export class Api {
  baseUri: string;

  constructor(baseUri: string) {
    this.baseUri = baseUri;
  }


  public async getTest() {
    try {
      const response = await fetch(this.baseUri + '/test');
      const json =  await response.json();
      json.items.forEach((item) => {
        item.original_audio_url = item.original_audio_url.replace('localhost', '10.21.21.8') + '/download.mp3';
        item.processed_audio_url = item.processed_audio_url.replace('localhost', '10.21.21.8') + '/download.mp3';
      })
      return json;
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

