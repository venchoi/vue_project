import {
  user,
} from '../../../model/storage';

export default (vueComponent, data) => {
  const isAutoLogin = vueComponent.$storage.read('autoLogin');
  const rememberPwd = vueComponent.$storage.read('rememberPwd');
  const token = data.token;
  const uid = data.uid;
  if (isAutoLogin) {
    user.write({
      token,
      uid,
    });
  } else {
    user.write({
      token,
      uid,
    }, true);
  }

  if (rememberPwd) {
    vueComponent.$storage.application.save('accountData', vueComponent.formData);
  } else {
    vueComponent.$storage.application.remove('accountData');
  }
};
