import Video from './video'
import Stream from './stream'
import './style.scss'

document.addEventListener("DOMContentLoaded", function (event) {
    window.video = new Video()
    window.stream = new Stream(window.video)
})