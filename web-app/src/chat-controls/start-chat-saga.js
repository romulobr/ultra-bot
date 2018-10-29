import {put, takeEvery} from 'redux-saga/effects';
import getSavedToken from '../authentication/jwt'
import {ipcRenderer} from 'electron';

function* connectToChat() {
    console.log('trying to connect to chat');
    try {
        const jwt = getSavedToken();
        if (!jwt) {
            yield put({type: 'NOT_AUTHENTICATED'});
            return;
        }
        ipcRenderer.send('connectToChat', jwt);
    } catch (e) {
        yield put({type: 'CONNECT_TO_CHAT_ERROR', error: e});
        console.log('got an error:', e);
    }
}

function* watchStartChat() {
    yield takeEvery('CONNECT_TO_CHAT', connectToChat);
}

export default watchStartChat;
