/*
 * 一对一映射绑定组件
 * sourceList array 映射的源数据  必填  [{key,label,remark}]
 * sourceTitle string 映射的源数据标题  默认值: '源数据'
 * targetList array 映射的目标数据 必填 [{key,label,remark}]
 * targetTitle string 映射的目标数据标题 默认值: '目标数据'
 *
 * initMapList array  初始的映射关系  可选 [{source, target}]
 * updateAble   boolean 是否可更改初始的映射关系  默认false
 *
 * mappingTitle string 映射关系的标题 默认值: '映射数据'
 * onChange function 映射关系改变时调用    function(mappingList) {}
 *
 * maxHeight string 绑定区域的最大高度
 */

import React from 'react';
import FieldsMapComponent from '../../../components/common/fields-map/FieldsMapComponent';

class FieldsMap extends React.Component {

    constructor(props) {
      super(props);
      let updateAble = props.updateAble || false;
      let initMapList = props.initMapList || [];
      this.state = {
        mappingList: updateAble ? initMapList : [],//新增的绑定关联关系
      };
        // ES6 类中函数必须手动绑定
      this.handleMappingChange = this.handleMappingChange.bind(this);
    }

    handleMappingChange(source, target) {

        this.setState((prevState, props) => {
          let mappingList = prevState.mappingList;

           let obj = mappingList.find(function(x) {
               return x.source == source;
           });

            if(obj) {
                obj.target = target;
            } else {
                mappingList.push({source, target});
            }
            this.props.onChange && this.props.onChange(mappingList);
          return {mappingList};
        });
    }

    render() {

        let {sourceList, sourceTitle, targetList, targetTitle, initMapList, updateAble, mappingTitle, maxHeight, } = this.props;
        let {mappingList} = this.state;

        let componProps = {
            sourceList, sourceTitle: sourceTitle||'源数据',
            targetList, targetTitle: targetTitle||'未配对目标数据',
            initMapList: initMapList||[], updateAble: updateAble||false, maxHeight,
            mappingTitle: mappingTitle||'配对数据', mappingList: mappingList||[],
            handleChange: this.handleMappingChange,
        };

        return (
            <FieldsMapComponent {...componProps} />
        );
    }
}


export default FieldsMap;
