/*
 *	口碑门店映射
 * 	门店映射
 */
import React from 'react';
import { Checkbox, Select } from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './FieldsMapComponent.less';

let Option = Select.Option;

function FieldsMapComponent ({
	sourceList, sourceTitle, targetList, targetTitle, initMapList, updateAble, maxHeight, mappingList, mappingTitle, handleChange,
}) {

    let mappingContentRenader = [];
    let targetContentRender = [];

    sourceList && sourceList.length > 0 && sourceList.map(function(sourceItem, sourceIndex) {

        let obj1 = initMapList.find(function(x) {
            return x.source == sourceItem.key;
        });

        let obj2 = mappingList.find(function(y) {
            return y.source == sourceItem.key;
        });

        let hasMapped = !updateAble && obj1; //是否可以更改初始映射的值

        let mappedTargetKey = obj1 ? obj1.target : obj2 ? obj2.target : undefined; //映射的目标对象key

        mappingContentRenader.push(
            <div className={styles.source_list_item} key={'source_list_item_' + sourceIndex}>

                <div className={styles.source_info_cont}>
                    <div className={styles.source_info_label}>{sourceItem.label}</div>
                    {!!(sourceItem.remark && sourceItem.remark.length > 0) && <div className={styles.source_info_remark}>{sourceItem.remark}</div>}
                </div>

                <div className={styles.mapping_item}>
                    <Select
                       placeholder="请选择要映射的选项"
                       showSearch
                       allowClear
                       optionFilterProp="children"
                       notFoundContent="没有可映射的选项"
                       value={mappedTargetKey}
                       onChange={(value)=>handleChange(sourceItem.key, value)}
                       disabled={hasMapped}
                       style={{width: '95%', position: 'relative', top: '18%'}}>

                        {targetList && targetList.map(function(item) {
                            let flg3 = initMapList.findIndex(function(t) {
                                return t.target == item.key;
                            });
                            let flg4 = mappingList.findIndex(function(z) {
                                return z.target == item.key;
                            });
                            let optDis = !(flg3 == -1 && flg4 == -1);
                            return (<Option key={item.key+''} value={item.key+''} disabled={optDis} >{item.label}</Option>);
                        })}
                    </Select>
                </div>
            </div>
        );
    });

    targetList && targetList.length > 0 && targetList.map(function(targetItem, targetIndex) {
        let flg1 = initMapList.findIndex(function(x) {
            return x.target == targetItem.key;
        }) == -1;

        let flg2 = mappingList.findIndex(function(y) {
            return y.target == targetItem.key;
        }) == -1;

        if(flg1 && flg2) {
            targetContentRender.push(
                <div className={styles.target_list_item} key={'target_list_item' + targetIndex}>
                    <div className={styles.target_info_label}>{targetItem.label}</div>
                    {!!(targetItem.remark && targetItem.remark.length > 0) &&
                    <div className={styles.target_info_remark}>{targetItem.remark}</div>}
                </div>
            );
        }
    });

	return (
		<div className={styles.fields_map_cont}>

		    <div className={styles.mapping_cont}>
                <div className={styles.title_cont}>
                    <div className={styles.source_title}>{sourceTitle}</div>
                    <div className={styles.mapping_title}>{mappingTitle}</div>
                </div>
                <div className={styles.mapping_content_cont}>
                    <div className={styles.mapping_content} style={maxHeight!=undefined ? {maxHeight} : {} }>
                        {mappingContentRenader}
                    </div>
                </div>
		    </div>

		    <div className={styles.target_list_cont}>
                <div className={styles.target_title}>{targetTitle}</div>
                <div className={styles.target_list_content_cont}>
                    <div className={styles.target_list_content} style={maxHeight!=undefined ? {maxHeight} : {} }>
                        <QueueAnim type="left" key="target_list_content_anim">
                        {targetContentRender}
                        </QueueAnim>
                    </div>
                </div>
		    </div>
		</div>
	)
}

export default FieldsMapComponent;
