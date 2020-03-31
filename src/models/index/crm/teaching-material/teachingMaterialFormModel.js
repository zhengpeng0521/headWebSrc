import {message} from 'antd';
import { parse } from 'qs';
import {getTeachingMaterialDetail, createTeachingMaterial, updateTeachingMaterial } from '../../../../services/crm/teaching-material/teachingMaterialService';

export default {

  namespace: 'teachingMaterialFormModel',

  state: {
      visible                    : false,   //表单窗口是否显示
      loading                    : false,

      formData                   : {},      //表单的初始值
      createOrgId                : '',
	  teachingMaterialBtnLoading : false

  },

  effects: {

      /*显示首付款账号的表单*/
      *show({ payload } , { put , call , select }){

            let id = payload && payload.id;
            let orgId = payload && payload.orgId;

            if(id != undefined && id != '') {

                let { ret } = yield call( getTeachingMaterialDetail, parse({id, orgId}));
                if( ret && ret.errorCode == 9000 ){

                    yield put({
                        type : 'updateState',
                        payload : {
                            formData: {
                                id: ret.id,
                                name: ret.name,
                                price: ret.price,
                                sell: ret.sell,
                                stock: ret.stock,
                                orgId: ret.orgId+'',
                                status: ret.status,
                                unit: ret.unit,
                                describes: ret.describes,
                            },
                            visible: true,
                            loading: false,
                        }
                    });

                } else {
                    message.error((ret && ret.errorMessage) || '教材不存在或者已经被删除');
                }
            } else {
                yield put({
                    type : 'updateState',
                    payload : {
                        visible: true,
                        loading: false,
                        formData: {},
                    }
                });
            }
      },

      /*提交保存*/
      *onSubmit({ payload } , { put , call , select }){
          yield put({
                type : 'updateState',
                payload : {
                    loading: true,
					teachingMaterialBtnLoading : true
                }
          });
          let afterSubmit = payload.afterSubmit;
          let closeForm = payload.closeForm;
          let params = payload.params

          let result = {};
          if(params.id == undefined || params.id == '') {
              result = yield call( createTeachingMaterial, parse(params));
          } else {
              result = yield call( updateTeachingMaterial, parse(params));
          }
          let ret = result.ret;
          if( ret && ret.errorCode == 9000 ){
              message.success('保存成功!');
              closeForm && closeForm();
              afterSubmit && afterSubmit();
          } else {
              yield put({
                    type : 'updateState',
                    payload : {
                        loading: false,
                    }
              });
            message.error((ret && ret.errorMessage) || '保存失败');
          }
		  yield put({
			  type : 'updateState',
			  payload : {
				  teachingMaterialBtnLoading : false
			  }
		  })
      },

},


  reducers: {
	  updateState(state, action) {
          return {...state, ...action.payload};
      },

      onClose(state, action) {
          return {...state, visible: false, loading: false, formData: {},}
      },

  }
}
