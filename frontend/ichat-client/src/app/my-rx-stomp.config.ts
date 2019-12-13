import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';
import { settings } from './shared/util/settings';

export const myRxStompConfig: InjectableRxStompConfig = {

    brokerURL: `${settings.baseUrl}/ichat`,

    connectHeaders: {
        login: 'guest',
        passcode: 'guest'
    },

    heartbeatIncoming: 0,

    heartbeatOutgoing: 20000,

    reconnectDelay: 200,

    debug: (msg: string): void => {
        console.log(new Date(), msg);
    }
};