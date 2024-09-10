import {
  DrawerForm,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form } from 'antd';
import React from 'react';
import { useAccess } from 'umi';

export type UpdateFormProps = {
  onSubmit: (values: any) => Promise<void>;
  values: any;
  btn: any,
};
const UpdateForm: React.FC<UpdateFormProps> = (props: any) => {
  const [form] = Form.useForm();
  const access = useAccess();

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
      width={"400px"}
    >
      <ProFormText name="keyword" labelCol={{ span: 6 }} label="采集关键词" initialValue={props.values?.keyword || ''} />
      <ProFormDigit name="pass_rate" labelCol={{ span: 6 }} label="通过率" initialValue={props.values?.pass_rate || ''} fieldProps={{
        addonAfter: '%'
      }} />
      <ProFormDigit name="suc_rate" labelCol={{ span: 6 }} label="成交率" initialValue={props.values?.suc_rate || ''} fieldProps={{
        addonAfter: '%'
      }} />
      <ProFormTextArea name="desc" labelCol={{ span: 6 }} label="描述" initialValue={props.values?.desc || ''} />
    </DrawerForm>
  );
};
export default UpdateForm;
