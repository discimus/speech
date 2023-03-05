const appConfig = {
    data() {
        return {
            voices: [],
            voice: null,
            speechContent: "",
            buttonSpeechTextContent: "Paste and speech"
        }
    },
    mounted() {
        if (typeof(navigator.clipboard.readText) !== "function") {
            this.buttonSpeechTextContent = "Speech"
        }

        try {
            this.voices = window.speechSynthesis.getVoices()
            this.voice = this.voices[0]

            if (this.voice == undefined) {
                throw "Fail"
            }
        } catch {
            window.speechSynthesis.addEventListener("voiceschanged", () => this.voices = window.speechSynthesis.getVoices())
            window.speechSynthesis.addEventListener("voiceschanged", () => this.voice = this.voices[0])
        }
    },
    methods: {
        async speech() {

            try {
                if (typeof(navigator.clipboard.readText) === "function") {
                    const temp = await navigator.clipboard.readText()
                    this.speechContent = temp                
                }
            } catch (e) {
                console.log(e)
            }
            
            const content = this.speechContent
                .replaceAll("\r", " ")
                .replaceAll("\n", " ")
                
            const utterance = new SpeechSynthesisUtterance(content)

            utterance.voice = this.voice
            utterance.lang = this.voice.lang

            window.speechSynthesis.voice = this.voice
            window.speechSynthesis.lang = this.voice.lang
            window.speechSynthesis.speak(utterance)
        },
        stop() {
            window.speechSynthesis.cancel()
        }
    }
}