import { ProColumns } from "@ant-design/pro-components";
import moment from "moment";

export const columns: ProColumns<any>[] = [
    {
        title: '设备ID',
        dataIndex: 'id',
    },
    {
        title: '名称',
        dataIndex: 'name',
    },
    {
        title: '类型',
        dataIndex: 'type',
        search: false,
        valueEnum: {
            0: { text: '-' },
            1: {
                text: '无后台',
                status: 'Error',
            },
            2: {
                text: '带后台',
                status: 'Success',
                disabled: true,
            },
        },
    },
    {
        title: '描述',
        dataIndex: 'desc',
        copyable: true,
        width: 200,
        ellipsis: true,
        search: false,
    },
    // {
    //     title: '所属代理商',
    //     dataIndex: 'agent_id',
    //     search: false,
    //     render: (val, record) => {
    //         return record.agent_name;
    //     }
    // },
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
