import Fullscreen from './fullscreen'
import PIP from './pip'

import emitter from './emmiter'

export default class Video {
    constructor() {
        this.mediaSource = new MediaSource()

        this.ready = new Promise((resolve) => {
            this.mediaSource.addEventListener('sourceopen', () => {
                this.sourceBuffer = this.mediaSource.addSourceBuffer('video/mp4; codecs="avc1.4d401f, mp4a.40.2"');
                resolve()
            }, { once: true })
        })

        this.currentChunk = 0

        this.video = document.querySelector('#video')

        this.wrapper = document.querySelector('.wrapper')

        this.progress = this.wrapper.querySelector('.progress-value')
        this.totalProgress = this.wrapper.querySelector('.progress')
        this.action = this.wrapper.querySelector('.action')

        this.pip = new PIP(this.wrapper)
        this.fullscreen = new Fullscreen(this.wrapper)

        const url = URL.createObjectURL(this.mediaSource)
        this.video.src = url;

        this.video.addEventListener("timeupdate", this.timeUpdate)
        this.action.addEventListener("click", this.onClickAction)
        this.totalProgress.addEventListener("click", this.onClickProgress)

        emitter.addListener('add_buffer', this.appendBuffer)
    }

    appendBuffer = (chunk) => {
        if (chunk instanceof Error) {
            return
        }

        this.sourceBuffer.appendBuffer(new Uint8Array(chunk))
    }

    play() {
        this.video.play()
        this._playing = true
        this.action.classList.add("in_progress")
        emitter.emit('play')
    }

    pause() {
        this.video.pause()
        this._playing = false
        this.action.classList.remove("in_progress")
        emitter.emit('pause')
    }

    timeUpdate = () => {
        this.progress.style.width = `${(this.currentTime * 100) / this.duration}%`
    }

    onClickProgress = (e) => {
        e.stopImmediatePropagation()
        this.currentTime = (this.duration * e.offsetX) / this.totalProgress.offsetWidth
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

    set duration(duration) {
        this._duration = duration
    }

    get duration() {
        return this._duration
    }
}