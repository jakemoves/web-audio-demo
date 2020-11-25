/*
CohortWebAudioSession
X takes a list of assets (sound files)
X loads them
X prepares for playback

- take cuelist with cueContent field, loop field
*/

var WebAudioSession = {
  players: {}, // sample buffers to hold each track
  fader: null, // crossfader

  enable: async function(audioAssets){
    try {
      await Tone.start()
    } catch (error){
      return error
    } // most errors here are the result of mobile browsers trying to prevent 'autoplaying' audio which is usually annoying to users

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
    this.fader.fade.value = value // set the value of the crossfader to the user-set value of the slider
  }
}

export { WebAudioSession }