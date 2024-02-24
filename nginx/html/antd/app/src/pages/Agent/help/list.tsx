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
        title: '代理商名称',
        dataIndex: 'name',
        //tip: '代理商名称',
    },
    {
        title: '用户ID',
        dataIndex: 'user_id',
    },
    {
        title: '微信号',
        dataIndex: 'weixin',
        renderText: (val: string) => `${val}`,
    },
    {
        title: '抖音号',
        dataIndex: 'douyin',
        //hideInForm: true,
        renderText: (val: string) => `${val}`,
    },
    {
        title: '描述',
        dataIndex: 'desc',
        valueType: 'textarea',
        copyable: true,
        width: 200,
        ellipsis: true,
        search: false,
    },
    {
        title: '机器数量',
        dataIndex: 'machine_count',
        search: false,
    },
    {
        title: '微信群控',
        dataIndex: 'open_wx',
        search: false,
        valueEnum: {
            0: { text: '未开启' },
            1: {
                text: '已开启',
                status: 'Success',
            },
        },
    },
    {
        title: '累计机器数量',
        dataIndex: 'all_machine_count',
        search: false,
    },
    {
        title: '累计消费（元）',
        dataIndex: 'pay_money',
        search: false,
        render: (text) => {
            return (text / 100).toFixed(2);
        }
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
