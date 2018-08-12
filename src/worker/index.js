import WsWorker from './YCJWebsocket.worker';
import SeriesWorker from './seriesRequester.worker';
import Timer from './timer.worker';
import * as chanel from './chanel';
import {
  user,
} from '../model/storage';

const timerWorker = new Timer();
const YCJWSWorker = new WsWorker();
const seriesWorker = new SeriesWorker();

YCJWSWorker.postMessage({
  method: 'extra',
  payload: [user.read()],
});

timerWorker.onmessage = ((e) => {
  const data = e.data;

  timerWorker.dispatchEvent(new Event(chanel[data.chanel]));
});
timerWorker.chanel = chanel;
export {
  YCJWSWorker,
  timerWorker,
  seriesWorker,
};
