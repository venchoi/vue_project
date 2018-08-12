/**
 * @module:
 * @des:
 * @author Hou (@Hou-区浩辉, ouhaohui@outlook.com)
 */

let uid = 0xff;


export default () => {
  const id = uid + 1;
  uid = id;
  return uid;
};
