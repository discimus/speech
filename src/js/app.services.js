const services = {
    app: null,
    useApp(app) {
        this.app = app
        return this
    },
    async updateLanguageListBySelectedTag(tag) {
        const self = this.app

        if (self.selectedVoiceTags.includes(tag)) {
            self.selectedVoiceTags.splice(self.selectedVoiceTags.indexOf(tag), 1)
        } else {
            self.selectedVoiceTags.push(tag)
        }

        console.log(self.selectedVoiceTags)

        const values = await window.speechSynthesis.getVoices()
            .filter(t => self.selectedVoiceTags.includes(t.lang))
            .sort((a, b) => {
                if (a < b) {
                    return -1;
                }
                if (a > b) {
                    return 1;
                }
                return 0;
            })

        self.voices = [...values]
        self.voice = values[0]
    },
    async configVoicesAsync() {
        const self = this.app

        window.speechSynthesis.addEventListener("voiceschanged", async () => {
            self.voices = await window.speechSynthesis.getVoices()
            const langs = self.voices
                .map(t => t.lang)
                .filter((t, index, array) => array.indexOf(t) === index)
                .sort((a, b) => {
                    if (a < b) {
                        return -1;
                    }
                    if (a > b) {
                        return 1;
                    }
                    return 0;
                })

            self.voiceTags = langs
        }, { once: true })

        if (typeof (navigator.clipboard.readText) !== "function") {
            self.buttonSpeechTextContent = "Speech"
        }

        function isValidVoice(voice, targets) {
            return targets.some(t => String(voice.name).toUpperCase().split(" ").includes(t))
        }

        try {
            self.voices = window.speechSynthesis.getVoices().filter(t => isValidVoice(t, ["PORTUGUESE", "ENGLISH"]))
            self.voice = self.voices.filter(t => isValidVoice(t, ["PORTUGUESE", "ENGLISH"]))[0]

            if (self.voice == undefined) {
                throw "Fail"
            }
        } catch {
            window.speechSynthesis.addEventListener("voiceschanged", () => self.voices = window.speechSynthesis.getVoices().filter(t => isValidVoice(t, ["PORTUGUESE", "ENGLISH"])), { once: true })
            window.speechSynthesis.addEventListener("voiceschanged", () => self.voice = self.voices[0], { once: true })
        }
    },
    async speechAsync() {
        const self = this.app

        try {
            if (typeof (navigator.clipboard.readText) === "function") {
                const temp = await navigator.clipboard.readText()
                self.speechContent = temp
            }
        } catch (e) {
            console.log(e)
        }

        const content = self.speechContent
            .replaceAll("\-\n", "")
            .replaceAll(/\-\s+\n/g, "")
            .replaceAll("\-\t", "")
            .replaceAll("\r", " ")
            .replaceAll("\n", " ")

        const utterance = new SpeechSynthesisUtterance(content)

        utterance.voice = self.voice
        utterance.lang = self.voice.lang
        utterance.rate = self.speed

        self.statusMessage = "On"

        utterance.onend = () => self.statusMessage = ""

        window.speechSynthesis.speak(utterance)
        window.speechSynthesis.addEventListener("end", () => console.log(123))
    },
    abort() {
        window.speechSynthesis.cancel()
    }
}