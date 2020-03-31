import React from "react"
import { Popover } from "antd"
import ManagerList from "../../common/new-component/manager-list/ManagerList"
import styles from "./TmkOwnSeaManageComponent.less"

function StuManagement({
    search,
    table,
    pagination,
    leftBars,
    rightBars,
    stuFollow,
    stuOrder,
    distributeCampus,
    unRecordNum, //待跟进人数
    recordNum, // 已跟进人数
    stuFollowStatelist, // 跟进状态
    followResultList  //跟进结果
}) {
    let columns = [
        {
            dataIndex: "operate",
            key: "operate",
            title: "操作",
            width: "150px",
            render: (text, record) => {
                let disabled = record.tmkStatus == '2'
                let name = record.tmkStatus == '2' ? '已分配' : '分配校区'
                return (
                    <div>
                        <a
                            style={{ marginRight: "10px" }}
                            onClick={() => stuFollow(record, disabled)}
                        >
                            跟进
                        </a>
                        <a
                            style={{ marginRight: "10px" }}
                            onClick={() => stuOrder(record)}
                            disabled={disabled}>
                            预约
                        </a>
                        <a
                            onClick={() => distributeCampus(record)}
                            disabled={disabled}>
                            {name}
                        </a>
                    </div>
                )
            }
        },
        {
            key: "deptName",
            dataIndex: "deptName",
            title: "城市",
            width: 96
        },
        {
            key: "orgName",
            dataIndex: "orgName",
            title: "分配校区",
            width: 120,
            render: (text, record) => (
                <Popover placement="top" content={text} trigger="hover">
                    {text}
                </Popover>
            )
        },
        {
            key: "name",
            dataIndex: "name",
            title: "姓名",
            width: 96
        },
        {
            key: "sex",
            dataIndex: "sex",
            width: 70,
            title: "性别",
            render: (text, record) => (
                <Popover placement="top" content={text == "1" ? "男" : text == "2" ? "女" : ""} trigger="hover">
                    {text == "1" ? "男" : text == "2" ? "女" : ""}
                </Popover>
            )
        },
        {
            key: "birthday",
            dataIndex: "birthday",
            title: "生日",
            width: 140,
            render: (text, record) => (
                <Popover placement="top" content={text} trigger="hover">
                    {text}
                </Popover>
            )
        },
        {
            key: "parentName",
            dataIndex: "parentName",
            title: "家长姓名",
            width: 96,
            render: (text, record) => (
                <Popover placement="top" content={text} trigger="hover">
                    {text}
                </Popover>
            )
        },
        {
            key: "parentMobile",
            dataIndex: "parentMobile",
            title: "联系方式",
            width: 110,
            render: (text, record) => {
                let mobile = record.tmkStatus == '2' && text ? text.substr(0, 3) + '****' + text.substr(-4) : text
                return (
                    <Popover placement="top" content={mobile} trigger="hover">
                        {mobile}
                    </Popover>
                )
            }
        },
        {
            key: "studentFollowState",
            dataIndex: "studentFollowState",
            title: "跟进状态",
            width: 120,
            render: (text, record) => (
                <Popover placement="top" content={
                    stuFollowStatelist && stuFollowStatelist.map(item => {
                        if(item.key == text) {
                            if(item.value) {
                                return item.value
                            }else {
                                return item.key
                            }
                        }
                    })
                } trigger="hover">
                    {
                        stuFollowStatelist && stuFollowStatelist.map(item => {
                            if(item.key == text) {
                                if(item.value) {
                                    return item.value
                                }else {
                                    return item.key
                                }
                            }
                        })
                    }
                </Popover>
            )
        },
        {
            key: "tmkFollowResult",
            dataIndex: "tmkFollowResult",
            title: "跟进结果",
            width: 140,
            render: (text, record) => (
                <Popover placement="top" content={
                    followResultList && followResultList.map(item => {
                        if(item.key == text) {
                            if(item.value) {
                                return item.value
                            }else {
                                return item.key
                            }
                        }
                    })
                } trigger="hover">
                    {
                        followResultList && followResultList.map(item => {
                            if(item.key == text) {
                                if(item.value) {
                                    return item.value
                                }else {
                                    return item.key
                                }
                            }
                        })
                    }
                </Popover>
            )

        },
        {
            key: "tmkNextFollowTime",
            dataIndex: "tmkNextFollowTime",
            title: "下次跟进时间",
            width: 160
        },
        {
            key: "signingStatus",
            dataIndex: "signingStatus",
            title: "是否签约",
            width: 96,
            render: (text, record) => (
                <Popover placement="top" content={text} trigger="hover">
                    {text == '0' ? '未签约' : text == '1' ? '签约' : ''}
                </Popover>
            )
        },
        {
            key: "signingMoney",
            dataIndex: "signingMoney",
            title: "签约金额",
            width: 96
        },
        {
            key: "channel",
            dataIndex: "channel",
            title: "来源类别",
            width: 96
        },
        {
            key: "secondChannel",
            dataIndex: "secondChannel",
            title: "市场渠道",
            width: 96
        },
        {
            key: "subSecondChannelStr",
            dataIndex: "subSecondChannelStr",
            title: "二级渠道",
            width: 96
        },
        {
            key: "lastVisitTime",
            dataIndex: "lastVisitTime",
            title: "最近一次到访时间",
            width: 140
        },
        {
            key: "allotTime",
            dataIndex: "allotTime",
            title: "分配时间",
            width: 140
        },
        {
            key: "createTime",
            dataIndex: "createTime",
            title: "创建时间",
            width: 150
        },
        {
            key: "collectName",
            dataIndex: "collectName",
            title: "收集人",
            width: 100,
            render: (text, record, index) => (
              <Popover placement="top" content={text} trigger="hover">
                {text}
              </Popover>
            )
        },
        {
            key: "remark",
            dataIndex: "remark",
            title: "备注",
            width: 150
        }
    ]

    table.columns = columns
    table.xScroll = 2000

    return (
        <div style={{ height: "100%" }}>
            <div className={styles.accountTitle}>
                <p>
                    今日待跟进总人数 : <span>{ unRecordNum || '0'}</span>人
                </p>
                <p>
                    今日已跟进总人数 : <span>{ recordNum || '0'}</span>人
                </p>
            </div>
            <ManagerList
                search={search}
                table={table}
                pagination={pagination}
                leftBars={leftBars}
                rightBars={rightBars}
            />
        </div>
    )
}

export default StuManagement
