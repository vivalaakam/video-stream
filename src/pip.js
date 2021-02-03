export default class PIP {
    constructor(wrapper) {
        this.video = wrapper.querySelector('#video')
        this.pip = wrapper.querySelector('.pip')

        if (!this.isSupported) {
            this.pip.style.display = 'none'
        } else {
            this.pip.addEventListener('click', this.onClick);
            video.addEventListener('enterpictureinpicture', this.enterPictureTopicture)
            video.addEventListener('leavepictureinpicture', this.leavePictureTopicture)
        }


    }

    onClick = (e) => {
        e.stopImmediatePropagation()

        if (this.video !== document.pictureInPictureElement) {
            this.video.requestPictureInPicture()
        } else {
            document.exitPictureInPicture()
        }
    }

    enterPictureTopicture = () => {
        this.pip.classList.add('in_action')
    }
    
    leavePictureTopicture = () => {
        this.pip.classList.remove('in_action')
    }

    get isSupported() {
        if (typeof this._isSupported === 'undefined') {
            this._isSupported = 'pictureInPictureEnabled' in document
        }

        return this._isSupported
    }
}