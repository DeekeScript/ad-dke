import { ProColumns } from "@ant-design/pro-components";
import moment from "moment";

export const columns: ProColumns<any>[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        search: false,
        width: 120,
        fixed: 'left',
    },
    {
        title: '日志类型',
        dataIndex: 'type',
        valueEnum: {
            0: { text: '一般错误' },
            1: {
                text: '致命错误',
                status: 'Error',
            },
            2: {
                text: '系统参数缺失错误',
                status: 'Error',
            },
            3: {
                text: '其他错误',
                status: 'Processing',
            },
            4: {
                text: '未知错误',
                status: 'Processing',
            },
        },
    },
    {
        title: '机器ID',
        dataIndex: 'machine_id',
    },
    {
        title: '用户ID',
        dataIndex: 'user_id',
    },
    {
        title: '代理商用户ID',
        dataIndex: 'agent_user_id',
        renderText: (val: string) => `${val}`,
    },
    {
        title: '日志内容',
        dataIndex: 'desc',
        search: false,
        width: 1200,
        //hideInForm: true,
        render: (val: string) => {
            try {
                let res = JSON.parse(val);
                if (res && res.length <= 10) {
                    return res.map((v: string) => {
                        return <p>{v}</p>;
                    });
                }
            } catch (e) {

            }

            return val;
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
