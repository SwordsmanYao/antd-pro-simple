import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Layout, Form, Input, Button, Table, Modal } from 'antd';

import DisplayTree from '../../../components/DisplayTree';
import styles from './index.less';

const FormItem = Form.Item;

const { Sider, Content } = Layout;


@connect(state => ({
  currentNode: state.menu.currentNode,
  selectedKeys: state.menu.selectedKeys,
  treeList: state.menu.treeList,
}))
@Form.create({
  onFieldsChange(props, changedFields) {
    console.log('onFieldsChange', changedFields);
    props.dispatch({
      type: 'menu/saveNode',
      payload: changedFields,
    });
  },
  mapPropsToFields(props) {
    console.log('mapPropsToFields', props.currentNode);
    return {
      name: Form.createFormField({
        value: props.currentNode.name,
      }),
      path: Form.createFormField({
        value: props.currentNode.path,
      }),
      icon: Form.createFormField({
        value: props.currentNode.icon,
      }),
    };
  },
  onValuesChange(_, values) {
    console.log(values);
  },
})
export default class Menu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false, // 新建的模态框是否显示
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/fetchTree',
    });
  }

  onSelect = (selectedKeys) => {
    console.log('selected', selectedKeys);
    const { dispatch } = this.props;
    console.log(dispatch);
    dispatch({
      type: 'menu/saveSelectedKeys',
      payload: selectedKeys,
    });
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  handleSubmit = (e) => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err) => {
      if (!err) {
        dispatch({
          type: 'menu/commitMenu',
        }).then((s) => {
          console.log('s', s);
        });
      }
    });
  }

  render() {
    const { selectedKeys, treeList } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 8 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    const dataSource = [{
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    }, {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    }];

    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    }];

    return (
      <Layout className={styles.layout}>
        <Sider width={250} style={{ background: '#fff' }}>
          {
            treeList && treeList.length > 0 &&
              <DisplayTree
                treeList={[{
                  id: '-1',
                  name: '菜单管理',
                  children: treeList,
                }]}
                expandedKeys={selectedKeys}
                onSelect={this.onSelect}
                selectedKeys={selectedKeys}
              />
          }
        </Sider>
        <Content style={{ background: '#fff', marginLeft: 10, padding: 30 }}>
          <div className={styles.toolbar}>
            <Button onClick={() => this.setModalVisible(true)}>新建</Button>
            <Modal
              title="Vertically centered modal dialog"
              wrapClassName="vertical-center-modal"
              visible={this.state.modalVisible}
              onOk={() => this.setModalVisible(false)}
              onCancel={() => this.setModalVisible(false)}
            >
              <Form onSubmit={this.handleSubmit}>
                <FormItem
                  {...formItemLayout}
                  label="名称"
                >
                  {getFieldDecorator('name', {
                    rules: [{
                      required: true, message: '请输入名称',
                    }],
                  })(
                    <Input />,
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="路径"
                >
                  {getFieldDecorator('path', {
                    rules: [{
                      required: true, message: '请输入路径',
                    }],
                  })(
                    <Input />,
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="图标"
                >
                  {getFieldDecorator('icon')(
                    <Input />,
                  )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">提交</Button>
                </FormItem>
              </Form>
            </Modal>
          </div>
          <Table dataSource={dataSource} columns={columns} />

        </Content>
      </Layout>
    );
  }
}
