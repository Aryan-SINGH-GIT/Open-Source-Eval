import { all, call, put, takeLatest, delay } from 'redux-saga/effects';
import { fetchCityData } from '../services/cityService';

function* fetchCityDataSaga() {
  try {
    yield delay(500);
    const data = yield call(fetchCityData);
    yield put({ type: 'FETCH_CITY_DATA_SUCCESS', payload: data });
  } catch (error) {
    yield put({ type: 'FETCH_CITY_DATA_FAILURE', error: error.message });
  }
}

function* watchFetchCityData() {
  yield takeLatest('FETCH_CITY_DATA_REQUEST', fetchCityDataSaga);
}

export default function* rootSaga() {
  yield all([watchFetchCityData()]);
}
