import React from 'react';
import { Button } from 'antd';
import AddOrEditStrModal from './AddOrEditStrModal';
import styles from './StructureAndCourseware.less';
import FreeTree from '../../../../common/new-component/free-tree/Tree';

function Structure({
    dp,                                     //dispatch方法
    treeData,                               //数据
    treeLimit,                              //限制层数
    treeType,                               //类型('structure'/'courseware')

    /*新增编辑状状结构(课件分类，组织架构)modal*/
    addOrEditTreeModalType,                 //modal类型create/create_son/update/delete
    addOrEditTreeModalVisible,              //modal是否显示
    addOrEditTreeModalLoading,              //modal加载状态
    addOrEditTreeModalButtonLoading,        //modal按钮加载状态
    addOrEditTreeModalData,                 //modal编辑时回填数据
}){

    let AddOrEditStrModalProps = {
        treeType,                               //类型('structure'/'courseware')
        addOrEditTreeModalType,                 //modal类型create/create_son/update/delete
        addOrEditTreeModalVisible,              //modal是否显示
        addOrEditTreeModalLoading,              //modal加载状态
        addOrEditTreeModalButtonLoading,        //modal按钮加载状态
        addOrEditTreeModalData,                 //modal编辑时回填数据
        AddOrEditTreeModalSubmit,               //modal提交
        AddOrEditTreeModalClose,                //modal关闭
    }

    /*初始化加载状态的属性*/
    let initModalProps = {
        addOrEditTreeModalLoading : false,
        addOrEditTreeModalButtonLoading : false,
    }

    //组织架构增加子部门create/编辑部门update/删除部门delete
    function StructureOperation(type,item){
        switch(type){
            case 'create' : dp('headQuartersSetting/updateState',{ addOrEditTreeModalVisible : true , addOrEditTreeModalData : {} , addOrEditTreeModalType : type , ...initModalProps }) ; break ;
            case 'create_son' : dp('headQuartersSetting/updateState',{ addOrEditTreeModalVisible : true , addOrEditTreeModalData : item , addOrEditTreeModalType : type , ...initModalProps }) ; break ;
            case 'update' : dp('headQuartersSetting/updateState',{ addOrEditTreeModalVisible : true , addOrEditTreeModalData : item , addOrEditTreeModalType : type , ...initModalProps }) ; break ;
            case 'delete' : dp('headQuartersSetting/AddOrEditTreeModalSubmit',{ id : item.id , treeType , addOrEditTreeModalType : type }) ; break ;
        }
    }

    //modal提交
    function AddOrEditTreeModalSubmit(data){
        dp('headQuartersSetting/AddOrEditTreeModalSubmit',{ treeType , addOrEditTreeModalType, ...data })
    }

    //modal关闭
    function AddOrEditTreeModalClose(){
        dp('headQuartersSetting/updateState',{
            addOrEditTreeModalVisible : false ,
            addOrEditTreeModalData : {} ,
            addOrEditTreeModalType : undefined,
            ...initModalProps
        })
    }

    return(
        <div className = { styles.all }>
            <FreeTree
                data = { treeData }
                limit = { treeLimit }
                type = { treeType }
                onOperation = {(type,item) => StructureOperation(type,item)}/>
            <Button type = 'primary' style = {{ marginTop : 15 }} onClick = {() => StructureOperation('create')}>
                { `添加${treeType == 'structure' ? '部门' : treeType == 'courseware' ? '分类' : '' }` }
            </Button>
            { !!addOrEditTreeModalVisible ? <AddOrEditStrModal {...AddOrEditStrModalProps}/> : null }
        </div>
    )
}

export default Structure;

