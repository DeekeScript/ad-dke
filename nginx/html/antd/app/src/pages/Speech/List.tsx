import { addSpeech, speechList, removeSpeech, updateSpeech, autoSpeechList } from '@/services/api/api';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import React from 'react';
import UpdateForm from './components/UpdateForm';
import { columns } from './help/list';
import SpeechList from './components/SpeechList';
import If from '@/components/If';
import { history } from 'umi';

@window.connectModel('user', '@@initialState')
export default class List extends React.Component {
  actionRef: React.RefObject<any>;
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.actionRef = React.createRef();
  }

  state = {
    user: this.props.user?.initialState?.currentUser,
    columns: columns,
    id: history.location.query?.id,
  }

  componentDidMount(): void {
    if (this.state.user.role_type !== 2) {
      let tmp = [];
      let i = 0;
      for (let t of columns) {
        i++;
        if (i === columns.length - 1) {
          tmp.push({
            title: '用户',
            dataIndex: 'userName',
            search: false,
          });
        }
        tmp.push(t);
      }

      this.setState({
        columns: tmp,
      });
    }
  }

  getData = async (params: { current: number; pageSize: number; douyin: string; weixin: string; name: string; }) => {
    params['id'] = this.state.id;
    const res = await speechList(params);
    return res;
  }

  speech = async (desc: string, level: BigInteger) => {
    let res = await autoSpeechList({ desc: desc, level: level });
    if (res.success) {
      return res.data;
    }
    return [];
  }

  handleUpdate = async (fields: any) => {
    fields.lib_id = this.state.id;
    let res = await updateSpeech({ ...fields });
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
      return true;//关闭弹窗
    }
  }

  handleAdd = async (fields: any) => {
    fields.lib_id = this.state.id;
    let res = await addSpeech({
      ...fields,
    });
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
      return true;//关闭弹窗
    }
  }

  handleRemove = async (id: number) => {
    let res = await removeSpeech({
      id: id,
    });
    console.log(res);
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
    }
  }

  render() {
    return (
      <PageContainer>
        <ProTable
          //headerTitle={'查询表格'}
          actionRef={this.actionRef}
          rowKey="id"
          search={{ labelWidth: 68, }}
          toolBarRender={() => [
            <If access={'Api_addSpeechLib'}>
              <UpdateForm
                btn={<Button type="primary">
                  <PlusOutlined />
                  添加
                </Button>}
                onSubmit={this.handleAdd}
                values={undefined}
              />
            </If>,
          ]}
          request={this.getData}
          columns={[...this.state.columns, {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
              record.level > 0 ? <SpeechList
                title="混淆话术列表"
                key={'speech__' + record.id}
                btn={<a key={"machine_" + record.id}>混淆话术列表</a>}
                values={async () => this.speech(record.desc, record.level)}
              /> : undefined
              ,
              <UpdateForm
                key={'update__' + record.id}
                btn={<a key={"update_" + record.id}>修改</a>}
                onSubmit={this.handleUpdate}
                values={record}
              />,
              <Popconfirm
                key={'delete__' + record.id}
                title="确定删除吗？"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => this.handleRemove(record.id)}
              > <a key={"delete_" + record.id}>删除</a></Popconfirm>,
            ],
          },]}
        />
      </PageContainer>
    );
  }
}
