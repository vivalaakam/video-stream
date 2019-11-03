
function createElement(tag, className) {
    const element = document.createElement(tag)
    element.classList.add(className)

    return element
}

class Video {
    constructor() {
        this.mediaSource = new MediaSource();

        this.run = this.run.bind(this)
        this.currentChunk = 0
        this.init()
    }

    init() {
        this.video = document.querySelector('#video')

        this.wrapper = document.querySelector('.wrapper')

        this.progress = this.wrapper.querySelector('.progress-value')
        this.totalProgress = this.wrapper.querySelector('.progress')
        this.action = this.wrapper.querySelector('.action')

        this.pip = this.wrapper.querySelector('.pip')

        this.fullscreen = this.wrapper.querySelector('.fullscreen')

        this.mediaSource.addEventListener('sourceopen', this.run, { once: true })

        const url = URL.createObjectURL(this.mediaSource)
        this.video.src = url;

        this.video.addEventListener("progress", (e) => {
            for (let i = 0; i < this.video.buffered.length; i += 1) {
                console.log("progress", this.currentChunk, this.video.buffered.start(i), this.video.buffered.end(i))
            }
        })

        this.video.addEventListener("timeupdate", (e) => {
            console.log("timeupdate", this.currentTime)

            this.progress.style.width = `${(this.currentTime * 100) / (this.currentChunk * 2)}%`
        })

        this.totalProgress.addEventListener("click", (e) => {
            console.log("click", e.offsetX, this.totalProgress.offsetWidth)
            this.currentTime = ((this.currentChunk * 2) * e.offsetX) / this.totalProgress.offsetWidth
        })

        this.action.addEventListener("click", () => {
            if (this._playing) {
                this.pause()
                this.action.innerText = 'Play'
            } else {
                this.play()
                this.action.innerText = 'Pause'
            }
        })

        if ('pictureInPictureEnabled' in document) {
            this.pip.hidden = false

            this.pip.addEventListener('click', (event) => {
                if (this.video !== document.pictureInPictureElement) {
                    this.video.requestPictureInPicture();
                } else {
                    document.exitPictureInPicture();
                }
            });
        } else {
            this.pip.hidden = true
        }

        if ('fullscreenEnabled' in document) {
            this.fullscreen.hidden = false

            this.fullscreen.addEventListener('click', (event) => {
                if (this.wrapper !== document.fullscreenElement) {
                    this.wrapper.requestFullscreen()
                } else {
                    document.cancelFullScreen()
                }
            });

        } else {
            this.fullscreen.hidden = true
        }
    }

    run() {
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
    }

    pause() {
        this.video.pause()
        this._playing = false
    }

    get currentTime() {
        return this.video.currentTime
    }

    set currentTime(currentTime) {
        this.video.currentTime = currentTime
    }
}

document.addEventListener("DOMContentLoaded", function (event) {
    window.video = new Video()
})