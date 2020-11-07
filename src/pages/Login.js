import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../actions';
import './Login.css';
import logoWallet from '../trybeWallet.png';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.validateFields = this.validateFields.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      email: '',
      password: '',
      isValid: false,
    };
  }

  validateFields() {
    const MIN_LENGTH = 6;
    const { email, password } = this.state;
    this.setState({
      isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      && password.length >= MIN_LENGTH,
    });
  }

  handleChange({ target }) {
    this.setState({ [target.name]: target.value }, () => {
      this.validateFields();
    });
  }

  handleSubmit(event) {
    const { history, saveEmail } = this.props;
    const { email } = this.state;
    event.preventDefault();
    saveEmail(email);
    history.push('/carteira');
  }

  render() {
    const { email, password, isValid } = this.state;
    return (
      <section className="login-container">
        <h1><img src={ logoWallet } alt="Logo Trybe Wallet" /></h1>
        <input
          data-testid="email-input"
          required
          type="email"
          name="email"
          value={ email }
          placeholder=" Dígite seu email"
          onChange={ this.handleChange }
        />
        <input
          data-testid="password-input"
          required
          type="password"
          name="password"
          value={ password }
          placeholder=" Senha"
          onChange={ this.handleChange }
        />
        <Link
          to="/carteira"
          onClick={ this.handleSubmit }
          className="btnn"
        >
          <button
            type="submit"
            className="btn"
            disabled={ !isValid }
            onClick={ () => this.validateFields() }
          >
            Entrar
          </button>
        </Link>
      </section>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  saveEmail: (email) => dispatch(login(email)),
});

Login.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  saveEmail: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
