import { Col, Modal, Row, Spin } from 'antd';
import { MemoExoticComponent, Suspense, useState } from 'react';
import { AuthenticationWrap } from './overview/Style';

export const AuthLayout = (WraperContent: MemoExoticComponent<() => JSX.Element>) => {

  return (
    <Suspense
      fallback={
        <div className="spin">
          <Spin />
        </div>
      }
    >
      <Row align="middle" justify="space-between" style={{marginTop:'5px'}}>
        <Col>
          <h1 style={{ marginLeft:'30px', color:'#1F3D99', fontFamily:'Manrope', fontSize:'35px'}}>Online Study Exam</h1>
          <h2 style={{ marginTop:'-20px', marginLeft:'30px', color:'#1F3D99', fontFamily:'Manrope', fontSize:'25px'}}>Simulator and practice exams for IIBA<sup>&reg;</sup> and PMI<sup>&reg;</sup> certifications</h2>
        </Col>
        <Col>
          <img src={require(`../../static/img/logo_dark.png`)} alt="" style={{marginRight: '30px' }}/>
        </Col>
      </Row>
      <AuthenticationWrap>
        <div className="ninjadash-authentication-wrap">
          <WraperContent />
        </div>
      </AuthenticationWrap>
    </Suspense>
  );
};
