import If from '@/components/If';
import { grabTaskPhoneList, removeGrabTaskPhone, updatePhone, exportVcf } from '@/services/api/api';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Alert, Button, Popconfirm, message } from 'antd';
import React from 'react';
import { history } from 'umi';
import { columns } from './help/phoneList';
import PhoneUpdateForm from './components/PhoneUpdateForm';

@window.connectModel('user', '@@initialState')
export default class PhoneList extends React.Component {
  actionRef: React.RefObject<any>;
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.actionRef = React.createRef();
  }

  state = {
    agent_user_id: history.location.query?.agent_user_id,
    user_id: history.location.query?.user_id,
    user: this.props.user?.initialState?.currentUser,
    machineCount: 0,
    loading: false,
    loading2: false,
  }

  record = {}

  componentDidMount(): void {

  }

  getData = async (params: { current: number; pageSize: number; douyin: string; weixin: string; name: string; }) => {
    if (this.state.agent_user_id) {
      params['agent_user_id'] = this.state.agent_user_id;
    }

    if (this.state.user_id) {
      params['user_id'] = this.state.user_id;
    }

    const res = await grabTaskPhoneList(params);
    return res;
  }

  handleRemove = async (id: number) => {
    let res = await removeGrabTaskPhone({
      id: id,
    });
    console.log(res);
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
    }
  }

  handleUpdate = async (fields: any) => {
    let res = await updatePhone({ ...fields });
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
      return true;//关闭弹窗
    }
  }

  downloads = (record: any) => {
    const blob = new Blob([record], {
      type: 'text/plain'
    });
    const aLink = document.createElement('a');
    aLink.style.display = 'none';
    aLink.href = URL.createObjectURL(blob);
    aLink.download = 'vcf.vcf';
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink);
    return true;
  }

  exportVcf = async (fields: any) => {
    if (fields.limit === 60) {
      if (this.state.loading2) {
        return;
      }
      this.setState({
        loading2: true,
      });
    } else {
      if (this.state.loading) {
        return;
      }
      this.setState({
        loading: true,
      });
    }

    let res = await exportVcf({ ...fields });
    this.setState({
      loading: false,
      loading2: false,
    });

    if (res.code === 0 && this.downloads(res['data'])) {
      this.actionRef.current.reload();
      message.success('成功');
      return true;//关闭弹窗
    }
  }

  render() {
    return (
      <PageContainer>
        {this.state.user.role_type === 1 ? <Alert style={{ marginBottom: 12 + 'px' }} type='warning' description={<span>请勿将采集信息售卖给他人，否则一切后果自负！</span>} /> : undefined}
        <ProTable
          //headerTitle={'查询表格'}
          actionRef={this.actionRef}
          rowKey="id"
          search={{ labelWidth: 86, }}
          scroll={{ x: 2500 }}
          toolBarRender={() => [
            <If access={'Api_exportVcf'}>
              <Button onClick={async () => this.exportVcf({ limit: 300 })} type='primary' loading={this.state.loading}>导出300条电话号码</Button>
            </If>,
            <If access={'Api_exportVcf'}>
              <Button onClick={async () => this.exportVcf({ limit: 60 })} type='primary' loading={this.state.loading2}>导出60条电话号码</Button>
            </If>,
          ]}
          request={this.getData}
          columns={[...columns, {
            title: '操作',
            width: 120,
            fixed: 'right',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
              <If key={'upd_' + record.id} access="Api_updatePhone">
                <PhoneUpdateForm
                  key={'update__' + record.id}
                  btn={<a key={"update_" + record.id}>修改</a>}
                  onSubmit={this.handleUpdate}
                  values={record}
                  roleType={this.state.user.role_type}
                />
              </If>,
              <If key={'del_' + record.id} access="Api_removeGrabTaskPhone">
                <Popconfirm
                  key={'delete__' + record.id}
                  title="确定删除吗？"
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  onConfirm={() => this.handleRemove(record.id)}
                > <a key={"delete_" + record.id}>删除</a></Popconfirm>
              </If>,
            ],
          },]}
        />
      </PageContainer>
    );
  }
}
