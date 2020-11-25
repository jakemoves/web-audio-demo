/*
CohortWebAudioSession
X takes a list of assets (sound files)
X loads them
X prepares for playback

- take cuelist with cueContent field, loop field
*/

var WebAudioSession = {
  players: {},
  fader: null,

  enable: async function(audioAssets){
    try {
      await Tone.start()
    } catch (error){
      return error
    }

    audioAssets.forEach( (audioAsset, index) => {
      this.players[index] = new Tone.Player(audioAsset);
    })

    console.log('audio session started')

    Tone.loaded().then(() => {
      console.log('loading complete')
      // setting up crossfade
      if(Object.keys(this.players).length == 2){ // make sure there's only two samples / tracks
        this.fader = new Tone.CrossFade().toDestination()
        // connect the two inputs
        const ambient = this.players["0"].connect(this.fader.a).start()
        const cue = this.players["1"].connect(this.fader.b).start()
        this.fader.fade.value = 0.5
      } else {
        console.log("Error -- this patch setup needs exactly two files passed in")
      }
    })
  },

  updateFaderValue: function(value /* between 0 and 1*/){
    this.fader.fade.value = value
  }
}

export { WebAudioSession }