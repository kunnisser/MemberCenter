import {basePath, prostatus} from '../utils/env';
import Axios from 'axios';

/*
* 设置对应数据mock
* @params getMock get请求mock
* @params postMock post请求
* @params putMock 修改某个数据请求
* */

const loginToken = window.localStorage.getItem('xxgmc_jwt_token') || null;

let getMock = (url) => {
  return (params) => Axios.get(url, {params: params,
    timeout: 8000,
    headers: {
    xxgmc_jwt_token: prostatus === 'development' ? 'eyJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50SWQiOiJvT2lrY3Y4V2JVam43ODJpN1Y2czBIU1hBekdnIn0.0csKHuOR4n0jALwC3rcBKUdhqwE1HifCHTnWV1Xog4Q' : loginToken
  }
  });
};

let postMock = (url) => {
  return (params) => Axios.post(url, params, {
    timeout: 8000,
    headers: {
      'Content-Type': 'application/json',
      'xxgmc_jwt_token': loginToken
    }});
};

// let deleteMock = (url) => {
//   return (id, params) => Axios.delete(url + '/' + id, {
//     params: params,
//     timeout: 8000,
//     headers: {
//       'xxgmc_jwt_token': loginToken
//     }
//   });
// };

// let putMock = (url) => {
//   return params => Axios.put(url, params);
// };

// let patchMock = (url) => {
//   return (id, params) => Axios.patch(url + '/' + id, params, {
//     timeout: 8000,
//     headers: {
//       'xxgmc_jwt_token': loginToken
//     }
//     });
// };

const ApiPath = basePath + (prostatus === 'development' ? '/xxgmc' : '/xxgmc');

const getUserData = getMock(ApiPath + '/index/userinfo');
const register = postMock(ApiPath + '/register');
const sign = postMock(ApiPath + '/scoreWeb/save');
const editUserData = postMock(ApiPath + '/member/update');
const getUserScore = getMock(ApiPath + '/scoreWeb/userscore');
const getUserCard = getMock(ApiPath + '/cardWeb/usercard');
const getUserPrize = getMock(ApiPath + '/prizeWeb/userprize');
const receivePrize = postMock(ApiPath + '/prizeWeb/receivePrize');
const getUserOrder = getMock(ApiPath + '/orderWeb/myorders');
const addUserOrder = postMock(ApiPath + '/orderWeb/papreorder');
const cancelUserOrder = postMock(ApiPath + '/orderWeb/cancel');
const repapreOrder = postMock(ApiPath + '/orderWeb/repapreorder');
const getUserTravelNote = getMock(ApiPath + '/noteWeb/getMyNotes');
const getTravelNote = getMock(ApiPath + '/communityWeb/getNotes');
const thumbUpTravelNote = getMock(ApiPath + '/noteWeb/support');
const thumbUpPhotos = getMock(ApiPath + '/photoWeb/support');
const getTnDetail = getMock(ApiPath + '/noteWeb/getNoteDetail');
const addTnDetail = postMock(ApiPath + '/noteWeb/saveNote');
const delImgPic = postMock(ApiPath + '/noteWeb/delImg');
const getTnComment = getMock(ApiPath + '/noteWeb/getComments');
const editComment = postMock(ApiPath + '/noteWeb/saveComment');
const addTnPhotos = postMock(ApiPath + '/tnphotos');
const inquireTnPhotos = getMock(ApiPath + '/photoWeb/getMyPhotos');
const inquirePhotos = getMock(ApiPath + '/communityWeb/getPhotos');
const deleteTnPhotos = getMock(ApiPath + '/photoWeb/delPhoto');
const showPhotos = getMock(ApiPath + '/communityWeb/showPhoto');
const addUserFeed = postMock(ApiPath + '/suggestWeb/saveSuggest');
const getUserFeed = getMock(ApiPath + '/suggestWeb/listMySuggest');
const getAllFeed = getMock(ApiPath + '/suggestWeb/listAllSuggest');
const getCommentedTn = getMock(ApiPath + '/communityWeb/getMyComment');
const locationMyComment = getMock(ApiPath + '/communityWeb/getMyNoteCommentByNote');
const getThumbedTn = getMock(ApiPath + '/communityWeb/mysupportlist');
const getSharedTn = getMock(ApiPath + '/communityWeb/getMyArticle');
const getShareTn = getMock(ApiPath + '/communityWeb/getArticle');
const getActivity = getMock(ApiPath + '/communityWeb/getActives');
const getRecommendScore = getMock(ApiPath + '/goodWeb/getGoodList');
const getRecommendDiscount = getMock(ApiPath + '/requestrecommenddiscount');
const getGoodsDetail = getMock(ApiPath + '/goodWeb/getGoodDetail');
const getGenerateOrder = getMock(ApiPath + '/orderWeb/confirmorder');
const getCommitOrderResp = getMock(ApiPath + '/orderWeb/getByOutTradeNo');
const reqPrizeList = getMock(ApiPath + '/prizeWeb/prizelist');
const reqLottery = postMock(ApiPath + '/prizeWeb/lottery');
const getDogsInfo = getMock(ApiPath + '/dogWeb/myDog');
const careForDogs = getMock(ApiPath + '/dogWeb/handle');
const buyDogsProp = postMock(ApiPath + '/dogWeb/buy');
const rebornDogs = getMock(ApiPath + '/dogWeb/adopt');
const shareApi = postMock(ApiPath + '/communityWeb/share');
const shareSuccess = getMock(ApiPath + '/communityWeb/shareSuccess');
const initGame = getMock(ApiPath + '/gameWeb/get');
const buyPlayTimes = postMock(ApiPath + '/gameWeb/buy');
const sharePlayTimes = postMock(ApiPath + '/gameWeb/share');
const playSuccess = getMock(ApiPath + '/gameWeb/playSuccess');

export {
  getUserData,
  getUserScore,
  getUserCard,
  register,
  sign,
  editUserData,
  getUserPrize,
  getUserOrder,
  addUserOrder,
  cancelUserOrder,
  repapreOrder,
  getUserTravelNote,
  getTravelNote,
  thumbUpTravelNote,
  getTnDetail,
  addTnDetail,
  delImgPic,
  getTnComment,
  editComment,
  addTnPhotos,
  inquireTnPhotos,
  inquirePhotos,
  deleteTnPhotos,
  addUserFeed,
  getUserFeed,
  getAllFeed,
  getCommentedTn,
  locationMyComment,
  getThumbedTn,
  getSharedTn,
  getShareTn,
  getActivity,
  getRecommendScore,
  getRecommendDiscount,
  getGoodsDetail,
  getGenerateOrder,
  getCommitOrderResp,
  thumbUpPhotos,
  getDogsInfo,
  careForDogs,
  buyDogsProp,
  rebornDogs,
  reqPrizeList,
  reqLottery,
  receivePrize,
  shareApi,
  showPhotos,
  shareSuccess,
  initGame,
  buyPlayTimes,
  sharePlayTimes,
  playSuccess
};
