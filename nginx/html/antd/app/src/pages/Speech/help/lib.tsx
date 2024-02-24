import { ProColumns } from "@ant-design/pro-components";
import moment from "moment";

export const columns: ProColumns<any>[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        search: false,
    },
    {
        title: '名称',
        dataIndex: 'name',
    },
    {
        title: '描述',
        dataIndex: 'desc',
        search: false,
    },
    {
        title: '类型',
        dataIndex: 'type',
        //hideInForm: true,
        valueEnum: {
            0: { text: '评论', status: 'Success', },
            1: {
                text: '私信',
                status: 'Error',
            },
        },
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
