import {
  DrawerForm,
  ProFormSelect,
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
      <ProFormText name="name" labelCol={{ span: 5 }} label="名称" initialValue={props.values?.name || ''} />
      <ProFormSelect
        label="类型"
        name={'type'}
        labelCol={{ span: 5 }}
        initialValue={props.values && props.values.type}
        fieldProps={{
          onChange: (v) => {
            //console.log(v);
          }
        }}
        options={access['Api_statisticList'] ? [
          { value: 1, label: '无后台' },
          { value: 2, label: '带后台' },
        ] : [
          { value: 1, label: '无后台' },
        ]}
      />
      <ProFormTextArea name="desc" labelCol={{ span: 5 }} label="描述" initialValue={props.values?.desc || ''} />
    </DrawerForm>
  );
};
export default UpdateForm;
