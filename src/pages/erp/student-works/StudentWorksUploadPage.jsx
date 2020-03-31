import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import StudentWorksUpload from '../../../components/erp/student-works/StudentWorksUpload';

function StudentWorksUploadPage ({ dispatch , studentWorksUploadModel, refreshList }){
	let {
        uploadWorksModalVisible,
        stuIdList,
        tagIdList,

        fileList,
        stuId,
        orgId,

        uploadLoading,                      //上传加载状态(按钮+表单)

    } = studentWorksUploadModel;

    //创建分类
    function createWorkType(){
        dispatch({
            type : 'studentWorksManageTypeModel/openManageTypeModal',
            payload : {
                tagIdList
            }
        })
    };

    //选择校区
    function TenantSelectOnSelect( value ){
        dispatch({
            type : 'studentWorksUploadModel/tenantSelectOnSelect',
            payload : {
                value
            }
        })
    };

    //上传图片
    function fileListChange( info ){
        if(info.file.status != 'uploading' && info.file.response && info.file.response.errorCode != '9000') {
            return message.error(info.file.response.errorMessage || '图片上传失败');
        }
        if(info.file.status == 'removed'){
            message.success('移除成功');
            dispatch({
                type : 'studentWorksUploadModel/updateState',
                payload : {
                    fileList : info.fileList,
                }
            })
        }else if(info.file.status == 'done'){
            message.success(`${info.file.name } 上传成功`);
            dispatch({
                type : 'studentWorksUploadModel/updateState',
                payload : {
                    fileList : info.fileList
                }
            })
        }else if(info.file.status == 'error'){
            message.error(`${info.file.name } 上传失败`);
        }
    };

    //上传作品
    function uploadWorksToCloud( values, works ){
        dispatch({
            type : 'studentWorksUploadModel/uploadWorksToCloud',
            payload : {
                values,
                works,
                refreshList
            }
        })
    }
    //关闭上传作品框
    function cancelUploadWorks(){
        dispatch({
            type : 'studentWorksUploadModel/updateState',
            payload : {
                uploadWorksModalVisible : false,
                fileList : [],
                orgId    : '',
                stuId    : '',
            }
        })
    }

    let studentWorksUploadProps = {
        uploadWorksModalVisible,

        stuIdList,
        tagIdList,

        createWorkType,
        TenantSelectOnSelect,

        cancelUploadWorks,
        uploadWorksToCloud,

        fileListChange,
        fileList,

        stuId,
        orgId,

        uploadLoading,                      //上传加载状态(按钮+表单)
    }
	return (
        <div>
            { !!uploadWorksModalVisible ? <StudentWorksUpload { ...studentWorksUploadProps }/> : null }
        </div>
	)
};

function mapStateToProps ({ studentWorksUploadModel }){
	return { studentWorksUploadModel };
};

export default connect(mapStateToProps)(StudentWorksUploadPage);
