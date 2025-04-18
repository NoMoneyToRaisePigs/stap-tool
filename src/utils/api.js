/**
 * 模拟获取敏感字段数据的API接口
 * @param {string} apiUrl - API URL
 * @returns {Promise} 返回敏感字段数据
 */
export function fetchSensitiveFieldsData(apiUrl) {
  console.log('fetchSensitiveFieldsData被调用，URL:', apiUrl);
  
  return new Promise((resolve) => {
    // 模拟1秒的API延迟
    setTimeout(() => {
      // 调用准确的敏感字段列表接口
      fetchAccurateSensitiveFields(apiUrl)
        .then(data => {
          // 按照feignRequestUrl聚合数据
          const aggregatedData = aggregateSensitiveFields(data, apiUrl);
          
          console.log('API返回聚合后的数据:', aggregatedData);
          
          // 确保总是返回一些数据，即使URL无匹配
          if (aggregatedData.length === 0) {
            console.log('未找到URL匹配的数据，返回所有数据');
            resolve(aggregateSensitiveFields(data));
          } else {
            resolve(aggregatedData);
          }
        });
    }, 1000);
  });
}

/**
 * 调用获取敏感字段准确列表的API
 * @param {string} apiUrl - 当前API URL，用于过滤相关数据
 * @returns {Promise} 返回敏感字段列表
 */
export function fetchAccurateSensitiveFields(apiUrl) {
  console.log('调用敏感字段准确列表API，参考URL:', apiUrl);
  
  // 模拟API调用
  return new Promise((resolve) => {
    // 模拟API响应数据
    const response = {
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
          "id": 772,
          "requestUrlId": 14002,
          "requestUrl": "POST /user/binance/accountoauth/doBackendUnBindThreeParty",
          "feignInvocationId": 5571,
          "feignRequestUrl": "POST http://account-admin/account-admin/user/accountoauth/selectUserBindThreeParty",
          "scannedSensitiveFieldPath": "$.userId",
          "confirmedSensitiveFieldPath": "$.userId",
          "sensitiveKeyword": "userid",
          "sensitiveKeywordType": "USER",
          "status": 0,
          "remark": null,
          "dbCreateTime": 1723724963000,
          "dbModifyTime": 1723724963000
        },
        {
          "id": 888,
          "requestUrlId": 18222,
          "requestUrl": "POST /user/binance/changeEmail",
          "feignInvocationId": 6335,
          "feignRequestUrl": "POST http://account-admin/account-admin/user/getUserById",
          "scannedSensitiveFieldPath": "$.user.userId",
          "confirmedSensitiveFieldPath": "$.user.userId",
          "sensitiveKeyword": "userid",
          "sensitiveKeywordType": "USER",
          "status": 1,
          "remark": "confirmed",
          "dbCreateTime": 1723724964000,
          "dbModifyTime": 1724132384000
        },
        {
          "id": 127,
          "requestUrlId": 4477,
          "requestUrl": "POST /user/binance/modify",
          "feignInvocationId": 524,
          "feignRequestUrl": "POST http://account-api/account/unbindDevice",
          "scannedSensitiveFieldPath": "$.userId",
          "confirmedSensitiveFieldPath": "$.userId",
          "sensitiveKeyword": "userid",
          "sensitiveKeywordType": "USER",
          "status": 3,
          "remark": null,
          "dbCreateTime": 1723724960000,
          "dbModifyTime": 1724063074000
        }
      ],
      "subData": null,
      "params": null
    };
    
    // 返回数据部分
    resolve(response.data);
  });
}

/**
 * 更新敏感字段状态的API
 * @param {Object} fieldData - 敏感字段数据
 * @returns {Promise} 返回更新结果
 */
