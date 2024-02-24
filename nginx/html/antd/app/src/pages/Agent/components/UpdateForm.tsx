import {
  DrawerForm,
  ProFormDigit,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form } from 'antd';
import React from 'react';

export type UpdateFormProps = {
  onSubmit: (values: any) => Promise<void>;
  values: any;
  btn: any,
};
const UpdateForm: React.FC<UpdateFormProps> = (props: any) => {
  const [form] = Form.useForm();
  return (
    <DrawerForm
      title={props.values ? '编辑' : '添加'}
      form={form}
      preserve={false}
      trigger={
        props.btn
      }
      layout={'horizontal'}
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      onFinish={async (data) => {
        data.id = props.values?.id || 0;
        return props.onSubmit(data);
      }}
      width={"440px"}
    >
      <ProFormText name="name" labelCol={{ span: 5 }} label="名称" rules={[{ required: true, message: '名称不能为空' }]} initialValue={props.values?.name || ''} />
      <ProFormDigit name="mobile" labelCol={{ span: 5 }} label="手机号" rules={[{ required: true, message: '手机号不能为空' }]} initialValue={props.values?.mobile || ''} />
      <ProFormDigit name="user_id" labelCol={{ span: 5 }} label="用户ID" rules={[{ required: true, message: '用户ID不能为空' }]} initialValue={props.values?.user_id || ''} />
      <ProFormText name="weixin" labelCol={{ span: 5 }} label="微信号" rules={[{ required: true, message: '微信号不能为空' }]} initialValue={props.values?.weixin || ''} />
      <ProFormText name="douyin" labelCol={{ span: 5 }} label="抖音号" rules={[{ required: true, message: '抖音号不能为空' }]} initialValue={props.values?.douyin || ''} />
      <ProFormDigit disabled={true} name="machine_count" fieldProps={{ addonAfter: '台' }} labelCol={{ span: 5 }} label="机器数量" rules={[{ required: true, message: '机器数量不能为空' }]} initialValue={props.values?.machine_count || 0} />
      <ProFormDigit name="add_machine_count" fieldProps={{ addonAfter: '台' }} labelCol={{ span: 5 }} label="新增机器" rules={[{ required: true, message: '机器数量不能为空' }]} initialValue={0} />
      <ProFormDigit name="pay_money" fieldProps={{ addonAfter: '分' }} labelCol={{ span: 5 }} label="消费" rules={[{ required: true, message: '消费不能为空' }]} initialValue={props.values?.pay_money || ''} />
      <ProFormSwitch name="open_wx" checkedChildren="开启" unCheckedChildren="关闭" labelCol={{ span: 5 }} label="微信群控" />
      <ProFormTextArea name="desc" labelCol={{ span: 5 }} label="描述" initialValue={props.values?.desc || ''} />
    </DrawerForm>
  );
};
export default UpdateForm;
