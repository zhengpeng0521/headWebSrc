import React from 'react';
import { Button , Form , Input , Select , DatePicker , message } from 'antd';
import styles from './AddFollowRecord.less';
const Option = Select.Option;

/*跟进记录*/
function AddFollowRecord({
    leadsFollowDetailLeadMessage,           //选中leads名单查看详情时当前人的信息
    leadsFollowWay,                         //跟进方式
    leadsFollowFastSearchFollowState,       //快捷搜索栏跟进状态下拉列表内容，还可以用来格式化跟进状态
    leadsFollowFollowRecordButtonLoading,   //新增跟进记录发布按钮是否加载
    LeadsFollowFollowRecordAdd,             //新增跟进记录

    parentListArr, //学员家长id 姓名
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
    },
}){
    //跟进方式渲染
    let followWay = [];
    if(leadsFollowWay && leadsFollowWay.length > 0){
        followWay = leadsFollowWay.map((item,index) => {
            return(
                <Option key = { item.key + '' } value = { item.key + '' }>{ item.value + '' }</Option>
            );
        })
    }

    //跟进状态渲染
    let followState = [];
    if(leadsFollowFastSearchFollowState && leadsFollowFastSearchFollowState.length > 0){
        followState = leadsFollowFastSearchFollowState.map((item,index) => {
            return(
                <Option key = { item.key + '' } value = { item.key + '' }>{ item.value + '' }</Option>
            );
        })
    }

    //时间选择器时间范围限制
    function disabledDate(current) {
        return current && current.valueOf() < Date.now() - 24*60*60*100;
    }

    //点击发布
    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            /*if (!!errors) {
                return;
            }*/
            if(values.content == '' || values.content == null || values.content == undefined || /^[\s]*$/.test(values.content)){
                message.warn('跟进记录内容必填');
                return;
            }
            if(values.content.length > 200){
                message.warn('跟进记录内容超过字数限制');
                return;
            }
            if(values.parentId == '' || values.parentId == null || values.parentId == undefined || /^[\s]*$/.test(values.parentId)){
                message.warn('家长信息必选');
                return;
            }
            // if(values.type == '' || values.type == null || values.type == undefined || /^[\s]*$/.test(values.type)){
            //     message.warn('跟进方式必选');
            //     return;
            // }
            //当前leads的id
            values.stuId = leadsFollowDetailLeadMessage.id || undefined;

            //当前leads的orgId
            values.orgId = leadsFollowDetailLeadMessage.orgId || undefined;

            //格式化来源
            if(values.nextFollowTime != '' && values.nextFollowTime != null && values.nextFollowTime != undefined && !/^[\s]*$/.test(values.type)){
                values.nextFollowTime = values.nextFollowTime.format('YYYY-MM-DD HH:mm:ss');
            }

            //来源 Crm
            values.source = '1';
            LeadsFollowFollowRecordAdd(values);
            resetFields();
        });
    }


  var parentarr=[];
    parentListArr &&  parentListArr.map(function (item) {
        var data = {
            parentId:item.id,
            parentName:item.name,

        };
        parentarr.push(data);

    });


 //    (leadsFollowDetailLeadMessage && leadsFollowDetailLeadMessage.parents) &&  leadsFollowDetailLeadMessage.parents.map(function (item) {
 //
 //    })
  //  parentListArr, //学员家长id 姓名

    return(
        <div className={styles.add_new_follow_record}>
            <div>
                {getFieldDecorator('content',{
                    rules: [
                        { max: 200, message: '限200汉字以内', },
                    ],
                })(
                    <Input type = 'textarea' autosize = {{ minRows : 3 , maxRows : 3 }} placeholder = '新建跟进记录...（必填，限200字）'/>
                )}
            </div>
            <div>
                {getFieldDecorator('parentId',{
                    initialValue : leadsFollowDetailLeadMessage.parentId || undefined
                })(
                    <Select
                        style = {{ width : 210 }}
                        placeholder = '请选择家长信息（必选）'
                        size = 'default'
                        allowClear
                        showSearch
                        optionFilterProp = "children"
                        notFoundContent = "未找到">
                        {/*{ leadsFollowDetailLeadMessage.parentId && leadsFollowDetailLeadMessage.parentName &&*/}
                          {/*leadsFollowDetailLeadMessage.parentId != null && leadsFollowDetailLeadMessage.parentId != undefined &&*/}
                          {/*leadsFollowDetailLeadMessage.parentName != null && leadsFollowDetailLeadMessage.parentName != undefined ?*/}
                            {/*<Option value = { leadsFollowDetailLeadMessage.parentId }>{ leadsFollowDetailLeadMessage.parentName + '（家长姓名）' }</Option>*/}
                            {/*:*/}
                            {/*null*/}
                        {/*}*/}

                        {/*{*/}
                            {/*parentarr && parentarr!= null &&  parentarr!= undefined  ? parentarr.map(function (item) {*/}
                                    {/*<Option value = { item.parentId }>{ item.parentName + '（家长姓名）' }</Option>*/}
                                {/*}):null*/}
                        {/*}*/}

                        {/*{*/}
                            {/*!parentarr ? null :parentarr.map(function (item) {*/}
                                    {/*<Option value = { item.parentId }>{ item.parentName + '（家长姓名）' }</Option>*/}
                                {/*})*/}
                        {/*}*/}

                        {
                            parentarr  && parentarr .map(function( item, index ){
                                return ( <Option key = { 'intention_' + item.parentId } value = { item.parentId } >{ item.parentName + '（家长姓名）'}</Option> )
                            })
                        }



                    </Select>
                )}
            </div>
            <div>
                {getFieldDecorator('type')(
                    <Select
                        style = {{ width : 200 }}
                        placeholder = '请选择跟进方式（必选）'
                        size = 'default'
                        allowClear
                        showSearch
                        optionFilterProp = "children"
                        notFoundContent = "未找到">
                        { followWay || [] }
                    </Select>
                )}
            </div>

            {/*<div>
                {getFieldDecorator('followType',{
                initialValue : leadsFollowDetailLeadMessage.saleStatus || '',

            })(
                    <Select
                        style = {{ width : 200 }}
                        placeholder = '请选择跟进状态（选填）'
                        size = 'default'
                        allowClear
                        showSearch
                        optionFilterProp = "children"
                        notFoundContent = "未找到">
                        { followState || [] }
                    </Select>
                )}
            </div>*/}
            <div>
                {getFieldDecorator('nextFollowTime')(
                    <DatePicker
                        style = {{ width : 200 }}
                        placeholder = '下次跟进时间（选填）'
                        disabledDate = { disabledDate }
                        showTime
                        format = "YYYY-MM-DD HH:mm"/>
                )}
            </div>
            <div>
                <Button type = 'primary' style={{ width : 80 }} onClick = { handleComplete } disabled = { leadsFollowFollowRecordButtonLoading } loading = { leadsFollowFollowRecordButtonLoading }>发布</Button>
            </div>
            <div></div>
        </div>
    );
}

export default Form.create()(AddFollowRecord);
