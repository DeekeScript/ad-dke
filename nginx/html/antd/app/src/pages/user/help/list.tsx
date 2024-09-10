import { ProColumns } from "@ant-design/pro-components";
import moment from "moment";

export const columns: ProColumns<any>[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        search: false,
    },
    {
        title: '用户名称',
        dataIndex: 'name',
    },
    {
        title: '手机号',
        dataIndex: 'mobile',
        renderText: (val: string) => `${val}`,
    },
    {
        title: '时长',
        dataIndex: 'type',
        search: false,
        valueEnum: {
            0: { text: '1年' },
            1: {
                text: '1月',
            },
            2: {
                text: '3天',
            },
            3: {
                text: '3月',
            },
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        search: false,
        valueEnum: {
            0: { text: '未启用' },
            1: {
                text: '已启用',
            },
        },
    },
    {
        title: '类型',
        dataIndex: 'role_type',
        search: false,
        valueEnum: {
            0: { text: '管理员' },
            1: {
                text: '代理商',
            },
            2: {
                text: '商户',
            },
        },
    },
    {
        title: '机器数量',
        dataIndex: 'machine_name',
        search: false,
        render: (text, record) => {
            return record.machine_id?.length || 0;
        }
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        valueType: 'dateTime',
        search: false,
        render: (text) => {
            return moment(text.props.text * 1000).format("YYYY-MM-DD HH:mm:ss");
        }
    },
];
