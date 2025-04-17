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
      // 模拟的API返回数据
      const mockData = [
        {
          "id": "1",
          "feignRequestUrl": "/api/users",
          "confirmedSensitiveFieldPath": "data.name",
          "status": "CONFIRMED"
        },
        {
          "id": "2",
          "feignRequestUrl": "/api/users",
          "confirmedSensitiveFieldPath": "data.email",
          "status": "CONFIRMED"
        },
        {
          "id": "3",
          "feignRequestUrl": "/api/users",
          "confirmedSensitiveFieldPath": "data.phone",
          "status": "PENDING"
        },
        {
          "id": "4",
          "feignRequestUrl": "/api/payment",
          "confirmedSensitiveFieldPath": "data.cardNumber",
          "status": "CONFIRMED"
        },
        {
          "id": "5",
          "feignRequestUrl": "/api/payment",
          "confirmedSensitiveFieldPath": "data.cvv",
          "status": "CONFIRMED"
        },
        {
          "id": "6",
          "feignRequestUrl": "/api/profile",
          "confirmedSensitiveFieldPath": "data.address",
          "status": "PENDING"
        },
        {
          "id": "7",
          "feignRequestUrl": "/api/profile",
          "confirmedSensitiveFieldPath": "data.idNumber",
          "status": "CONFIRMED"
        }
      ];
      
      // 按照feignRequestUrl聚合数据
      const aggregatedData = aggregateSensitiveFields(mockData, apiUrl);
      
      console.log('API返回聚合后的数据:', aggregatedData);
      
      // 确保总是返回一些数据，即使URL无匹配
      if (aggregatedData.length === 0) {
        console.log('未找到URL匹配的数据，返回所有数据');
        resolve(aggregateSensitiveFields(mockData));
      } else {
        resolve(aggregatedData);
      }
    }, 1000);
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
    // 仅用于调试，返回true匹配所有数据
    console.log(`比较 ${feignUrl} 和 ${currentApiUrl}`);
    
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
        isSensitive: d.status === "CONFIRMED"
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
  
  // 如果没有找到匹配项，返回所有数据
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
