import { ProColumns } from "@ant-design/pro-components";
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
        title: '类型',
        dataIndex: 'type',
        //search: false,
        fixed: 'left',
        width: 100,
        valueEnum: {
            0: { text: '非目标视频' },
            1: {
                text: '目标视频',
                status: 'Success',
            },
        },
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
        title: '任务',
        dataIndex: 'task_name',
        ellipsis: true,
        copyable: true,
        width: 160,
        search: false,
        render: (val) => {
            if (!val) {
                return '-';
            }
            return val;
        }
    },
    {
        title: '标题',
        dataIndex: 'title',
        ellipsis: true,
        copyable: true,
        width: 320,
        render: (val) => {
            if (!val) {
                return '-';
            }
            return val;
        }
    },
    {
        title: '抖音昵称',
        dataIndex: 'nickname',
        ellipsis: true,
        width: 120,
        copyable: true,
        renderText: (val: string) => {
            if (val) {
                return val;
            }
            return '-';
        },
    },
    {
        title: '抖音账号',
        dataIndex: 'douyin',
        width: 120,
        renderText: (val: string) => {
            if (val) {
                return val;
            }
            return '-';
        },
    },
    {
        title: '匹配关键词',
        dataIndex: 'keyword',
        search: false,
        //copyable: true,
        ellipsis: true,
        render: (text) => {
            if (!text) {
                return '-';
            }
            return text;
        }
    },
    {
        title: '不匹配关键词',
        dataIndex: 'no_keyword',
        search: false,
        //copyable: true,
        ellipsis: true,
        render: (text) => {
            if (!text) {
                return '-';
            }
            return text;
        }
    },
    {
        title: '点赞数',
        dataIndex: 'zan_count',
        search: false,
        render: (text) => {
            if (text > 10000) {
                return (text / 10000).toFixed(2) + 'w';
            }
            return text;
        }
    },
    {
        title: '评论数',
        dataIndex: 'comment_count',
        search: false,
        render: (text) => {
            if (text > 10000) {
                return (text / 10000).toFixed(2) + 'w';
            }
            return text;
        }
    },
    {
        title: '收藏数',
        dataIndex: 'collect_count',
        search: false,
        render: (text) => {
            if (text > 10000) {
                return (text / 10000).toFixed(2) + 'w';
            }
            return text;
        }
    },
    {
        title: '所属代理商',
        dataIndex: 'agent_id',
        search: false,
        render: (val, record) => {
            return record.agent_name;
        }
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
