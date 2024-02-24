import { ProColumns } from "@ant-design/pro-components";
import moment from "moment";

export const columns: ProColumns<any>[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        search: false,
        fixed: 'left',
        width: '120px',
    },
    {
        title: '关键词',
        dataIndex: 'keyword',
        search: false,
        fixed: 'left',
    },
    {
        title: '手机号',
        dataIndex: 'mobile',
        fixed: 'left',
        width: '120px',
    },
    {
        title: '微信号',
        dataIndex: 'wx',
        fixed: 'left',
        width: '120px',
    },
    {
        title: '抖音号',
        dataIndex: 'account',
        width: '120px',
    },
    {
        title: '抖音昵称',
        dataIndex: 'nickname',
        search: false,
    },
    {
        title: '性别',
        dataIndex: 'gender',
        search: false,
        valueEnum: {
            1: {
                text: '男',
                status: 'Processing',
            },
            2: { text: '女', status: 'Success', },
            3: {
                text: '-',
            },
        },
    },
    {
        title: '年龄',
        dataIndex: 'age',
        search: false,
        render(v) {
            if (!v) {
                return '-';
            }
            return v;
        }
    },
    {
        title: 'IP',
        dataIndex: 'ip',
        search: false,
    },
    {
        title: '点赞数',
        dataIndex: 'zan_count',
        search: false,
    },
    {
        title: '关注数',
        dataIndex: 'focus_count',
        search: false,
    },
    {
        title: '粉丝数',
        dataIndex: 'fans_count',
        search: false,
    },
    {
        title: '作品数',
        dataIndex: 'work_count',
        search: false,
    },
    {
        title: '设备ID',
        dataIndex: 'machine_id',
        search: false,
    },
    {
        title: '简介',
        dataIndex: 'desc',
        copyable: true,
        width: 200,
        ellipsis: true,
        search: false,
    },
    {
        title: '微信状态',
        dataIndex: 'wx_status',
        search: false,
        valueEnum: {
            0: { text: '待添加' },
            1: {
                text: '添加失败',
                status: 'Error',
            },
            2: {
                text: '已完成',
                status: 'Success',
            },
        },
    },
    {
        title: '企微状态',
        dataIndex: 'qw_status',
        search: false,
        valueEnum: {
            0: { text: '待添加' },
            1: {
                text: '添加失败',
                status: 'Error',
            },
            2: {
                text: '已完成',
                status: 'Success',
            },
        },
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        valueType: 'dateTime',
        width: 180,
        search: false,
        render: (text) => {
            return moment(text.props.text * 1000).format("YYYY-MM-DD HH:mm:ss");
        }
    },
];
