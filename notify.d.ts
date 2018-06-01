export as namespace Notify;

export const enum NotifyTypes {
    Success,
    Warning,
    Danger,
    Info
}
export const enum RequestTypes {
    FriendRequest,
    GameRequest,
    MessageRequest
}
export function showRequest(display: RequestTypes, data: string, initials?: string, onCallBack?: function (): void): void;
export function alertUser(title: string, text: string, actionList: Array<Function>, textList: Array<string>): Promise;
export function notify(display: NotifyTypes, data: string): void;
