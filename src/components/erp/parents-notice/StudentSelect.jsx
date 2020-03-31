import React from 'react';
import {Modal,Select,Input,Button,Checkbox,Form,Spin,message,} from 'antd';
import TenantOrgFilter from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import styles from './StudentSelect.less';
const Option = Select.Option;

/*
 * selectStudents 选中的学员
 * onChange 选中学员变化时
 * onClose 关闭学员选择窗口
 * dataSource 班级列表及班级下学员列表
 * onSearch 检索学员
 */
function StudentSelectComponent ({
    visible, loading, selectStuIds, selectStudents, courseComList,employeeComList, onClose, onSearch, dataSource, onChangeStuSelect,onRemoveStu, onRemoveAll,
    form: {
        getFieldDecorator,
        getFieldValue,
        getFieldsValue,
        setFieldsValue,
        validateFields,
        resetFields,
        validateFieldsAndScroll,
    }
}) {

    function onCloseClick() {
        resetFields();
        onClose && onClose();
    }

    /*点击搜索学员*/
    function onSearchClick() {
        let organId = getFieldValue('organId');
        if(organId == undefined || organId == '') {
            message.warn('请先选择门店');
            return;
        }
        onSearch && onSearch(getFieldsValue());
    }

    /*点击搜索学员*/
    function onResetClick() {
        resetFields();
    }

    /*待选的学员区域*/
    let class_stus_item_list = [];
    dataSource && dataSource.length > 0 && dataSource.map(function(dataItem, dataIndex) {

        let class_stu_item_list = [];
        let stuList = dataItem.stuList;

        stuList && stuList.length > 0 && stuList.map(function(stuItem, stuIndex) {
            let hasSelect = selectStuIds.includes(stuItem.stuId);
            class_stu_item_list.push(
                <div className={styles.class_stu_item} key={'class_stu_item_' + stuIndex}>
                    <Checkbox checked={hasSelect} onChange={(e)=>onChangeStuSelect(e,'stu', dataItem.classId, stuItem.stuId, stuItem.stuName)}>{stuItem.stuName}</Checkbox>
                </div>
            );
        });

        class_stus_item_list.push(
            <div className={styles.class_stus_item} key={'class_stus_item_' + dataIndex}>
                <div className={styles.class_select}>
                    <Checkbox checked={dataItem.select == 'all'} indeterminate={dataItem.select == 'half'} onChange={(e)=>onChangeStuSelect(e,'class', dataItem.classId)}>{dataItem.className}</Checkbox>
                </div>
                <div className={styles.class_stus_cont}>
                    {class_stu_item_list}
                </div>
            </div>
        );

    });

    return (
        <Modal
            title={null}
            visible={visible}
            maskClosable={false}
            closable={false}
            okText="确认名单"
            onOk={onCloseClick}
            cancelText="清除已选"
            onCancel={onRemoveAll}
            width={675}
            className={styles.students_select_modal}
        >
            <div className={styles.students_select_cont}>
                <Form>
                <div className={styles.selecting_cont}>
                    <div className={styles.org_select_cont}>
                       {getFieldDecorator('organId',{
                            rules: [{
                              required: true, message: '请选择门店',
                            }],
                        })(
                        <TenantOrgFilter />
                       )}
                    </div>

                    <div className={styles.select_filter_cont}>
                        <div className={styles.select_filter_item}>
                           {getFieldDecorator('courseId')(
                            <Select
                               placeholder="请选择课程"
                               allowClear
                               style={{width: 200}}>
                                {courseComList && courseComList.map(function(item) {
                                    return (<Option key={'select_opt_' + item.id} value={item.id+''}>{item.title}</Option>);
                                })}
                            </Select>
                            )}
                        </div>

                        <div className={styles.select_filter_item}>
                           {getFieldDecorator('teacherId')(
                            <Select
                               placeholder="请选择老师"
                               allowClear
                               style={{width: 200}}>
                                {employeeComList && employeeComList.map(function(item) {
                                    return (<Option key={'select_opt_' + item.userId} value={item.userId+''}>{item.userName}</Option>);
                                })}
                            </Select>
                            )}
                        </div>

                        <div className={styles.select_filter_item}>
                           {getFieldDecorator('className')(
                            <Input placeholder="请输入班级名称" style={{width: 120}} />
                            )}
                        </div>

                        <div className={styles.select_filter_item}>
                           {getFieldDecorator('stuName')(
                            <Input placeholder="请输入学员名称" style={{width: 120}} />
                            )}
                        </div>

                        <div className={styles.select_filter_item}>
                           <div className={styles.select_search_btns}>
                               <Button type="primary" className={styles.search_btn_item} onClick={()=>onSearchClick()}>搜索</Button>
                                <Button type="ghost"   className={styles.search_btn_clear} onClick={()=>onResetClick()}>清除条件</Button>
                           </div>
                        </div>
                    </div>

                    <div className={styles.show_students_cont}>
                        <div className={styles.add_all_btn}>添加搜索结果列表的所有学员</div>

                        <Spin tip="学员加载中..." spinning={loading}>
                            <div className={styles.show_class_stus}>
                                {class_stus_item_list}
                            </div>
                        </Spin>
                    </div>

                </div>
                </Form>

                <div className={styles.selected_cont}>
                    <div className={styles.selected_cont_title}>
                        已选学员({selectStudents.length}人)
                    </div>

                    <div className={styles.selected_cont_content}>

                       {selectStudents && selectStudents.map(function(item, index) {
                            return (
                                <div className={styles.selected_cont_item} key={'selected_cont_item_'+index}>
                                    <span className={styles.selected_item_label} title={item.stuName}>{item.stuName}</span>
                                    <span className={styles.remove_item} onClick={()=>onRemoveStu(item.stuId, item.stuName)}></span>
                                </div>
                            );
                        })}

                    </div>
                </div>
            </div>
        </Modal>
    );
}
export default Form.create()(StudentSelectComponent);
