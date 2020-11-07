import { CURRENCIES_FECTH_SUCESS, ADD_NEW_EXPENSE,
  DELETE_EXPENSE, EDIT_EXPENSE } from '../actions/index';

const INITIAL_STATE = {
  currencies: [],
  expenses: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
  case CURRENCIES_FECTH_SUCESS:
    return {
      ...state,
      currencies: Object.keys(action.currencies)
        .filter((currency) => currency !== 'USDT'),
    };
  case ADD_NEW_EXPENSE:
    return {
      ...state,
      expenses: [...state.expenses, action.expense],
    };
  case DELETE_EXPENSE:
    return {
      ...state,
      expenses: state.expenses.filter((expense) => expense.id !== action.id),
    };
  case EDIT_EXPENSE:
    return {
      ...state,
      expenses: state.expenses.map((expense) => (
        expense.id === action.expense.id ? { ...expense, ...action.expense } : expense
      )),
    };
  default:
    return state;
  }
}
