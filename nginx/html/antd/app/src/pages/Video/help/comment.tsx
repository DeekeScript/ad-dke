import { ProColumns } from "@ant-design/pro-components";
import { Tag } from "antd";
import moment from "moment";

export const columns: ProColumns<any>[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        search: false,
        fixed: 'left',
        width: 120,
    },
    {
        title: '设备ID',
        dataIndex: 'machine_id',
        width: 120,
        //search: false,
        render: (val) => {
            if (!val) {
                return '-';
            }
            return val;
        }
    },
    {
        title: 'IP',
        dataIndex: 'province_name',
        search: false,
        render: (val: string) => {
            if (val) {
                return val;
            }
            return '-';
        },
    },
    {
        title: '昵称',
        search: false,
        tip: '评论人的抖音昵称',
        dataIndex: 'nickname',
        render: (val: string) => {
            if (val) {
                return val;
            }
            return '-';
        },
    },
    {
        title: '抖音号',
        search: false,
        dataIndex: 'douyin',
        tip: '评论人的抖音账号',
        render: (val: string) => {
            if (val) {
                return val;
            }
            return '-';
        },
    },
    {
        title: '评论内容',
        search: false,
        dataIndex: 'desc',
        ellipsis: true,
        copyable: true,
        width: 160,
        tip: '别人评论当前视频的内容',
        render: (val: string) => {
            if (val) {
                return val;
            }
            return '-';
        },
    },
    {
        title: '操作内容',
        dataIndex: 'id',
        search: false,
        render: (text, record) => {
            return <div>
                {record.is_zan ? <Tag>点赞</Tag> : undefined}
                {record.is_focus ? <Tag>关注</Tag> : undefined}
                {record.is_private_msg ? <Tag>私信</Tag> : undefined}
                {record.is_comment ? <Tag>评论</Tag> : undefined}
            </div>
        }
    },
    {
        title: '回复内容',
        tip: '你回复该评论的内容',
        ellipsis: true,
        copyable: true,
        width: 160,
        dataIndex: 'comment_msg',
        search: false,
        render: (val: string) => {
            if (val) {
                return val;
            }
            return '-';
        },
    },
    {
        title: '私信内容',
        dataIndex: 'private_msg',
        search: false,
        ellipsis: true,
        copyable: true,
        width: 160,
        render: (val: string) => {
            if (val) {
                return val;
            }
            return '-';
        },
    },
    {
        title: '评论时间',
        tooltip: '用户评论视频时的时间',
        dataIndex: 'in_time',
        search: false,
        width: 180,
        render: (val: string, record: string) => {
            if (!val) {
                return '-';
            }
            return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
            // val = record.created_at - val;
            // let minute = Math.ceil(val / 60);
            // if (minute < 60) {
            //     return minute + '分钟';
            // }
            // let hour = Math.ceil(minute / 60);
            // if (hour < 24) {
            //     return hour + '小时';
            // }

            // let day = Math.ceil(hour / 24);
            // if (day < 30) {
            //     return day + '天';
            // }

            // let month = Math.round(day / 30);
            // return month + '月';
        },
    },
    {
        title: '视频标题',
        dataIndex: 'title',
        ellipsis: true,
        copyable: true,
        width: 240,
        search: false,
        render: (val) => {
            if (!val) {
                return '-';
            }
            return val;
        }
    },
    {
        title: '匹配内容',
        dataIndex: 'keyword',
        ellipsis: true,
        copyable: true,
        width: 160,
        search: false,
        render: (val: string) => {
            if (val) {
                return val;
            }
            return '-';
        },
    },
    {
        title: '不匹配内容',
        ellipsis: true,
        copyable: true,
        width: 160,
        dataIndex: 'no_keyword',
        search: false,
        render: (val: string) => {
            if (val) {
                return val;
            }
            return '-';
        },
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        valueType: 'dateTimeRange',
        width: 180,
        search: {
            transform: (value) => {
                return {
                    startTime: value[0],
                    endTime: value[1],
                };
            },
        },
        render: (text) => {
            return moment(text.props.text * 1000).format("YYYY-MM-DD HH:mm:ss");
        }
    },
];
