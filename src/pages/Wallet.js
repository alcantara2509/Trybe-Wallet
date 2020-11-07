import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { thunkCurrencies, thunkAddANewCurrency, deleteExpense,
  editExpense } from '../actions';
import './Wallet.css';

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
    };
    this.handleAddNewExpense = this.handleAddNewExpense.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRemoveExpense = this.handleRemoveExpense.bind(this);
    this.handleEditExpense = this.handleEditExpense.bind(this);
    this.handleSubmitEditedExpense = this.handleSubmitEditedExpense.bind(this);
  }

  componentDidMount() {
    const { currenciesFetchSucess } = this.props;
    currenciesFetchSucess();
  }

  handleChange({ target }) {
    this.setState({ [target.name]: target.value });
  }

  handleAddNewExpense(event) {
    event.preventDefault();
    const { saveExpensesInfo } = this.props;
    const { ...expense } = this.state;
    saveExpensesInfo(expense);
  }

  handleSubmitEditedExpense(event) {
    event.preventDefault();
    const { editExpenseAction } = this.props;
    const { value, description, currency, method, tag, editedId: id } = this.state;
    editExpenseAction({ value, description, currency, method, tag, id });
    this.setState({
      isEditing: false,
    });
  }

  handleRemoveExpense(id) {
    const { removeExpense } = this.props;
    removeExpense(id);
  }

  handleEditExpense(id) {
    this.setState({ editedId: id, isEditing: true });
  }

  render() {
    const { value, description, currency, method, tag, isEditing } = this.state;
    const { email, currencies, expenses } = this.props;
    const totalValue = expenses.length ? Math.round(expenses
      .reduce((acc, cur) => acc + cur.value
       * cur.exchangeRates[cur.currency].ask, 0) * 100) / 100 : 0;
    const fields = ['Descrição', 'Tag', 'Método de pagamento', 'Valor', 'Moeda',
      'Câmbio utilizado', 'Valor convertido', 'Moeda de conversão', 'Editar/Excluir'];
    return (
      <main>
        <header className="header-wallet">
          <span data-testid="email-field">
            Email:
            { ` ${email}` }
          </span>
          <span className="despesa-total" data-testid="total-field">
            Despesa Total:
            { ` ${totalValue} ` }
            <span data-testid="header-currency-field">BRL</span>
          </span>
        </header>
        <form
          className="form-container"
          onSubmit={ isEditing
            ? this.handleSubmitEditedExpense
            : this.handleAddNewExpense }
        >
          <section className="valor-descricao">
            <label htmlFor="value">
              Valor:
              <input
                onChange={ this.handleChange }
                type="text"
                name="value"
                id="value"
                data-testid="value-input"
                value={ value }
              />
            </label>
            <label htmlFor="description">
              Descrição:
              <input
                onChange={ this.handleChange }
                type="text"
                name="description"
                id="description"
                data-testid="description-input"
                value={ description }
              />
            </label>
          </section>
          <section className="selects">
            <label htmlFor="currency">
              Moeda:
              <select
                name="currency"
                id="currency"
                data-testid="currency-input"
                value={ currency }
                onChange={ this.handleChange }
              >
                {currencies && currencies.map((coin) => (
                  <option key={ coin } data-testid={ `${coin}` } value={ coin }>
                    { coin }
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="method">
              Método:
              <select
                name="method"
                id="method"
                data-testid="method-input"
                value={ method }
                onChange={ this.handleChange }
              >
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão de crédito">Cartão de crédito</option>
                <option value="Cartão de débito">Cartão de débito</option>
              </select>
            </label>
            <label htmlFor="tag">
              Tag:
              <select
                data-testid="tag-input"
                id="tag"
                name="tag"
                value={ tag }
                onChange={ this.handleChange }
              >
                <option value="Alimentação">Alimentação</option>
                <option value="Lazer">Lazer</option>
                <option value="Trabalho">Trabalho</option>
                <option value="Transporte ">Transporte</option>
                <option value="Saúde">Saúde</option>
              </select>
            </label>
            <button
              id="adicionar-despesa"
              type="submit"
            >
              { isEditing ? 'Editar despesa' : 'Adicionar despesa' }
            </button>
          </section>
        </form>
        <table className="table-container" id="tbl" border="1">
          <thead>
            <tr>
              {fields.map((title) => <td key={ title }>{ title }</td>)}
            </tr>
          </thead>
          <tbody>
            {expenses.map((expen) => {
              const exchangeValue = Number(expen.exchangeRates[expen.currency].ask);
              const currencyName = expen.exchangeRates[expen.currency].name;
              const convertedValue = exchangeValue * expen.value;
              return (
                <tr
                  style={ {
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '10px',
                    padding: '0 7px',
                  } }
                  key={ expen.id }
                >
                  <td>{ expen.description }</td>
                  <td>{ expen.tag }</td>
                  <td>{ expen.method }</td>
                  <td>{ expen.value }</td>
                  <td>{ exchangeValue.toFixed(2) }</td>
                  <td>{ currencyName }</td>
                  <td>{ convertedValue.toFixed(2) }</td>
                  <td>Real</td>
                  <td>
                    <button
                      type="button"
                      id="btn-editar"
                      data-testid="edit-btn"
                      onClick={ () => this.handleEditExpense(expen.id) }
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      id="btn-excluir"
                      data-testid="delete-btn"
                      onClick={ () => this.handleRemoveExpense(expen.id) }
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.user.email,
  currencies: state.wallet.currencies,
  expenses: state.wallet.expenses,
});

const mapDispatchToProps = (dispatch) => ({
  currenciesFetchSucess: () => dispatch(thunkCurrencies()),
  saveExpensesInfo: (expense) => dispatch(thunkAddANewCurrency(expense)),
  removeExpense: (id) => dispatch(deleteExpense(id)),
  editExpenseAction: (expense) => dispatch(editExpense(expense)),
});

Wallet.propTypes = {
  email: PropTypes.string.isRequired,
  currencies: PropTypes.arrayOf(Object).isRequired,
  currenciesFetchSucess: PropTypes.func.isRequired,
  saveExpensesInfo: PropTypes.func.isRequired,
  expenses: PropTypes.arrayOf(Object).isRequired,
  removeExpense: PropTypes.func.isRequired,
  editExpenseAction: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
