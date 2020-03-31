import React from 'react';
import { Checkbox , Input , Button , Spin , Popconfirm } from 'antd';
import { NullData , BlockTitle } from '../../../common/new-component/NewComponent';
import RenderGroup from './RenderGroup.json';
import QueueAnim from 'rc-queue-anim';
import styles from './AttendancePrintPreview.less';
const CheckboxGroup = Checkbox.Group;

/*考勤小票预览*/
function AttendancePrintPreview({
    loading,                    //是否加载状态
    checkOptions,               //可以选择的checkbox
    initCheckedBox,             //初始选中的数组
    initTicketBottomContent,    //初始小票底部内容
    ticketBottomContent,        //小票底部内容

    CheckBoxOnChange,           //checkbox的onChange事件
    InputContentOnChange,       //textarea的onChange事件
    SaveSmallTicketReSet,       //还原默认选项
    SaveSmallTicketSet,         //保存选项
}) {

    let renderGroup = [];
    if(initCheckedBox && initCheckedBox.length > 0){
        renderGroup = RenderGroup.map((item,index) => {
            let i = initCheckedBox.indexOf(item.key);
            if(i > -1 && item.key == 'orgName'){
                return ( <div className = { styles.small_ticket_preview_content_orgName } key = { item.key }>{ item.value }</div> )
            }else if(i > -1 && item.key == 'recBottom'){
                return ( <div className = { styles.small_ticket_preview_content_recBottom } key = { item.key }>
                            <pre style = {{ width : 260 , wordWrap : 'break-word' }}>{ ticketBottomContent }</pre>
                         </div> )
            }else if(i > -1){
                return ( <div className = { styles.small_ticket_preview_content_common } key = { item.key }>{ item.value }</div> )
            }
        })
    }

    return(
        <Spin spinning={loading}>
            <div className={styles.small_ticket_all_content}>
                <div className={styles.small_ticket_preview}>
                    <BlockTitle content = '小票预览（示例）'/>
                    { initCheckedBox && initCheckedBox.length > 0 ?
                        <QueueAnim
                            className={styles.small_ticket_preview_content}
                            type={['right', 'right']}
                            ease={['easeOutQuart', 'easeInOutQuart']}>
                            { renderGroup || [] }
                        </QueueAnim>
                        :
                        <NullData height = '350px' width = '300px' content = '小票无内容'/>
                    }
                </div>
                <div className={styles.small_ticket_set}>
                    <BlockTitle content = '请勾选需要打印的信息'/>
                    <div className='small_ticket_set_checkbox'>
                        <CheckboxGroup options={checkOptions} onChange={CheckBoxOnChange} value={initCheckedBox}/>
                    </div>
                    <Input
                        type = 'textarea'
                        autosize = {{ minRows: 4, maxRows: 4 }}
                        className = { styles.small_ticket_set_textarea }
                        disabled = { initCheckedBox.indexOf('recBottom') > -1 ? false : true }
                        value = { ticketBottomContent }
                        onChange = { InputContentOnChange }/>
                    <div className={styles.small_ticket_set_button}>
                        <Popconfirm placement="topLeft" title='确定还原默认？' onConfirm={SaveSmallTicketReSet} okText="确定" cancelText="取消">
                            <Button type = 'ghost' className={styles.small_ticket_set_button_item}>还原默认并保存</Button>
                        </Popconfirm>
                        <Button type = 'primary' className={styles.small_ticket_set_button_item} onClick={SaveSmallTicketSet}>保存</Button>
                    </div>
                </div>
            </div>
        </Spin>
    );
}

export default AttendancePrintPreview;