export function confirmSensitiveRequest(fieldData) {
  console.log('调用更新敏感字段状态API，数据:', fieldData);
  
  // 检查必要的字段
  const requiredFields = ['feignRequestUrl', 'scannedSensitiveFieldPath', 'confirmedSensitiveFieldPath', 'sensitiveKeywordType', 'status', 'feignInvocationId'];
  for (const field of requiredFields) {
    if (fieldData[field] === undefined) {
      return Promise.reject(new Error(`缺少必要字段: ${field}`));
    }
  }
  
  // 模拟API调用
  return new Promise((resolve) => {
    // 延迟模拟网络请求
    setTimeout(() => {
      // 模拟成功响应
      const response = {
        "status": "OK",
        "type": "GENERAL",
        "code": "000000000",
        "errorData": null,
        "data": null,
        "subData": null,
        "params": null
      };
      
      resolve(response);
    }, 500);
  });
}

/**
 * 按照feignRequestUrl聚合敏感字段数据
 * @param {Array} data - 原始敏感字段数据
 * @param {string} apiUrl - 当前API URL，用于过滤相关数据
 * @returns {Array} 聚合后的敏感字段数据
 */
function aggregateSensitiveFields(data, apiUrl) {
  // 用于存储聚合后的结果
  const aggregated = [];
  // An improved implementation of state code to labels mapping
  const stateLabels = {
    0: { name: 'Init', color: '#9CA3AF' },    // 灰色
    1: { name: 'Confirmed', color: '#10B981' }, // 绿色
    2: { name: 'Ignored', color: '#F59E0B' },  // 黄色
    3: { name: 'Deleted', color: '#EF4444' }   // 红色
  };
  // 用于跟踪已处理的feignRequestUrl
  const processedUrls = new Set();
  
  // 如果没有提供apiUrl，返回所有数据
  if (!apiUrl) {
    console.log('未提供API URL，返回所有数据');
    // 处理所有URL
    data.forEach(item => {
      if (!processedUrls.has(item.feignRequestUrl)) {
        processUrl(item.feignRequestUrl);
      }
    });
    return aggregated;
  }
  
  // 调试日志
  console.log('聚合敏感字段数据:', { apiUrl, totalItems: data.length });
  
  // 简单的URL匹配函数
  const matchesApiUrl = (feignUrl, currentApiUrl) => {
    // 简化为判断是否包含关键部分
    if (currentApiUrl.includes(feignUrl) || feignUrl.includes(currentApiUrl)) {
      return true;
    }
    
    // 提取路径部分进行比较
    const feignPath = feignUrl.split('?')[0].toLowerCase();
    const currentPath = currentApiUrl.split('?')[0].toLowerCase();
    
    return currentPath.includes(feignPath) || feignPath.includes(currentPath);
  };
  
  // 处理特定URL的函数
  function processUrl(url) {
    // 创建新的聚合项
    const aggregatedItem = {
      feignRequestUrl: url,
      fields: []
    };
    
    // 查找所有相同feignRequestUrl的项目
    data.filter(d => d.feignRequestUrl === url).forEach(d => {
      aggregatedItem.fields.push({
        id: d.id,
        path: d.confirmedSensitiveFieldPath,
        status: d.status,
        stateLabel: stateLabels[d.status] || { name: 'Unknown', color: '#9CA3AF' },
        isSensitive: d.status === 1, // Confirmed state
        // 保存原始数据以便更新时使用
        original: d
      });
    });
    
    // 添加到聚合结果中
    aggregated.push(aggregatedItem);
    // 标记此URL已处理
    processedUrls.add(url);
  }
  
  // 尝试匹配所有URL
  let foundMatch = false;
  data.forEach(item => {
    // 如果URL匹配且尚未处理
    if (matchesApiUrl(item.feignRequestUrl, apiUrl) && !processedUrls.has(item.feignRequestUrl)) {
      console.log('发现匹配URL:', item.feignRequestUrl);
      processUrl(item.feignRequestUrl);
      foundMatch = true;
    }
  });
  
  // 如果没有找到匹配项，返回一些默认数据
  if (!foundMatch) {
    console.log('没有找到匹配的URL，考虑返回一些默认数据');
    
    // 对于没有匹配的情况，返回前3个不同URL的数据作为示例
    let count = 0;
    processedUrls.clear(); // 重置已处理URL集合
    
    data.forEach(item => {
      if (!processedUrls.has(item.feignRequestUrl) && count < 3) {
        processUrl(item.feignRequestUrl);
        count++;
      }
    });
  }
  
  return aggregated;
}
