import {post, postJson} from './request';

const urlList = {
  collectUpdload: '',
};

const collectAssociate = (params = {}) => postJson(urlList.collectUpdload, params);

export default {
  collectAssociate
}