import {message} from 'antd';
import { parse } from 'qs';
import moment from 'moment';

import {
    getKoubeiGoodsDetailCourse,
    getKoubeiGoodsDetailActivity,
    initKoubeiFormData,
    createKoubeiGoodsCourse,
    createKoubeiGoodsActivity,
    updateKoubeiGoodsCourse,
    updateKoubeiGoodsActivity
} from '../../../../../services/scrm/koubei/koubei-goods/koubeiGoodsService';

export default {

    namespace: 'koubeiGoodsFormModel',

    state: {
        visible: false,   //表单窗口是否显示
        loading: false,

        goodsType: '',//商品类型   'course'  /  'activity'
        formData: {},  //表单的初始值

        courseTypeCheckList: [],//课程类型选择项
        ageCheckList: [],     //适合年龄选择项

        goodsIntroArr: [],//口碑商品简介

        orgSelectVisible: false,

        categoryId : [],                //商品类目所有类别

        freeOrTemplate : '1',               //模板('1'),自定义('2')
        freeModalContent : [],              //自定义模板数据
        freeSuppleModalContent : [],        //自定义补充数据
  },

  effects: {

      /*显示首付款账号的表单*/
      *show({ payload } , { put , call , select }){
          let koubeiGoodsFormModel = yield select(state => state.koubeiGoodsFormModel);
          let goodsId = payload && payload.goodsId;
          let goodsType = payload && payload.goodsType;

          if(goodsId != undefined && goodsId != '') {

              let result = {};
              if(goodsType == 'course') {
                  result = yield call( getKoubeiGoodsDetailCourse, parse({goodsId}));
              } else if(goodsType == 'activity') {
                  result = yield call( getKoubeiGoodsDetailActivity, parse({goodsId}));
              }
            let ret = result.ret;
            if( ret && ret.errorCode == 9000 ){
                let formData = ret.results && ret.results.length > 0 && ret.results[0];

                if(formData) {

                    let goodsIntroArr = [];
                    //商品封面
                    let {cover,pictureDetails,courseDesc,activityDesc,activityTime,courseCat,courseAge,activityAge,courseHour,courseDuring,} = formData;

                    if(cover && cover.length > 0) {
                        let coverObj = JSON.parse(cover);
                        formData.fengmian = [
                            {
                                uid: -1,
                                name: coverObj.imgId,
                                status: 'done',
                                url: coverObj.imgurl,
                                imgId: coverObj.imgId,
                            }
                        ];
                    }

                    if(pictureDetails && pictureDetails.length > 0) {
                        let pictureDetailsObj = JSON.parse(pictureDetails);
                        if(pictureDetailsObj && pictureDetailsObj.length > 0) {
                            let detailImg = [];
                            for(let i = 0; i < pictureDetailsObj.length; i++) {
                                let imgItem = pictureDetailsObj[i];
                                detailImg.push({
                                    uid: i,
                                    name: imgItem.imgId,
                                    status: 'done',
                                    url: imgItem.imgurl,
                                    imgId: imgItem.imgId,
                                });
                            }
                            formData.detailImg = detailImg;
                        }
                    }

                    formData.belongOrg = ret.data.orgIds;

                    //商品简介
                    let goodsInterText = goodsType == 'course' ? courseDesc : activityDesc;
                    let goodsInterTextArr = goodsInterText && goodsInterText.split('#$@&$#');
                    goodsInterTextArr && goodsInterTextArr.length > 0 && goodsInterTextArr.map(function(goodsInterTextItem, goodsInterTextIndex) {
                        goodsIntroArr.push({
                            key: 'goodsIntro_' + goodsInterTextIndex,
                            index: goodsInterTextIndex,
                            value: goodsInterTextItem,
                        });
                    });

                    //如果获取的数组为空时用此数组
                    let idEmptyModal = [{title : undefined,key : '0',details :[{ value : undefined , key : '0-0'}]}];
                    //接收到后台请求时反编译后台数据用于前端回填
                    let originCourseArray = ret.results[0].descriptions;
                    let formatCourseArray = [];
                    if(originCourseArray == null || originCourseArray == undefined || originCourseArray == '' || originCourseArray.length < 1){
                        formatCourseArray = idEmptyModal;
                    }else{
                        originCourseArray.map((first,firstIndex) => {
                            let obj = {};
                            obj.title = first.title;
                            obj.key = firstIndex + '';
                            let detailArr = [];
                            first.details.map((details,index) => {
                                detailArr.push({
                                    value : details,
                                    key : firstIndex+'-'+index
                                })
                            })
                            obj.details = detailArr;
                            formatCourseArray.push(obj);
                        })
                    }

                    let originCourseSuppleArray = ret.results[0].buyer_notes;
                    let formatCourseSuppleArray = [];
                    if(originCourseSuppleArray == null || originCourseSuppleArray == undefined || originCourseSuppleArray == '' || originCourseSuppleArray.length < 1){
                        formatCourseSuppleArray = idEmptyModal;
                    }else{
                        originCourseSuppleArray.map((first,firstIndex) => {
                            let obj = {};
                            obj.title = first.title;
                            obj.key = firstIndex + '';
                            let detailArr = [];
                            first.details.map((details,index) => {
                                detailArr.push({
                                    value : details,
                                    key : firstIndex+'-'+index
                                })
                            })
                            obj.details = detailArr;
                            formatCourseSuppleArray.push(obj);
                        })
                    }

                    if(goodsType == 'course') {
                        if(courseCat && courseCat.length > 0) {
                            formData.courseType = courseCat.split(',');
                        } else {
                            formData.courseType = [];
                        }

                        if(courseAge && courseAge.length > 0) {
                            formData.age = courseAge.split(',');
                        } else {
                            formData.age = [];
                        }

                        if(courseHour && courseHour.length > 0) {
                            let courseHourArr = courseHour.split('-');
                            if(courseHourArr && courseHourArr.length > 0) {
                                formData.keshishu = courseHourArr[0];
                            }
                        }
                        if(courseDuring && courseDuring.length > 0) {
                            let courseDuringArr = courseDuring.split('-');
                            if(courseDuringArr && courseDuringArr.length > 0) {
                                formData.courseLong = courseDuringArr[0];
                            }
                        }

                    } else if(goodsType == 'activity') {
                        if(courseAge && courseAge.length > 0) {
                            formData.age = courseAge.split(',');
                        } else {
                            formData.age = [];
                        }

                        if(activityTime && activityTime.length > 0) {
                            let activityTimeArr = activityTime.split('~');
                            if(activityTimeArr && activityTimeArr.length == 2) {
                                formData.activityTimeArr = [
                                    moment(activityTimeArr[0], 'YYYY-MM-DD HH:mm:ss'),
                                    moment(activityTimeArr[1], 'YYYY-MM-DD HH:mm:ss'),
                                ];
                            }
                        }
                    }

                    yield put({
                        type : 'updateState',
                        payload : {
                            freeOrTemplate : ret.results[0].goodSrc,                    //是使用早教模板还是自定义
                            formData,
                            goodsIntroArr,
                            visible: true,
                            loading: false,
                            goodsType,
                            freeModalContent : formatCourseArray || [],                 //自定义模板数据
                            freeSuppleModalContent : formatCourseSuppleArray || [],     //自定义补充数据
                        }
                    });
                }
              } else {
                message.error((ret && ret.errorMessage) || '商品不存在或者已经被删除');
              }
            } else {
                yield put({
                    type : 'updateState',
                    payload : {
                        visible: true,
                        loading: false,
                        formData: {},
                        goodsType,
                    }
                });
            }

          let {courseTypeCheckList,ageCheckList,} = koubeiGoodsFormModel;
          if(courseTypeCheckList == undefined || courseTypeCheckList.length == 0 || ageCheckList == undefined || ageCheckList.length == 0) {
              yield put({
                type : 'initKoubeiFormData',
              });
          }

      },

      /*提交保存*/
      *onSubmit({ payload } , { put , call , select }){
          yield put({
                type : 'updateState',
                payload : {
                    loading: true,
                }
          });
          let koubeiGoodsFormModel = yield select(state => state.koubeiGoodsFormModel);

          let afterSubmit = payload.afterSubmit;
          let closeForm = payload.closeForm;
          let params = payload.params;

          let {goodsIntroArr} = koubeiGoodsFormModel;

          let {
              goodsType,fengmian,detailImg,belongOrg,gmtStartType,gmtStart,age,
              courseHour,courseDuring,courseType,
              activityTime,
          } = params;
          let goodsTypeName = goodsType == 'course' ? '课程' : '活动';
          console.info('params',params);
          console.info('fengmian', fengmian);
          console.info('detailImg', detailImg);
          if(fengmian && fengmian.length > 0) {
              let fengmianObj = fengmian[0];
              let imgId = (fengmianObj.imgId && fengmianObj.imgId.length > 0) ? fengmianObj.imgId :
                          (fengmianObj.response && fengmianObj.response.data && fengmianObj.response.data.imageId && fengmianObj.response.data.imageId.length > 0) ?
                          fengmianObj.response.data.imageId : '';
              let imgurl = (fengmianObj.url && fengmianObj.url.length > 0) ? fengmianObj.url :
                          (fengmianObj.response && fengmianObj.response.data && fengmianObj.response.data.url && fengmianObj.response.data.url.length > 0) ?
                          fengmianObj.response.data.url : '';
              params.cover = JSON.stringify({ imgId, imgurl, });
          }

          if(detailImg && detailImg.length > 0) {
              let pictureDetails = [];
              detailImg.map(function(detailImgItem) {
                  let imgId = (detailImgItem.imgId && detailImgItem.imgId.length > 0) ? detailImgItem.imgId :
                          (detailImgItem.response && detailImgItem.response.data && detailImgItem.response.data.imageId && detailImgItem.response.data.imageId.length > 0) ?
                          detailImgItem.response.data.imageId : '';
                  let imgurl = (detailImgItem.url && detailImgItem.url.length > 0) ? detailImgItem.url :
                          (detailImgItem.response && detailImgItem.response.data && detailImgItem.response.data.url && detailImgItem.response.data.url.length > 0) ?
                          detailImgItem.response.data.url : '';
                  pictureDetails.push({
                      imgId, imgurl,
                  });
              });
              params.pictureDetails = JSON.stringify(pictureDetails);
          }

          params.orgIds = belongOrg.join(',');

          if(gmtStart) {
              params.gmtStart = gmtStart.format('YYYY-MM-DD HH:mm:ss');
          }

          //商品简介
          let goodsIntroTextArr = [];
          if(goodsIntroArr && goodsIntroArr.length > 0) {
              goodsIntroArr.map(function(infoItem) {
                  let infoItemKey = infoItem.key;
                  goodsIntroTextArr.push(params[infoItemKey]);
              });
          }

          if(goodsType == 'course') {
              params.courseDesc = goodsIntroTextArr.join('#$@&$#');
              params.courseCat = params.courseType ? params.courseType.join(',') : '';
              params.courseAge = params.age ? params.age.join(',') : '';
          } else if(goodsType == 'activity') {
              params.activityDesc = goodsIntroTextArr.join('#$@&$#');
              params.activityAge = params.age ? params.age.join(',') : '';

              if(activityTime && activityTime.length == 2) {
                  params.activityTime = activityTime[0].format('YYYY-MM-DD HH:mm:ss') + '~' + activityTime[1].format('YYYY-MM-DD HH:mm:ss');
              }
          }

          params.detailImg = '';
          params.fengmian = '';
          params.belongOrg = '';
          params.age = '';
          params.courseType = '';

          let result = {};
          if(params.id == undefined || params.id == '') {
              if(goodsType == 'course') {
                  result = yield call( createKoubeiGoodsCourse, parse(params));
              } else if(goodsType == 'activity') {
                  result = yield call( createKoubeiGoodsActivity, parse(params));
              }
          } else {
              if(goodsType == 'course') {
                  result = yield call( updateKoubeiGoodsCourse, parse(params));
              } else if(goodsType == 'activity') {
                  result = yield call( updateKoubeiGoodsActivity, parse(params));
              }
          }
          let ret = result.ret;

          if( ret && ret.errorCode == 9000 ){
              message.success(goodsTypeName + '保存成功!');
              closeForm && closeForm();
              afterSubmit && afterSubmit();
          } else {
              yield put({
                    type : 'updateState',
                    payload : {
                        loading: false,
                    }
              });
            message.error((ret && ret.errorMessage) || goodsTypeName + '保存失败');
          }
      },

      /*初始化课程类型*/
      *initKoubeiFormData({ payload } , { put , call , select }){
          let { ret } = yield call(initKoubeiFormData);
          if( ret && ret.errorCode == 9000 ){

              let courseTypeCheckList = [], ageCheckList = [];
              if(ret && ret.dict && ret.dict.organcategory && ret.dict.organcategory.length > 0) {
                  ret.dict.organcategory.map(function(oItem) {
                      courseTypeCheckList.push({
                          label: oItem.label,
                          value: oItem.label,
                      });
                  });
              }
              if(ret && ret.dict && ret.dict.agetag && ret.dict.agetag.length > 0) {
                  ret.dict.agetag.map(function(aItem) {
                      ageCheckList.push({
                          label: aItem.label,
                          value: aItem.label,
                      });
                  });
              }

              yield put({
                    type : 'updateState',
                    payload : {
                        courseTypeCheckList,ageCheckList,
                    }
              });
          }
      },
},


    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload};
        },

        onClose(state, action) {
            return {...state, visible: false, loading: false, formData: {}, goodsIntroArr: []}
        },

        changeOrgSelectShow(state, action) {
            let orgSelectVisible = state.orgSelectVisible;
            return {...state, orgSelectVisible: !orgSelectVisible,}
        },

    }
}
