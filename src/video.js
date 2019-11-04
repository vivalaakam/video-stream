import Fullscreen from './fullscreen'
import PIP from './pip'

export default class Video {
    constructor() {
        this.mediaSource = new MediaSource();
        this.currentChunk = 0
        this.init()
    }

    init() {
        this.video = document.querySelector('#video')

        this.wrapper = document.querySelector('.wrapper')

        this.progress = this.wrapper.querySelector('.progress-value')
        this.totalProgress = this.wrapper.querySelector('.progress')
        this.action = this.wrapper.querySelector('.action')

        this.pip = new PIP(this.wrapper)
        this.fullscreen = new Fullscreen(this.wrapper)

        this.mediaSource.addEventListener('sourceopen', this.run, { once: true })

        const url = URL.createObjectURL(this.mediaSource)
        this.video.src = url;

        this.video.addEventListener("timeupdate", this.timeUpdate)
        this.action.addEventListener("click", this.onClickAction)
        this.totalProgress.addEventListener("click", this.onClickProgress)
    }

    run = () => {
        this.sourceBuffer = this.mediaSource
            .addSourceBuffer('video/mp4; codecs="avc1.4d401f, mp4a.40.2"');

        this.loadInit().then((resp) => {
            this.sourceBuffer.appendBuffer(new Uint8Array(resp));

            const interval = setInterval(() => {
                this.loadPart(this.currentChunk)
                    .then((chunk) => {
                        if (!chunk || chunk instanceof Error) {
                            clearInterval(interval)
                        }
                        this.sourceBuffer.appendBuffer(new Uint8Array(chunk));
                        this.currentChunk += 1
                    }).catch(() => {
                        clearInterval(interval)
                    })
            }, 1700)
        })
    }

    loadInit() {
        return fetch('/init.mp4')
            .then(res => res.arrayBuffer())
    }

    loadPart(chunk) {
        return fetch('/output' + String(chunk) + '.m4s')
            .then(res => {
                if (!res.ok) {
                    return new Error('end of video')
                }

                return res.arrayBuffer()
            })
    }

    play() {
        this.video.play()
        this._playing = true
        this.action.classList.add("in_progress")
    }

    pause() {
        this.video.pause()
        this._playing = false
        this.action.classList.remove("in_progress")
    }

    timeUpdate = () => {
        this.progress.style.width = `${(this.currentTime * 100) / (this.currentChunk * 2)}%`
    }

    onClickProgress = (e) => {
        e.stopImmediatePropagation()
        this.currentTime = ((this.currentChunk * 2) * e.offsetX) / this.totalProgress.offsetWidth
    }

    onClickAction = (e) => {
        e.stopImmediatePropagation()
        if (this._playing) {
            this.pause()
        } else {
            this.play()
        }
    }

    get currentTime() {
        return this.video.currentTime
    }

    set currentTime(currentTime) {
        this.video.currentTime = currentTime
    }
}