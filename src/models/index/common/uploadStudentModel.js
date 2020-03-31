import * as services from '../../../services/index/common/uploadExcelService'; //这种写法是把所有的输出包裹到obj对象里
import { parse } from 'qs';
import {message} from 'antd';
export default {

  	namespace: 'uploadStudent',

  	state: {
		showModal 				: false,			// 是否显示映射modal
		recordIndex				: 0,				// 记录当前的步骤索引
		nextString				: '下一步',
		excelString				: '请上传文件',		 // excel文件名
		keyIndex				: undefined,
		selectCampusId			: '',		//选择的校区
		firstStepSuccess 		: false,
		secondStepSuccess 		: false,
		thirdStepSuccess 		: true,
		lastStepSuccess 		: false,
		showResult				: false,
		showResultData			: {},
		regexDic				: {},
		sourceData				: [], //导入文件的字段列表
		targetData				: [],//系统中的学员字段列表
		parentTargetData				: [],//系统中的家长字段列表
        importParent            : false,//是否导入家长
		previewData				: [],
		filePath				: undefined,
		currentId				: '', //学员导入文件的后台保存编号
		flag					: true,
        uploadLoading           : false,     //上传时加载状态
  	},

  	effects: {

		*isModelFile({payload}, {put, call, select}) {
			const {ret} = yield call(services.isModelFile, parse(payload));
			if(ret.errorCode == 9000) {
                if(ret.flag){
                    message.success('检测成功，该文件为模版文件')
                }else{
                    message.success('检测成功，该文件非模版文件')
                }
				yield put({
				  	type : 'updateState',
				  	payload : {
						flag : ret.flag,
                        firstStepSuccess : true,
				  	}
			  	})
			} else {
				message.error(ret && ret.errorMessage);
			}
		},

		//获取源数据 (获取文件内容的字段)
		*getSourceData({payload}, {put, call, select}) {
			const {ret} = yield call(services.getSourceData, parse(payload));
			if(ret.errorCode == 9000) {
				yield put({
				  	type : 'updateState',
				  	payload : {
						filePath   : payload.fp,
					  	sourceData : ret.data.sourceFields,
						targetData : ret.data.dataModelFields,
						parentTargetData : ret.data.parentDataModelFields,
				  	}
			  	})
			} else {
				message.error((ret && ret.errorMessage) || '获取源数据失败');
			}
		},

		//获取预览数据
		*getTableData({payload}, {put, call, select}) {

			let tempRegex = {};

			if(payload.flag) {
				tempRegex = {
					"0":"name",
					"1":"sex",
					"2":"birthday",
                    "3":"nickname",
					"4":"seller",
					"5":"mobile",
					"6":"conaddress",
					"7":"community",
					"8":"schaddress",
					"9":"parentName",
					"10":"parentMobile",
					"11":"parentRelation",
				}
				tempRegex = JSON.stringify(tempRegex);
			} else {
				tempRegex = payload.regex;
			}

			let paramter = {
				id : payload.id,
				regex : tempRegex,
			}

			const {ret} = yield call(services.previewData, parse(paramter));
			if(ret.errorCode == 9000) {

				let tempArr = [];
				ret.results&&ret.results.map((item, index) => {
					item.key = String(index);
					tempArr.push(item);
				})

				yield put({
				  	type : 'updateState',
				  	payload : {
					  	previewData : tempArr,
				  	}
			  	})
			} else {
				message.error((ret && ret.errorMessage) || '获取预览数据失败');
			}
		},

        //学员点击导入确认
        *'uploadMappingData'({payload}, {put, call, select}) {
			yield put({ type : 'showUploadLoading' });
            let tempRegex = {};
			if(payload.flag) {
				tempRegex = {
					"0":"name",
					"1":"sex",
					"2":"birthday",
                    "3":"nickname",
					"4":"seller",
					"5":"mobile",
					"6":"conaddress",
					"7":"community",
					"8":"schaddress",
					"9":"parentName",
					"10":"parentMobile",
					"11":"parentRelation",
				}
			} else {
				tempRegex = payload.regexValue;
			}

			let paramter = {
				regex : JSON.stringify(tempRegex),
				id : payload.id,
				proMode : payload.proMode,
			}

			const {ret} = yield call(services.uploadMappingData, parse(paramter));

			if(ret.errorCode == 9000) {
                let sleep = function(ms) {
                    return new Promise(function(resolve, reject){
                        setTimeout(function(){
                            resolve()
                        }, ms);
                    });
                }
                yield sleep(5000);
                yield put({
                    type:'PollingCheckImport',
                    payload:{
                        orgId : ret.data.orgId,
                        logFileId : ret.data.logFileId
                    }
                });
			}else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('批量导入失败');
                yield put({ type:'clearUploadModal' })
                yield put({ type:'closeUploadLoading' });
            }
		},

        //轮询查看学员是否导入完毕
        *'PollingCheckImport'({ payload },{ call, put, select }){
            yield put({ type:'showUploadLoading' });
            let { ret } = yield call(services.PollingCheckImport,parse(payload));
            if(ret && ret.errorCode === 9000){
                let sleep = function(ms) {
                    return new Promise(function(resolve, reject){
                        setTimeout(function(){
                            resolve()
                        }, ms);
                    });
                }
                if (!ret.data.complete) {
                    yield sleep(5000);
                    yield put({
                        type:'PollingCheckImport',
                        payload:{
                            orgId : payload.orgId,
                            logFileId : payload.logFileId
                        }
                    })
                }else{
                    yield put({ type:'clearUploadModal' })
                    yield put({
                        type : 'updateState',
                        payload : {
                            showModal 		: false,
                            sourceData 		: [],
                            targetData 		: [],
                            parentTargetData 		: [],
                            importParent    : false,
                            showResult		: true,
                            showResultData  : ret.data,
                        }
                    })
                    yield put({ type:'closeUploadLoading' });
                }
            }else{
                message.error(ret && ret.errorMessage ? ret.errorMessage : '批量导入失败');
                yield put({ type:'clearUploadModal' })
                yield put({ type:'closeUploadLoading' });
            }
        }
  	},

  	reducers: {
	  	updateState(state, action) {
            return { ...state, ...action.payload }
        },
	  	changeImportParent(state, action) {
            return { ...state, importParent: !state.importParent, secondStepSuccess: false }
        },
        showUploadLoading(state, action) {
            return { ...state, uploadLoading : true }
        },
        closeUploadLoading(state, action) {
            return { ...state, uploadLoading : false }
        },
        clearUploadModal(state, action){
            return{
                ...state,
                showModal           : false,
                recordIndex         : 0,
                nextString          : '下一步',
                selectCampusId 		: (window._init_data.firstOrg).key,
                keyIndex			: undefined,
                flag 				: false,
                firstStepSuccess 	: false,
                secondStepSuccess 	: false,
                thirdStepSuccess 	: true,
                lastStepSuccess 	: false,
                sourceData 			: [],
                targetData 			: [],
                regexDic			: {},
                excelString			: '请上传文件',
            }
        }
  	},
}
