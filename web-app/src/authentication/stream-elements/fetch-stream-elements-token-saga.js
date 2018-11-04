import {streamElementsTokenApi, streamElementsApiCheck, mediaApi} from '../../urls';
import {put, takeEvery} from 'redux-saga/effects';
import axios from 'axios';
import getSavedToken from '../../authentication/jwt';
import actions from '../stream-elements/stream-elements-actions';
import {notAuthenticated} from '../../authentication/authentication-actions'

function* fetchToken() {
    try {
        const jwt = getSavedToken();
        if (!jwt) {
            yield put(notAuthenticated());
            return;
        }
        const getResponse = yield axios.get(streamElementsTokenApi, {
            headers: {Authorization: 'Bearer ' + jwt}
        });
        if (getResponse.data && getResponse.data[0] && getResponse.data[0].token) {
            yield put(actions.fetchTokenSuccess({token: getResponse.data[0].token}));
            try {
                if(getResponse.data[0].token!==''){
                    const streamElementsUser = yield axios.get(streamElementsApiCheck, {
                        headers: {Authorization: 'Bearer ' + getResponse.data[0].token}
                    });
                    yield put(actions.tokenVerificationSuccess(streamElementsUser.data.channels["0"].displayName));
                }
            } catch (e) {
                yield put(actions.tokenVerificationFailed({error: e}));
            }
        } else {
            yield axios.post(streamElementsTokenApi, {token: ''}, {headers: {Authorization: 'Bearer ' + jwt}});
            yield put(actions.fetchToken());
        }
    } catch (e) {
        yield put(actions.fetchTokenFailed({error: e}));
        console.log('got an error:', e);
    }
}

function* watchFetchToken() {
    yield takeEvery(actions.fetchToken, fetchToken);
}

export default watchFetchToken;
