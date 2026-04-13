/*  TimeContest  */

enum GameState {
    Passive,   // čekání – hráč může zobrazit skóre nebo spustit hru
    Started,   // přehrávání intervalu – zobrazeny přesýpací hodiny
    Running    // hráč odhaduje – zobrazuje se otazník, měří se čas
}

let state: GameState = GameState.Passive
let targetInterval: number = 0   // sekundy (5–15)
let startTime: number = 0        // ms – základ pro měření
let score: number = 0

input.onButtonPressed(Button.AB, function () {
    if (state === GameState.Passive) {
        state = GameState.Started
        targetInterval = randint(5, 15)
        score = 0
        basic.showIcon(IconNames.Pitchfork)
        control.runInBackground(() => music.playTone(440, 200))
        basic.pause(targetInterval * 1000)
        control.runInBackground(() => music.playTone(880, 200))
        state = GameState.Running
        basic.showString("?")
        startTime = control.millis()
    }
})

input.onLogoEvent(TouchButtonEvent.Touched, function () { 
    if (state === GameState.Running){
        let elapsed = control.millis() - startTime //čas, který uběhl od konce přehrávání do stisku hráče
        let targetMs = targetInterval * 1000 //převod cílového intervalu na milisekundy
        let tolerance = 250 + (0.1 * targetMs) //odchylka: 250 ms + 10% z celkového času
        
        if (elapsed >= (targetMs - tolerance) && elapsed <= targetMs) {
            basic.showIcon(IconNames.Happy)
            music._playDefaultBackground(music.builtInPlayableMelody(Melodies.PowerUp), music.PlaybackMode.InBackground);
        } else {
            basic.showIcon(IconNames.Sad)
            music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Wawawawaa), music.PlaybackMode.InBackground);
        }
    }
})

state = GameState.Passive