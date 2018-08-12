import logger from '../../util/logger';

class Audio {
  constructor(url, type) {
    this.dom = document.createElement('audio');
    this.dom.src = url;
    if (type) {
      this.dom.type = type;
    }
  }
  play() {
    this.dom.play();
  }
  pasue() {
    this.dom.pause();
  }
  replay() {
    this.dom.currentTime = 0;
    this.play();
  }
}
const voiceUrl = logger.isPro() ? '/res/static/audio/neican.mp3' : '../../static/audio/neican.mp3';

const ycjVoice = new Audio(voiceUrl);
export {
  Audio,
  ycjVoice,
};
