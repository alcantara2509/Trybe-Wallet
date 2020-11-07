export const LOGIN = 'LOGIN';
export const CURRENCIES_FECTH_SUCESS = 'CURRENCIES_FECTH_SUCESS';
export const ADD_NEW_EXPENSE = 'ADD_NEW_EXPENSE';
export const DELETE_EXPENSE = 'DELETE_EXPENSE';
export const EDIT_EXPENSE = 'EDIT_EXPENSE';

export const login = (email) => ({
  type: LOGIN,
  email,
});

export const currenciesFetchSucess = (currencies) => ({
  type: CURRENCIES_FECTH_SUCESS,
  currencies,
});

export const addNewExpense = (expense) => ({
  type: ADD_NEW_EXPENSE,
  expense,
});

export const deleteExpense = (id) => ({
  type: DELETE_EXPENSE,
  id,
});

export const editExpense = (expense) => ({
  type: EDIT_EXPENSE,
  expense,
});

export const thunkCurrencies = () => async (dispatch) => {
  const responseFromAPI = await fetch('https://economia.awesomeapi.com.br/json/all');
  const currencies = await responseFromAPI.json();
  dispatch(currenciesFetchSucess(currencies));
};

export const thunkAddANewCurrency = (expense) => async (dispatch, getState) => {
  const { wallet: { expenses } } = getState();
  const INITIAL_ID = 0;
  const nextID = expenses.length ? expenses[expenses.length - 1].id + 1 : INITIAL_ID;
  const responseFromAPI = await fetch('https://economia.awesomeapi.com.br/json/all');
  const exchangeRates = await responseFromAPI.json();
  const newExpense = { id: nextID, ...expense, exchangeRates };
  dispatch(addNewExpense(newExpense));
};
