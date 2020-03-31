import React from 'react';
import Media from 'react-media';
import { Popover , Icon , Table } from 'antd';
import { NullData , ProgressBar } from '../../../common/new-component/NewComponent';
import styles from './SalesAchievementTable.less';

/*销售业绩表*/
function TeacherTeachingTable({
    tableLoading,                   //列表加载状态
    topAllData,                     //总计列表数据
    tableDataSource,                //列表数据
    tableTotal,                     //列表条数
    tablePageIndex,                 //列表页码
    tablePageSize,                  //列表每页条数
    TablePageOnChange,              //分页改变
}) {

    // 合同金额提示 1新签 2续费
    const contractMoney = (type) => {
        let text = type == '1' ? '新签' : '续费'
        return (
            <Popover content={`${text}合同的签订时间在选择时间段内则计算合同金额`}>
                合同金额<a><Icon type="question-circle-o" className={styles.tip_icon} /></a>
            </Popover>
        )
    }

    // 业绩金额提示
    const achievementTitle = (title) => (
        <div>
            <Popover content={
                <div>
                    <p>业绩金额：查询时间段内，退费前业绩金额 — 退费金额</p>
                    <p className={styles.pop_con}>注：退费前业绩金额计算条件：合同审核通过&全额付款完成&付款审核通过。退费前业绩计算时间按合同审核通过时间为筛选点，例如8月生成一合同在10月完成全额付款且审核通过，则该业绩算在8月份。退费金额为查询时间段内合同退费金额，以退费审核通过时间作为退费计算时间；该退费包括部分退费；该退费包括在选择时段外生成的合同在选择时段内的进行退费的金额（举例：8月份合同金额为1000元，8月份合同产生退费200元，6月份完成的合同在8月退费100元，则查询8月份该销售的业绩金额为1000-200-100=700元）</p>
                </div>}
            >
                {title}<a><Icon type="question-circle-o" className={styles.tip_icon} /></a>
            </Popover>
        </div>
    )

    // 业绩占比金额
    const achievementProTitle = (title) => (
        <div>
            <Popover content={
                <div>
                    <p style={{ maxWidth: 400 }}>业绩金额 = 合计（退费前业绩合同金额 X 退费前业绩合同对应销售占比） — 合计（退费合同金额 X 对应退费合同对应销售占比）</p>
                    <p className={styles.pop_con}>注：退费前业绩金额计算条件：合同审核通过&全额付款完成&付款审核通过。退费前业绩计算时间按合同审核通过时间为筛选点，例如8月生成一合同在10月完成全额付款且审核通过，则该业绩算在8月份。退费金额为查询时间段内合同退费金额，以退费审核通过时间作为退费计算时间；该退费包括部分退费；该退费包括在选择时段外生成的合同在选择时段内的进行退费的金额（举例：8月份合同金额为1000元，8月份合同产生退费200元，6月份完成的合同在8月退费100元，则查询8月份该销售的业绩金额为1000-200-100=700元）</p>
                </div>}
            >
                {title}<a><Icon type="question-circle-o" className={styles.tip_icon} /></a>
            </Popover>
        </div>
    )

    // 占比金额提示 1新签 2续费
    const rateMoney = (type) => {
        let text = type == '1' ? '新签' : '续费'
        return (
            <Popover content={`该销售在${text}合同金额中的占比`}>
                占比金额<a><Icon type="question-circle-o" className={styles.tip_icon} /></a>
            </Popover>
        )
    }

    const columnAll = window._init_data.language && window._init_data.language == 'dsf' ? [{
        width:60,
        title:'统计类型',
        dataIndex:'all',
        key:'all'
    }, {
        title: '新学员合同数',
        dataIndex: 'newPurNum',
        key: 'newPurNum',
        width: 80,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    },{
        title: '新学员合同金额',
        dataIndex: 'newPurMoney',
        key: 'newPurMoney',
        width: 80,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    },{
        title: '新学员业绩金额',
        dataIndex: 'newDicmoneyMoney',
        key: 'newDicmoneyMoney',
        width: 80,
        render : (text,record) => (
            <Popover placement="top" content={text || '0'} trigger="hover">
                { text || '0' }
            </Popover>
        )
    },{
        title: '老学员合同数',
        dataIndex: 'renewPurNum',
        key: 'renewPurNum',
        width: 80,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    },{
        title: '老学员合同金额',
        dataIndex: 'renewPurMoney',
        key: 'renewPurMoney',
        width: 80,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    },{
        title: '老学员业绩金额',
        dataIndex: 'renewDicmoneyMoney',
        key: 'renewDicmoneyMoney',
        width: 80,
        render : (text,record) => (
            <Popover placement="top" content={text || '0'} trigger="hover">
                { text || '0' }
            </Popover>
        )
    },{
        title: '总合同数',
        dataIndex: 'totalPurNum',
        key: 'totalPurNum',
        width: 80,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    },{
        title: '总合同金额',
        dataIndex: 'totalPurMoney',
        key: 'totalPurMoney',
        width: 80,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    },{
        title: '总业绩金额',
        dataIndex: 'totalDicmoneyMoney',
        key: 'totalDicmoneyMoney',
        width: 80,
        render : (text,record) => (
            <Popover placement="top" content={text || '0'} trigger="hover">
                { text || '0' }
            </Popover>
        )
    },{
        title: '转入/转出合同数',
        dataIndex: 'tranSchInNum',
        key: 'tranSchInNum',
        width: 80,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                <span>{ record.tranSchInNum +'/' + record.tranSchOutNum }</span>
            </Popover>
        )
    },{
        title: '转入/转出合同金额',
        dataIndex: 'tranSchOutMoney',
        key: 'tranSchOutMoney',
        width: 80,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                <span>{ record.tranSchInMoney +'/' + record.tranSchOutMoney }</span>
            </Popover>
        )
    }] : [{
        width:60,
        title:'统计类型',
        dataIndex:'all',
        key:'all'
    }, {
        title: '新学员合同数',
        dataIndex: 'newPurNum',
        key: 'newPurNum',
        width: 80,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    },{
        title: '新学员合同金额',
        dataIndex: 'newPurMoney',
        key: 'newPurMoney',
        width: 80,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    },{
        title: '老学员合同数',
        dataIndex: 'renewPurNum',
        key: 'renewPurNum',
        width: 80,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    },{
        title: '老学员合同金额',
        dataIndex: 'renewPurMoney',
        key: 'renewPurMoney',
        width: 80,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    },{
        title: '总合同数',
        dataIndex: 'totalPurNum',
        key: 'totalPurNum',
        width: 80,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    },{
        title: '总合同金额',
        dataIndex: 'totalPurMoney',
        key: 'totalPurMoney',
        width: 80,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    },{
        title: '转入/转出合同数',
        dataIndex: 'tranSchInNum',
        key: 'tranSchInNum',
        width: 80,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                <span>{ record.tranSchInNum +'/' + record.tranSchOutNum }</span>
            </Popover>
        )
    },{
        title: '转入/转出合同金额',
        dataIndex: 'tranSchOutMoney',
        key: 'tranSchOutMoney',
        width: 80,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                <span>{ record.tranSchInMoney +'/' + record.tranSchOutMoney }</span>
            </Popover>
        )
    }];

    const columnDetail = window._init_data.language && window._init_data.language == 'dsf' ? [{
            width: 120,
            title: '排名',
            dataIndex: 'NO',
            key: 'NO',
            render : (text,record,index) => (
                <Popover placement="top" content={tablePageIndex * tablePageSize + index + 1} trigger="hover">
                    { tablePageIndex * tablePageSize + index + 1 }
                </Popover>
            )
        },{
            width: 120,
            title: '姓名',
            dataIndex: 'userName',
            key: 'userName',
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        }, {
            title: '新签合同（包含转介绍）',
            width: 240,
            key: 'new',
			children: [{
                title: '新学员合同数',
                dataIndex: 'newPurchaseNum',
                key: 'newPurchaseNum',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            },{
                title: contractMoney('1'),
                dataIndex: 'newPurchaseMoney',
                key: 'newPurchaseMoney',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            },{
                title: achievementTitle('业绩金额'),
                dataIndex: 'newDicmoneyMoney',
                key: 'newDicmoneyMoney',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            },{
                title: achievementProTitle('业绩占比金额'),
                dataIndex: 'newProDictMoney',
                key: 'newProDictMoney',
                width: 100,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            },{
                title: rateMoney('1'),
                dataIndex: 'newProportionMoney',
                key: 'newProportionMoney',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            }]
        }, {
            title: '续费合同',
            width: 240,
            key: 'renew',
			children: [{
                title: '老学员合同数',
                dataIndex: 'renewPurchaseNum',
                key: 'renewPurchaseNum',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            },{
                title: contractMoney('2'),
                dataIndex: 'renewPurchaseMoney',
                key: 'renewPurchaseMoney',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            },{
                title: achievementTitle('业绩金额'),
                dataIndex: 'renewDicmoneyMoney',
                key: 'renewDicmoneyMoney',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            },{
                title: achievementProTitle('业绩占比金额'),
                dataIndex: 'oldProDicMoney',
                key: 'oldProDicMoney',
                width: 100,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            },{
                title: rateMoney('2'),
                dataIndex: 'renewProportionMoney',
                key: 'renewProportionMoney',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            }]
        }, {
            title: '合计',
            width: 240,
            key: 'all',
			children: [{
                title: '合同合计数',
                dataIndex: 'totalNum',
                key: 'totalNum',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            },{
                title: '合同合计金额',
                dataIndex: 'totalMoney',
                key: 'totalMoney',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            },{
                title: '业绩合计金额',
                dataIndex: 'totalDicmoneyMoney',
                key: 'totalDicmoneyMoney',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            },{
                title: '业绩占比合计金额',
                dataIndex: 'totalProDicmony',
                key: 'totalProDicmony',
                width: 100,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            },{
                title: '占比合计金额',
                dataIndex: 'totalProportionMoney',
                key: 'totalProportionMoney',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            }]
        },{
            width: 120,
            title: '校区',
            dataIndex: 'orgName',
            key: 'orgName',
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        }] : [{
            width: 120,
            title: '排名',
            dataIndex: 'NO',
            key: 'NO',
            render : (text,record,index) => (
                <Popover placement="top" content={tablePageIndex * tablePageSize + index + 1} trigger="hover">
                    { tablePageIndex * tablePageSize + index + 1 }
                </Popover>
            )
        },{
            width: 120,
            title: '姓名',
            dataIndex: 'userName',
            key: 'userName',
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        }, {
            title: '新签合同（包含转介绍）',
            width: 240,
            key: 'new',
			children: [{
                title: '新学员合同数',
                dataIndex: 'newPurchaseNum',
                key: 'newPurchaseNum',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            },{
                title: contractMoney('1'),
                dataIndex: 'newPurchaseMoney',
                key: 'newPurchaseMoney',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            },{
                title: rateMoney('1'),
                dataIndex: 'newProportionMoney',
                key: 'newProportionMoney',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            }]
        }, {
            title: '续费合同',
            width: 240,
            key: 'renew',
			children: [{
                title: '老学员合同数',
                dataIndex: 'renewPurchaseNum',
                key: 'renewPurchaseNum',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            },{
                title: contractMoney('2'),
                dataIndex: 'renewPurchaseMoney',
                key: 'renewPurchaseMoney',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            },{
                title: rateMoney('2'),
                dataIndex: 'renewProportionMoney',
                key: 'renewProportionMoney',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            }]
        }, {
            title: '合计',
            width: 240,
            key: 'all',
			children: [{
                title: '合同合计数',
                dataIndex: 'totalNum',
                key: 'totalNum',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            },{
                title: '合同合计金额',
                dataIndex: 'totalMoney',
                key: 'totalMoney',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            },{
                title: '占比合计金额',
                dataIndex: 'totalProportionMoney',
                key: 'totalProportionMoney',
                width: 80,
                render : (text,record) => (
                    <Popover placement="top" content={text} trigger="hover">
                        { text }
                    </Popover>
                )
            }]
        },{
            width: 120,
            title: '校区',
            dataIndex: 'orgName',
            key: 'orgName',
            render : (text,record) => (
                <Popover placement="top" content={text} trigger="hover">
                    { text }
                </Popover>
            )
        }];

    let paginationProps = {
        total : tableTotal,
        current : !isNaN(tablePageIndex) ? (tablePageIndex + 1) : 1,
        pageSize : tablePageSize,
        showQuickJumper : true,
        showTotal(){
            return '总共'+this.total+'条数据';
        }
    }

    return(
        <Media query="(max-width: 1350px)">
            { matches => matches ?
                <div className = {styles.allTable_s}>
                    <div className = 'zj_sales_achieve_table_common' style={{ padding : '0 20px' }}>
                        <Table
                            columns = {columnAll}
                            dataSource = { !!tableLoading ? [] : topAllData }
                            pagination = {false}
                            bordered
                            rowKey = "all"
                            locale = {{ emptyText : !!tableLoading ? <ProgressBar content = '统计中' height = '100px'/> : <NullData content = '暂时没有数据' height = { 100 }/> }}
                            scroll={{ x : 1200 }} />
                    </div>
                    <div className = 'zj_sales_achieve_table_common zj_sales_achieve_table' style={{ padding : 20 }}>
                        <Table
                            columns = { columnDetail }
                            dataSource = { !!tableLoading ? [] : tableDataSource }
                            pagination = { paginationProps }
                            onChange = { TablePageOnChange }
                            bordered
                            rowKey = "userId"
                            locale = {{ emptyText : !!tableLoading ? <ProgressBar content = '统计中' height = '300px'/> : <NullData content = '暂时没有数据' height = { 300 }/> }}
                            scroll={{ x : 1200 }} />
                    </div>
                </div>
                :
                <div className = {styles.allTable_l}>
                    <div className = 'zj_sales_achieve_table_common' style={{ padding : '0 20px' }}>
                        <Table
                            columns = { columnAll }
                            dataSource = { !!tableLoading ? [] : topAllData }
                            pagination = { false }
                            bordered
                            rowKey = "all"
                            locale = {{ emptyText : !!tableLoading ? <ProgressBar content = '统计中' height = '100px'/> : <NullData content = '暂时没有数据' height = { 100 }/> }}
                            scroll = {{ x : 1200 }} />
                    </div>
                    <div className = 'zj_sales_achieve_table_common zj_sales_achieve_table' style={{ padding : 20 }}>
                        <Table
                            columns = { columnDetail }
                            dataSource = { !!tableLoading ? [] : tableDataSource }
                            pagination = { paginationProps }
                            onChange = { TablePageOnChange }
                            bordered
                            rowKey = "userId"
                            locale = {{ emptyText : !!tableLoading ? <ProgressBar content = '统计中' height = '300px'/> : <NullData content = '暂时没有数据' height = { 300 }/> }}
                            scroll = {{ x : 1200 }} />
                    </div>
                </div>
            }
        </Media>
    );
}

//export default SalesAchievementTable;
export default TeacherTeachingTable;
