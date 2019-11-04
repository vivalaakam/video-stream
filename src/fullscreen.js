export default class Fullscreen {
    constructor(wrapper) {
        this.wrapper = wrapper

        this.fullscreen = this.wrapper.querySelector('.fullscreen')

        if (!this.isSupported) {
            this.fullscreen.style.display = 'none'
        } else {
            this.fullscreen.addEventListener('click', this.onClick)
            this.wrapper.addEventListener('fullscreenchange', this.onFullscreenChange);
            this.wrapper.addEventListener('mozfullscreenchange', this.onFullscreenChange);
            this.wrapper.addEventListener('webkitfullscreenchange', this.onFullscreenChange);
        }
    }

    onClick = (e) => {
        e.stopImmediatePropagation()
        if (this.wrapper !== this.fullscreenElement()) {
            this.requestFullScreen(this.wrapper)
        } else {
            this.cancelFullscreen()
        }
    }

    onFullscreenChange = () => {
        console.log('changed', this.wrapper, this.fullscreenElement(), this.wrapper === this.fullscreenElement())
        if (this.wrapper === this.fullscreenElement()) {
            this.fullscreen.classList.add('in_action')
        } else {
            this.fullscreen.classList.remove('in_action')
        }
    }

    fullscreenElement() {
        return document.fullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement;
    }

    cancelFullscreen() {
        if (!document.cancelFullScreen) {
            if (document.mozCancelFullScreen) {
                document.cancelFullScreen = document.mozCancelFullScreen
            } else if (document.webkitCancelFullScreen) {
                document.cancelFullScreen = document.webkitCancelFullScreen
            }
        }

        if (document.cancelFullScreen) {
            document.cancelFullScreen()
        }
    }

    requestFullScreen(element) {
        if (!element.requestFullscreen) {
            if (element.mozRequestFullScreen) {
                element.requestFullscreen = element.mozRequestFullScreen
            } else if (element.webkitRequestFullScreen) {
                element.requestFullscreen = element.webkitRequestFullScreen
            }
        }

        if (element.requestFullscreen) {
            element.requestFullscreen()
        }
    }

    get isSupported() {
        if (typeof this._isSupported === 'undefined') {
            this._isSupported = (document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitFullscreenEnabled)
        }

        return this._isSupported
    }
}