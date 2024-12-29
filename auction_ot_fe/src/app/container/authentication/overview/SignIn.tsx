import { Col, Form, Input, Modal, Row, Spin } from 'antd';
import { FC, startTransition, Suspense, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AuthFormWrap } from './Style';
import { RootState } from '../../../../store/RootReducer';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Checkbox } from '../../../../components/component_base/components/checkbox/Checkbox';
import { Button } from '../../../../components/component_base/components/buttons/Buttons';
import { login } from '../../../../store/auth/Actions';
import { LoginState } from '../../../../store/auth/Types';
import FontAwesome from 'react-fontawesome';
import { Heading } from '../../../../components/component_base/components/heading/Heading';
import { themeColor } from '../../../../config/theme/ThemeVariables';

interface ISignIn {}

const SignIn: FC<ISignIn> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const isLoading = useSelector((state: RootState) => state.auth.loading);
  const [form] = Form.useForm();
  const [state, setState] = useState({
    checked: localStorage.getItem("IsRemember")=="false"?false:true,
  });


  const handleSubmit = useCallback(
    (values: LoginState) => {
      startTransition(() => {
        values.isRemember = state.checked;
        dispatch(login(values, () => navigate('/main/exam-student')));
      })
    },
    [navigate, dispatch],
  );

  const onChange = (e: CheckboxChangeEvent) => {
    setState({ ...state, checked: e.target.checked });
    state.checked = e.target.checked;
  };

  const [open, setOpen] = useState(false);

  const emailInput = Form.useWatch('Email', form);
  const passwordInput = Form.useWatch('Password', form);

  const handleKeyDown = (event: { code: string; preventDefault: () => void; }) => {
    if (event.code === 'Space') event.preventDefault()
  }
  return (
    <Suspense
      fallback={
        <div className="spin">
          <Spin />
        </div>
      }
    >
      <div>
        <Row justify="center">
          <Col xxl={6} xl={8} md={12} sm={18} xs={24}>
            <AuthFormWrap>
              <div className="ninjadash-authentication-top">
                <h1 className="ninjadash-authentication-top__title">Log in</h1>
              </div>
              <div className="ninjadash-authentication-content">
                <Form name="login" form={form} onFinish={handleSubmit} layout="vertical">
                  <Form.Item name="Email" initialValue={!localStorage.getItem("Email")?"":localStorage.getItem("Email")} label="Email">
                    <Input placeholder="example.email@gmail.com" onKeyDown={handleKeyDown}/>
                  </Form.Item>
                  <Form.Item name="Password" initialValue={!localStorage.getItem("Password")?"":localStorage.getItem("Password")} label="Password">
                    <Input.Password placeholder="Enter at least 8+ characters" onKeyDown={handleKeyDown}/>
                  </Form.Item>
                  <div className="ninjadash-auth-extra-links">
                    <Checkbox onChange={onChange} checked={state.checked}>
                      Remember me
                    </Checkbox>
                  </div>
                  <Form.Item>
                  <Button className="btn-signin" htmlType="submit" mergetype="primary" size="large" disabled={!emailInput || emailInput === '' || !passwordInput || passwordInput === '' || passwordInput.length <8 || passwordInput.length > 20 ||!/[!@#$%^&*()_+{}[\]:;<>,.?/~`-]/.test(passwordInput) || !/\d/.test(passwordInput) || !/[A-Z]/.test(passwordInput) || !/[a-z]/.test(passwordInput)}>
                      {/* {isLoading ? 'Loading...' : 'Log In'} */}
                    </Button>
                  </Form.Item>
                </Form>
                <Modal
                  centered
                  open={open}
                  onOk={() => setOpen(false)}
                  onCancel={() => setOpen(false)}
                  footer=''
                >
                  <div style={{ justifyItems: 'center', display: 'grid' }}>
                    <div
                      style={{
                        padding: 20,
                        borderRadius: 999,
                        background: themeColor['success-color'],
                        marginTop: 10,
                        marginBottom: 30,
                        height: 100,
                        width: 100,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <FontAwesome name="phone" size="4x" style={{ color: themeColor['white-color'] }} />
                    </div>
                    <Heading as="h2">091.334.5162</Heading>
                  </div>
                </Modal>
              </div>
              <div className="ninjadash-authentication-bottom">
                <p>
                  Don't have an account or forgot password?&nbsp;&nbsp;&nbsp;&nbsp;<Link to={''}><u style={{color: 'blue'}} onClick={() => setOpen(true)}>Contact us</u></Link>
                </p>
              </div>
            </AuthFormWrap>
          </Col>
        </Row>
        <Row justify="center" style={{marginTop:'50px'}}>
            <h4 style={{ textAlign:'center', fontFamily:'sans-serif'}}>Check out Smart's additional <u style={{color: 'blue'}}>CBAP</u><sup>&reg;</sup>, <u style={{color: 'blue'}}>CCBA</u><text>&#8482;</text>, <u style={{color: 'blue'}}>ECBA</u><sup>&reg;</sup>, <u style={{color: 'blue'}}>AAC</u><sup>&reg;</sup>, <u style={{color: 'blue'}}>BAF</u><sup>&reg;</sup> and <u style={{color: 'blue'}}>ISTQB</u></h4>
          </Row>
          <Row justify="center" style={{marginTop:'-5px'}}>
            <h4 style={{ textAlign:'center', fontFamily:'sans-serif'}}>Exam Preparation Resources to help you pass the first time!</h4>
          </Row >
          <Row justify="center" style={{marginTop:'10px'}}>
            <h5 style={{ textAlign:'center', fontFamily:'sans-serif'}}>Copyright &copy; 2010-2024, Smart Learning All rights reserved</h5>
          </Row>
          <Row justify="center" style={{marginTop:'-5px'}}>
            <h5 style={{ color: 'blue', textAlign:'center', fontFamily:'sans-serif'}}>[<Link to={''}><u style={{ color: 'blue', textAlign:'center', fontFamily:'sans-serif'}} onClick={() => setOpen(true)}>Contact Us</u></Link>]&nbsp;&nbsp;&nbsp;&nbsp;[<u style={{ color: 'blue', textAlign:'center', fontFamily:'sans-serif'}}>Learn More</u>]&nbsp;&nbsp;&nbsp;&nbsp;[<u style={{ color: 'blue', textAlign:'center', fontFamily:'sans-serif'}}>About Us</u>]</h5>
          </Row>
      </div>
    </Suspense>
  );
};

export default SignIn;
