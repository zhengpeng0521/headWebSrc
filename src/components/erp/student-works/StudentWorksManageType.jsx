import React from 'react';
import { Form, Modal , Row , Col ,Button , Input , Popconfirm ,Icon,} from 'antd';
import style from './StudentWorksManageType.less';
const FormItem = Form.Item;

function StudentWorksManageType({
	manageTypeModalVisible,
    manageTypeWorkTagList,
    updateWorkTagKey,

	closeManageTypeModal,
    deleteWorkTag,
    updateWorkTag,
    confirmAddWorkTag,
    confirmUpdateWorkTag,

    form : {
		getFieldDecorator,
        validateFieldsAndScroll,
        validateFields,
        getFieldsValue,
        getFieldValue,
        getFieldError,
        setFieldsValue,
        resetFields,
	}
}){
    //确认修改分类
    function confirmUpdateWorkTagAction( key ){
        let updateWorkTag = 'updateWorkTag_'+key;
        validateFields([ updateWorkTag ],function(err, value) {
            if (err) {
                return;
            }
            let name = value[updateWorkTag];
            confirmUpdateWorkTag( name, key );
        })
    };

    //点击增加分类按钮
    function addWorkTag(){
        let addWorkTags = getFieldValue('addWorks') || [];
        if( addWorkTags && addWorkTags.length > 0 ){
            let maxItem = addWorkTags[addWorkTags.length - 1 ];
            let maxIndex = maxItem.index;
            addWorkTags.push({
                index : maxIndex + 1,
                title : ''
            })
        } else {
            addWorkTags.push({
                index : 0,
                title : '',
            })
        }
        setFieldsValue({ 'addWorks': addWorkTags })
    };

    //取消增加分类
    function cancelAddWorkTag( removeIndex ){
        let currentWorkInputValue = getFieldValue('workTag_'+removeIndex);
        //添加后删除输入框
        let addWorkTags = getFieldValue('addWorks') || [];
        let newAddWorkTags = [];
        addWorkTags && addWorkTags.length > 0 && addWorkTags.map(function(item ,index){
            if( item.index != removeIndex){
                newAddWorkTags.push(item)
            }
        })
        setFieldsValue({ 'addWorks' : newAddWorkTags });
    };

    //确认增加分类
    function confirmAddWorkTagAction( removeIndex ){
        let addworkTag = 'addWorkTag_'+removeIndex;
        validateFields([ addworkTag ],function(err, value) {
            if (err) {
                return;
            }
            cancelAddWorkTag( removeIndex );
            let name = value[addworkTag];
            confirmAddWorkTag( name );
        })
    };

    getFieldDecorator('addWorks',{
        initialValue : addWorkTags,
        rules : [
        ]
    });
    let addWorkTags = getFieldValue("addWorks");
    let addWorkInputComponents = [];
    addWorkTags && addWorkTags.length > 0 && addWorkTags.map(function(item,index){
        addWorkInputComponents.push(
            <Row key = { 'manageTypeWorkTag_'+item.index } className = { style.manage_type_content }>
                <Col className = { style.manage_type_content_item_input } span = { 13 }>
                    <Form>
                        <FormItem>
                            { getFieldDecorator('addWorkTag_'+item.index,{
                                initialValue : '',
                                rules : [
                                    { required : true, message : '请输入分类名'}
                                ]
                            })(
                                <Input placeholder = '请输入分类名' />
                            )}
                        </FormItem>
                    </Form>
                </Col>
                <Col className = { style.manage_type_content_item } span = { 4 }>{ 0 }</Col>
                <Col className = { style.manage_type_content_item } span = { 7 }>
                    <a onClick = { () => confirmAddWorkTagAction( item.index ) }>确认</a>
                    <a onClick = { () => cancelAddWorkTag( item.index ) }  style = {{ marginLeft : '10px' }}>取消</a>
                </Col>
            </Row>
        )
    });


    let manageTypeWorkTagListComponents = [];
    manageTypeWorkTagList && manageTypeWorkTagList.map(function( item, index ){
        if( item.id == updateWorkTagKey ){
            manageTypeWorkTagListComponents.push(
                <Row key = { 'manageTypeWorkTagList_'+item.id} className = { style.manage_type_content }>
                    <Col className = { style.manage_type_content_item } span = { 13 }>
                        <Form>
                            <FormItem>
                                { getFieldDecorator('updateWorkTag_'+item.id,{
                                    initialValue : item.name,
                                    rules : [
                                        { required : true, message : '请输入分类名'}
                                    ]
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Form>
                    </Col>
                    <Col className = { style.manage_type_content_item } span = { 4 }>{ item.works }</Col>
                    <Col className = { style.manage_type_content_item } span = { 7 }>
                        <a onClick = { () => confirmUpdateWorkTagAction( item.id ) } >确认</a>
                        <Popconfirm title = "确认要删除么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { () => deleteWorkTag( item.id ) } >
                            <a style = {{ marginLeft : '10px' }}>删除</a>
                        </Popconfirm>
                    </Col>
                </Row>
            )
        } else {
            manageTypeWorkTagListComponents.push(
                <Row key = { 'manageTypeWorkTagList_'+item.id} className = { style.manage_type_content }>
                    <Col className = { style.manage_type_content_item } span = { 13 }>{ item.name }</Col>
                    <Col className = { style.manage_type_content_item } span = { 4 }>{ item.works }</Col>
                    <Col className = { style.manage_type_content_item } span = { 7 }>
                        <a onClick = { () => updateWorkTag( item.id ) }>修改名称</a>
                        <Popconfirm title = "确认要删除么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { () => deleteWorkTag( item.id ) } >
                            <a  style = {{ marginLeft : '10px' }}>删除</a>
                        </Popconfirm>
                    </Col>
                </Row>
            )
        }
    });


	return (
        <Modal
            className = "yhwu_works_manage_modal"
            visible = { manageTypeModalVisible }
            title = '作品分类信息'
            maskClosable = { false }
            onCancel = { closeManageTypeModal }
            width = '550px'
            footer = { null }>
            <div className = { style.manage_type } >
                <Row className = { style.manage_type_head }>
                    <Col className = { style.manage_type_head_item } span = { 13 }>分类名称</Col>
                    <Col className = { style.manage_type_head_item } span = { 4 }>作品数</Col>
                    <Col className = { style.manage_type_head_item } span = { 7 }>操作</Col>
                </Row>
                { manageTypeWorkTagListComponents }
                { addWorkInputComponents }
            </div>

            <div className = { style.manage_type_btn } >
                <Button onClick = { addWorkTag } type = "primary" >增加分类</Button>
            </div>
        </Modal>

	)
};

export default Form.create({})(StudentWorksManageType);
