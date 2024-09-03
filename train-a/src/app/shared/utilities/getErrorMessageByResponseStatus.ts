export default function getErrorMessageByResponseStatus(responseStatus: number): string {
  switch (responseStatus) {
    case 400:
      return '400, Route error';
      break;
    case 401:
      return '401, Wrong token identifier';
      break;
    default:
      return responseStatus.toString();
  }
}
