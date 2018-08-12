import * as chanel from './chanel';
import baseUtil from '../util/baseUtil';

baseUtil.each(chanel, (time, name) => {
  setInterval(() => {
    self.postMessage({
      chanel: name,
    });
  }, time);
});

