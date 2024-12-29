import { useState, useEffect, FC } from 'react';
import { Spin } from 'antd';
import { NavLink } from 'react-router-dom';
import { Main } from '../Style';
import { Heading } from '../../../components/component_base/components/heading/Heading';
import { Button } from '../../../components/component_base/components/buttons/Buttons';
import { ErrorWrapper } from './Style';

interface INotFound {}

const NotFound: FC<INotFound> = () => {
  const [state, setState] = useState({
    isLoading: true,
  });

  useEffect(() => {
    setTimeout(() => {
      setState({ isLoading: false });
    }, 1500);
  }, []);

  return (
    <Main>
      {state.isLoading ? (
        <div className="spin">
          <Spin />
        </div>
      ) : (
        <ErrorWrapper>
          <img src={require(`../../static/img/pages/404.svg`).default} alt="404" />
          <Heading className="error-text" as="h3">
            404
          </Heading>
          <p>Sorry! the page you are looking for does not exist.</p>
          <NavLink to="/main">

            <Button size="middle" mergetype="primary" to="/main">
              Return Home
            </Button>
          </NavLink>
        </ErrorWrapper>
      )}
    </Main>
  );
};

export default NotFound;
