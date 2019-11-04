import emitter from './emmiter'

function sleep(timeout) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout)
    })
}

export default class Stream {
    constructor(video) {
        this.video = video
        video.ready.then(() => {
            this.run()
        })

        this.currentChunk = 0
    }

    async run() {
        const res = await fetch('/init.mp4')
        const chunk = await res.arrayBuffer()
        emitter.emit('add_buffer', chunk)

        let cont = true
        try {
            while (cont) {
                const res = await fetch('/output' + String(this.currentChunk) + '.m4s')
                if (!res.ok) {
                    cont = false
                    continue
                }

                const chunk = await res.arrayBuffer()
                emitter.emit('add_buffer', chunk)
                this.video.duration = this.currentChunk * 2
                this.video.timeUpdate()
                this.currentChunk += 1
                await sleep(1700)
            }
        } catch (e) {
            console.log(e.message)
        }
    }
}