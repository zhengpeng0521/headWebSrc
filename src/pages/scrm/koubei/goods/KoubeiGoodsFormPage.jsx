import React, {PropTypes} from 'react';
import { connect } from 'dva';
import {message} from 'antd';
import KoubeiGoodsFormComponent from '../../../../components/scrm/koubei/koubei-goods/KoubeiGoodsFormComponent';

function KoubeiGoodsFormPage({dispatch, koubeiGoodsFormModel}) {

	let {
        visible,                 //表单窗口是否显示
        loading,
        formData,
        goodsType,
        courseTypeCheckList,ageCheckList,
        goodsIntroArr,

        orgSelectVisible,
        categoryId,                //商品类目所有类别

        freeOrTemplate,             //模板('1'),自定义('2')
        freeModalContent,           //自定义模板数据
        freeSuppleModalContent,     //补充数据
    } = koubeiGoodsFormModel;

    //关闭表单界面
    function onClose() {
        dispatch({
           type: 'koubeiGoodsFormModel/onClose',
        });
    }

    function refreshList() {
        dispatch({
           type: 'koubeiGoodsModel/queryList',
        });
    }

    //关闭表单界面
    function onSubmit(params, closeForm) {
        dispatch({
           type: 'koubeiGoodsFormModel/onSubmit',
            payload: {
                params,
                afterSubmit: refreshList,
                closeForm,
            }
        });
    }

    /*增加商品简介项*/
    function addGoodsIntro() {
        if(goodsIntroArr && goodsIntroArr.length > 0) {
            if(goodsIntroArr.length == 10) {
                message.warn('最多配置十项商品简介');
                return;
            } else {
                let lastItem = goodsIntroArr[goodsIntroArr.length-1];
                let newIndex = lastItem.index + 1;
                goodsIntroArr.push({
                    key: 'goodsIntro_' + newIndex,
                    index: newIndex,
                    value: '',
                });
            }
        } else {
            goodsIntroArr = [{
                key: 'goodsIntro_0',
                index: 0,
                value: '',
            }];
        }

        dispatch({
           type: 'koubeiGoodsFormModel/updateState',
            payload: {
                goodsIntroArr,
            }
        });
    }

    /*移除商品简介项*/
    function removeGoodsIntroItem(itemKey) {
        let newGoodsIntroArr = [];
        if(goodsIntroArr && goodsIntroArr.length > 0) {
            if(goodsIntroArr.length == 1) {
                message.warn('至少配置1项商品简介');
                return;
            } else {
                for(let i = 0; i < goodsIntroArr.length; i++) {
                    let goodsIntroItem = goodsIntroArr[i];
                    if(goodsIntroItem.key != itemKey) {
                        newGoodsIntroArr.push(goodsIntroItem);
                    }
                }
            }
        } else {
            newGoodsIntroArr.push({
                key: 'goodsIntro_0',
                index: 0,
                value: '',
            });
        }
        dispatch({
           type: 'koubeiGoodsFormModel/updateState',
            payload: {
                goodsIntroArr: newGoodsIntroArr,
            }
        });
    }

    /*显示机构选择窗口*/
    function changeOrgSelectShow() {
        dispatch({
           type: 'koubeiGoodsFormModel/changeOrgSelectShow',
        });
    }

    //表单改变单选框状态(模板/自定义)
    function KouBeiGoodsChangeModalType(e){
        dispatch({
            type : 'koubeiGoodsFormModel/updateState',
            payload : {
                freeOrTemplate : e.target.value
            }
        });
    }

    //课程详情或补充说明自定义时增加简介
    function freeTypeAddGoodsIntroItem(fatherKey,OwnKey,type){
        let hengIndex = OwnKey.indexOf('-');            //获取key值中'-'的索引值
        if(type == 'content'){
            let resultArray = freeModalContent;
            let fatherIndex = -1;
            let ownIndex = -1;
            for(let i in resultArray){
                fatherIndex ++ ;
                if(fatherKey == resultArray[i].key){
                    break;
                }
            }
            for(let i in resultArray[fatherIndex].details){
                ownIndex ++ ;
                if(OwnKey == (resultArray[fatherIndex].details)[i].key){
                    break;
                }
            }
            if(resultArray[fatherIndex].details.length == 10){
                message.warn('课程详情数不得少于1项或多于10项');
            }else{
                resultArray[fatherIndex].details.splice(ownIndex+1,0,{value:undefined,key:parseInt(fatherKey) + '-' + (parseInt((OwnKey+'').substr(hengIndex+1,100))+1)});     //在当前索引项之后增加元素
                dispatch({
                    type:'koubeiGoodsFormModel/updateState',
                    payload:{
                        freeModalContent : resultArray
                    }
                });
            }
        }else if(type == 'suppleContent'){
            let resultArray = freeSuppleModalContent;
            let fatherIndex = -1;
            let ownIndex = -1;
            for(let i in resultArray){
                fatherIndex ++ ;
                if(fatherKey == resultArray[i].key){
                    break;
                }
            }
            for(let i in resultArray[fatherIndex].details){
                ownIndex ++ ;
                if(OwnKey == (resultArray[fatherIndex].details)[i].key){
                    break;
                }
            }
            if(resultArray[fatherIndex].details.length == 10){
                message.warn('补充说明详情数不得少于1项或多于10项');
            }else{
                resultArray[fatherIndex].details.splice(ownIndex+1,0,{value:undefined,key:parseInt(fatherKey) + '-' + (parseInt((OwnKey+'').substr(hengIndex+1,100))+1)});                 //在当前索引项之后增加元素
                dispatch({
                    type:'koubeiGoodsFormModel/updateState',
                    payload:{
                        freeSuppleModalContent : resultArray
                    }
                });
            }
        }
    }

    //课程详情或补充说明自定义时删除简介
    function freeTypeRemoveGoodsIntroItem(fatherKey,OwnKey,type){
        if(type == 'content'){
            let resultArray = freeModalContent;
            let fatherIndex = -1;
            let ownIndex = -1;
            for(let i in resultArray){
                fatherIndex ++ ;
                if(fatherKey == resultArray[i].key){
                    break;
                }
            }
            for(let i in resultArray[fatherIndex].details){
                ownIndex ++ ;
                if(OwnKey == (resultArray[fatherIndex].details)[i].key){
                    break;
                }
            }
            if(resultArray[fatherIndex].details.length == 1){
                message.warn('课程详情数不得少于1项或大多于10项');
            }else{
                resultArray[fatherIndex].details.splice(ownIndex,1);                 //剔除当前删除的元素
                dispatch({
                    type:'koubeiGoodsFormModel/updateState',
                    payload:{
                        freeModalContent : resultArray
                    }
                });
            }
        }else if(type == 'suppleContent'){
            let resultArray = freeSuppleModalContent;
            let fatherIndex = -1;
            let ownIndex = -1;
            for(let i in resultArray){
                fatherIndex ++ ;
                if(fatherKey == resultArray[i].key){
                    break;
                }
            }
            for(let i in resultArray[fatherIndex].details){
                ownIndex ++ ;
                if(OwnKey == (resultArray[fatherIndex].details)[i].key){
                    break;
                }
            }
            if(resultArray[fatherIndex].details.length == 1){
                message.warn('补充说明详情数不得少于1项或大多于10项');
            }else{
                resultArray[fatherIndex].details.splice(ownIndex,1);                 //剔除当前删除的元素
                dispatch({
                    type:'koubeiGoodsFormModel/updateState',
                    payload:{
                        freeSuppleModalContent : resultArray
                    }
                });
            }
        }
    }

    //增加一组课程名称或补充说明和详情
    function freeTypeAddGoods(fatherKey,type){
        if(type == 'content'){
            if(freeModalContent.length == 10){
                message.warn('课程名称项不能少于1项或者多于10项');
            }else{
                let resultArray = freeModalContent;
                let fatherIndex = -1;
                for(let i in resultArray){
                    fatherIndex ++ ;
                    if(fatherKey == resultArray[i].key){
                        break;
                    }
                }
                resultArray.splice(fatherIndex+1,0,{title:undefined,key:(parseInt(fatherKey)+1)+'',details:[{value:undefined,key:(parseInt(fatherKey)+1) + '-0'}]});
                dispatch({
                    type:'koubeiGoodsFormModel/updateState',
                    payload:{
                        freeModalContent : resultArray
                    }
                });
            }
        }else if(type == 'suppleContent'){
            if(freeSuppleModalContent.length == 10){
                message.warn('补充说明项不能少于1项或者多于10项');
            }else{
                let resultArray = freeSuppleModalContent;
                let fatherIndex = -1;
                for(let i in resultArray){
                    fatherIndex ++ ;
                    if(fatherKey == resultArray[i].key){
                        break;
                    }
                }
                resultArray.splice(fatherIndex+1,0,{title:undefined,key:(parseInt(fatherKey)+1)+'',details:[{value:undefined,key:(parseInt(fatherKey)+1) + '-0'}]});
                dispatch({
                    type:'koubeiGoodsFormModel/updateState',
                    payload:{
                        freeSuppleModalContent : resultArray
                    }
                });
            }
        }
    }

    //删除一组课程名称或补充说明和详情
    function freeTypeRemoveGoods(fatherKey,type){
        if(type == 'content'){
            if(freeModalContent.length == 1){
                message.warn('课程名称项不能少于1项或者多于10项');
            }else{
                let resultArray = freeModalContent;
                let fatherIndex = -1;
                for(let i in resultArray){
                    fatherIndex ++ ;
                    if(fatherKey == resultArray[i].key){
                        break;
                    }
                }
                resultArray.splice(fatherIndex,1);                 //剔除当前删除的元素
                dispatch({
                    type:'koubeiGoodsFormModel/updateState',
                    payload:{
                        freeModalContent : resultArray
                    }
                });
            }
        }else if(type == 'suppleContent'){
            if(freeSuppleModalContent.length == 1){
                message.warn('补充说明项不能少于1项或者多于10项');
            }else{
                let resultArray = freeSuppleModalContent;
                let fatherIndex = -1;
                for(let i in resultArray){
                    fatherIndex ++ ;
                    if(fatherKey == resultArray[i].key){
                        break;
                    }
                }
                resultArray.splice(fatherIndex,1);                 //剔除当前删除的元素
                dispatch({
                    type:'koubeiGoodsFormModel/updateState',
                    payload:{
                        freeSuppleModalContent : resultArray
                    }
                });
            }
        }
    }

    //课程名称输入框onChange事件
    function freeContentTitleOnChange(e){
        let resultArray = freeModalContent;
        let fatherIndex = -1;
        for(let i in resultArray){
            fatherIndex ++ ;
            if(resultArray[i].key == (e.target.id).substr(31,100)){
                break;
            }
        }
        resultArray[fatherIndex].title = e.target.value;
        dispatch({
            type:'koubeiGoodsFormModel/updateState',
            payload:{
                freeModalContent : resultArray
            }
        });
    }

    //课程详情输入框onChange事件
    function detailContentOnChange(e){
        let resultArray = freeModalContent;
        let flag = true;
        let fatherIndex = -1;
        let ownIndex;
        for(let i in resultArray){
            if(flag){
                ownIndex = -1;
                fatherIndex ++ ;
                for(let j in freeModalContent[i].details){
                    ownIndex ++
                    if((freeModalContent[i].details)[j].key == (e.target.id).substr(32,100)){
                        flag = false;
                        break;
                    }
                }
            }
        }
        resultArray[fatherIndex].details[ownIndex].value = e.target.value;
        dispatch({
            type:'koubeiGoodsFormModel/updateState',
            payload:{
                freeModalContent : resultArray
            }
        });
    }

    //补充说明名称输入框onChange事件
    function freeContentSuppleTitleOnChange(e){
        let resultArray = freeSuppleModalContent;
        let fatherIndex = -1;
        for(let i in resultArray){
            fatherIndex ++ ;
            if(resultArray[i].key == (e.target.id).substr(38,100)){
                break;
            }
        }
        resultArray[fatherIndex].title = e.target.value;
        dispatch({
            type:'koubeiGoodsFormModel/updateState',
            payload:{
                freeSuppleModalContent : resultArray
            }
        });
    }

    //补充说明详情输入框onChange事件
    function detailContentSuppleOnChange(e){
        let resultArray = freeSuppleModalContent;
        let flag = true;
        let fatherIndex = -1;
        let ownIndex;
        for(let i in resultArray){
            if(flag){
                ownIndex = -1;
                fatherIndex ++ ;
                for(let j in freeSuppleModalContent[i].details){
                    ownIndex ++
                    if((freeSuppleModalContent[i].details)[j].key == (e.target.id).substr(39,100)){
                        flag = false;
                        break;
                    }
                }
            }
        }
        resultArray[fatherIndex].details[ownIndex].value = e.target.value;
        dispatch({
            type:'koubeiGoodsFormModel/updateState',
            payload:{
                freeSuppleModalContent : resultArray
            }
        });
    }

    let componProps = {
        visible,
        loading,
        formData,
        goodsType,
        courseTypeCheckList,
        ageCheckList,
        freeOrTemplate,             //模板('1'),自定义('2')
        freeModalContent,           //自定义模板数据
        freeSuppleModalContent,     //补充数据

        onClose,
        onSubmit,
        goodsIntroArr,
        addGoodsIntro,
        removeGoodsIntroItem,
        orgSelectVisible,
        changeOrgSelectShow,

        categoryId,                //商品类目所有类别

        KouBeiGoodsChangeModalType,     //表单改变单选框状态(模板/自定义)
        freeTypeAddGoodsIntroItem,      //课程详情自定义时增加简介
        freeTypeRemoveGoodsIntroItem,   //课程详情自定义时删除简介
        freeTypeAddGoods,               //增加一组课程名称和详情
        freeTypeRemoveGoods,            //删除相应课程名称和详情

        freeContentTitleOnChange,       //课程名称输入框onChange事件
        detailContentOnChange,          //课程详情输入框onChange事件

        freeContentSuppleTitleOnChange, //补充说明名称输入框onChange事件
        detailContentSuppleOnChange,    //补充说明详情输入框onChange事件

    };

    return (
        <KoubeiGoodsFormComponent {...componProps} />
    );
}

KoubeiGoodsFormPage.propTypes = {
	koubeiGoodsFormModel	: PropTypes.object,
  	dispatch	: PropTypes.func,
};

function mapStateToProps({ koubeiGoodsFormModel }) {
  	return { koubeiGoodsFormModel };
}

export default connect(mapStateToProps)(KoubeiGoodsFormPage);
