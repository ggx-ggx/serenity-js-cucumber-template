// import { Actor, Activity, Task } from '@serenity-js/core';
// import { LastResponse, Send, GetRequest, PostRequest } from '@serenity-js/rest';

// export class BaseApi {
//     protected static baseUrl: string;
//     protected static apiName: string;

//     protected static sendRequest(actor: Actor, method: string, endpoint: string, body?: any): Task {
//         const request = method === 'GET' 
//             ? GetRequest.to(endpoint)
//             : PostRequest.to(endpoint).with(body);

//         return Task.where(`#actor sends a ${method} request to ${endpoint}`,
//             Send.a(request)
//         );
//     }
// } 