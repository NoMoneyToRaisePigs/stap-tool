
API:POST - /admin-api/admin-monitor/sensitive-info/accurate-list-sensitive-request
{
  "code": "string",
  "data": [
    {
      "confirmedSensitiveFieldPath": "string",
      "dbCreateTime": "2025-04-17T14:36:21.685Z",
      "dbModifyTime": "2025-04-17T14:36:21.685Z",
      "feignInvocationId": 0,
      "feignRequestUrl": "string",
      "id": 0,
      "remark": "string",
      "requestUrl": "string",
      "requestUrlId": 0,
      "scannedSensitiveFieldPath": "string",
      "sensitiveKeyword": "string",
      "sensitiveKeywordType": "string",
      "status": 0
    }
  ],
  "errorData": {},
  "params": [
    {}
  ],
  "status": "ERROR",
  "subData": {},
  "type": "GENERAL"
}

mock example:

{
    "status": "OK",
    "type": "GENERAL",
    "code": "000000000",
    "errorData": null,
    "data": [
        {
            "id": 941,
            "requestUrlId": 17643,
            "requestUrl": "POST /user/binance/registration-type/get-edit-log",
            "feignInvocationId": 6591,
            "feignRequestUrl": "POST http://account-admin/account-admin/securitylog/getUserTypeChangeLog",
            "scannedSensitiveFieldPath": "$.userTypeChangeLogVoList.userId",
            "confirmedSensitiveFieldPath": "$.userTypeChangeLogVoList.userId",
            "sensitiveKeyword": "userid",
            "sensitiveKeywordType": "USER",
            "status": 2,
            "remark": null,
            "dbCreateTime": 1723724964000,
            "dbModifyTime": 1724093114000
        },
        {
            "id": 547,
            "requestUrlId": 4478,
            "requestUrl": "POST /user/binance/query",
            "feignInvocationId": 3050,
            "feignRequestUrl": "POST http://account-admin/account-admin/user-helper/searchUserList",
            "scannedSensitiveFieldPath": "$.searchUserList.userId",
            "confirmedSensitiveFieldPath": "$.searchUserList.userId",
            "sensitiveKeyword": "userid",
            "sensitiveKeywordType": "USER",
            "status": 0,
            "remark": null,
            "dbCreateTime": 1723724961000,
            "dbModifyTime": 1723724961000
        },
        {
            "id": 660,
            "requestUrlId": 18222,
            "requestUrl": "POST /user/binance/changeEmail",
            "feignInvocationId": 3897,
            "feignRequestUrl": "POST http://account-admin/account-admin/user-helper/searchUserListV2",
            "scannedSensitiveFieldPath": "$.searchUserList.userId",
            "confirmedSensitiveFieldPath": "$.searchUserList.userId",
            "sensitiveKeyword": "userid",
            "sensitiveKeywordType": "USER",
            "status": 1,
            "remark": null,
            "dbCreateTime": 1723724962000,
            "dbModifyTime": 1728370767000
        },
        {
            "id": 660,
            "requestUrlId": 18539,
            "requestUrl": "POST /user/binance/info/existed",
            "feignInvocationId": 3897,
            "feignRequestUrl": "POST http://account-admin/account-admin/user-helper/searchUserListV2",
            "scannedSensitiveFieldPath": "$.searchUserList.userId",
            "confirmedSensitiveFieldPath": "$.searchUserList.userId",
            "sensitiveKeyword": "userid",
            "sensitiveKeywordType": "USER",
            "status": 1,
            "remark": null,
            "dbCreateTime": 1723724962000,
            "dbModifyTime": 1728370767000
        }
    ],
    "subData": null,
    "params": null
}



API: POST - /admin-api/admin-monitor/sensitive-info/confirm-sensitive-request

Payload : 
{
    "feignRequestUrl":"POST http://appealapi/riskFraud/admin/detail","scannedSensitiveFieldPath":"$.infoVo.coin","confirmedSensitiveFieldPath":"$.infoVo.coin","sensitiveKeywordType":"ASSET","status":2,"remark":null,"feignInvocationId":1547
}


Response:
{
    "status": "OK",
    "type": "GENERAL",
    "code": "000000000",
    "errorData": null,
    "data": null,
    "subData": null,
    "params": null
}