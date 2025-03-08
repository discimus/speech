const appConfig = {
    data() {
        return {
            selectedVoiceTags: [],
            voiceTags: [],
            voices: [],
            voice: null,
            speed: 1,
            speechContent: "",
            buttonSpeechTextContent: "Paste and speech",
            statusMessage: ""
        }
    },
    async mounted() {
        services.useApp(this)
        await services.configVoicesAsync()
    },
    methods: {
        async speech() {
            await services.speechAsync()
        },
        stop() {
            services.abort()
        },
        async handleTagVoiceClick(tag) {
            await services.updateLanguageListBySelectedTag(tag)
        }
    }
}