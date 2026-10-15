profile:
  store-selected: true
  store-fake-ip: true
unified-delay: true
tcp-concurrent: true
geodata-mode: true
geo-auto-update: true
geo-update-interval: 24
etag-support: true
dns:
  prefer-h3: false
  use-system-hosts: true
  cache-algorithm: arc
  #direct-nameserver:
  #  - system
  #  - 119.28.28.28
  #  - 119.29.29.29
  #  - 223.5.5.5
  #  - 223.6.6.6





function main(config) {
  // 确保 dns 与 fake-ip-filter 结构存在
  if (!config.dns) config.dns = {};
  if (!Array.isArray(config.dns["fake-ip-filter"])) {
    config.dns["fake-ip-filter"] = [];
  }

  // 4. 在 🎯Direct 组前插入 PayPal、SteamCN
  const proxyGroups = config["proxy-groups"] || [];

  const newGroups = [
    {
      name: "PayPal",
      icon: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/icon/color/paypal.png",
      url: "http://www.apple.com/library/test/success.html",
      type: "select",
      proxies: ["Proxies", "DIRECT"],
      "include-all": true
    },
    {
      name: "SteamCN",
      icon: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/icon/color/steam.png",
      url: "http://www.apple.com/library/test/success.html",
      type: "select",
      proxies: ["Proxies", "DIRECT"],
      "include-all": true
    }
  ];

  // 删除 MyTVSuper，并移除已有的 PayPal、SteamCN
  const remainingGroups = proxyGroups.filter(group => {
    const name = String(group.name || "").trim();

    return !["MyTVSuper", "PayPal", "SteamCN","Crypto","Scholar","Bahamut","Apple","PlayStation","HBO"].includes(name);
  });

  // PayPal 插入 🎯Direct 前面
  const directIndex = remainingGroups.findIndex(
    group => String(group.name || "").trim() === "🎯Direct"
  );

  if (directIndex !== -1) {
    remainingGroups.splice(directIndex, 0, newGroups[0]);
  } else {
    remainingGroups.push(newGroups[0]);
  }

  // SteamCN 插入 Steam 前面
  const steamIndex = remainingGroups.findIndex(
    group => String(group.name || "").trim() === "Steam"
  );

  if (steamIndex !== -1) {
    remainingGroups.splice(steamIndex, 0, newGroups[1]);
  } else {
    remainingGroups.push(newGroups[1]);
  }

  config["proxy-groups"] = remainingGroups;

  // 1. 配置 rule-providers
  config["rule-providers"] = {
    ...(config["rule-providers"] || {}),

    reject_domain: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "yaml",
      url: "https://raw.githubusercontent.com/ftroo2m/mihomoRules/main/reject.yaml"
    },

    direct_domain: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "yaml",
      url: "https://raw.githubusercontent.com/ftroo2m/mihomoRules/main/direct.yaml"
    },

    proxy_domain: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "yaml",
      url: "https://raw.githubusercontent.com/ftroo2m/mihomoRules/main/proxy.yaml"
    },

    process: {
      type: "http",
      interval: 86400,
      behavior: "classical",
      format: "yaml",
      url: "https://raw.githubusercontent.com/ftroo2m/mihomoRules/main/process.yaml"
    },

    // 新增外部 mrs 规则集（用于 fake-ip-filter）
    fakeip_filter_mrs: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs",
      url: "https://raw.githubusercontent.com/appshubcc/bett-rules/meta/geo/geosite/fakeip-filter.mrs"
    },

    google_domain: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google.mrs"
    },

    openai: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/openai.mrs"
    },

    perplexity: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/perplexity.mrs"
    },

    anthropic: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/anthropic.mrs"
    },

    SteamCN: {
      type: "http",
      interval: 86400,
      behavior: "classical",
      format: "yaml",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/SteamCN/SteamCN_No_Resolve.yaml"
    },

    Steam: {
      type: "http",
      interval: 86400,
      behavior: "classical",
      format: "yaml",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Steam/Steam_No_Resolve.yaml"
    },

    telegram_domain: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/telegram.mrs"
    },

    netflix_domain: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/netflix.mrs"
    },

    DisneyPlus: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/disney.mrs"
    },

    YouTube: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/youtube.mrs"
    },

    Tiktok: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/tiktok.mrs"
    },

    Epic: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/epicgames.mrs"
    },

    Xbox: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/xbox.mrs"
    },

    Microsoft: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/microsoft.mrs"
    },

    bilibili_domain: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/bilibili.mrs"
    },

    paypal_domain: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/paypal.mrs"
    },

    netflix_ip: {
      type: "http",
      interval: 86400,
      behavior: "ipcidr",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/netflix.mrs"
    },

    telegram_ip: {
      type: "http",
      interval: 86400,
      behavior: "ipcidr",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/telegram.mrs"
    },

    google_ip: {
      type: "http",
      interval: 86400,
      behavior: "ipcidr",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/google.mrs"
    },

    cn_domain: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.mrs"
    },

    private_domain: {
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/private.mrs"
    },

    lancidr_ip: {
      type: "http",
      interval: 86400,
      behavior: "ipcidr",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/private.mrs"
    },

    cn_ip: {
      type: "http",
      interval: 86400,
      behavior: "ipcidr",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.mrs"
    },



  };

  // 2. 在原有 fake-ip-filter 基础上追加规则
  const additionalFakeIpFilters = [
    "geosite:private",
    "geosite:geolocation-cn",
    "geosite:googlefcm",
    "rule-set:fakeip_filter_mrs"
  ];

  config.dns["fake-ip-filter"] = [
    ...config.dns["fake-ip-filter"],
    ...additionalFakeIpFilters
  ];

  // 3. 注入分流规则
  config.rules = [
    "RULE-SET,reject_domain,REJECT",
    "RULE-SET,direct_domain,DIRECT",
    "RULE-SET,proxy_domain,Proxies",
    "RULE-SET,process,Proxies",
    "RULE-SET,google_domain,Google",
    "RULE-SET,openai,AI",
    "RULE-SET,perplexity,AI",
    "RULE-SET,anthropic,AI",
    "RULE-SET,SteamCN,SteamCN",
    "RULE-SET,Steam,Steam",
    "RULE-SET,telegram_domain,Telegram",
    "RULE-SET,netflix_domain,Netflix",
    "RULE-SET,DisneyPlus,DisneyPlus",
    "RULE-SET,YouTube,YouTube",
    "RULE-SET,Tiktok,Tiktok",
    "RULE-SET,Epic,Epic",
    "RULE-SET,Xbox,Xbox",
    "RULE-SET,Microsoft,Microsoft",
    "RULE-SET,bilibili_domain,Bilibili",
    "RULE-SET,paypal_domain,PayPal",
    "RULE-SET,netflix_ip,Netflix,no-resolve",
    "RULE-SET,telegram_ip,Telegram,no-resolve",
    "RULE-SET,google_ip,Google,no-resolve",
    "RULE-SET,cn_domain,DIRECT",
    "RULE-SET,direct_domain,DIRECT",
    "RULE-SET,private_domain,DIRECT",
    "RULE-SET,lancidr_ip,DIRECT,no-resolve",
    "RULE-SET,cn_ip,DIRECT,no-resolve",
    "MATCH,✈️Final"
  ];

  // 4. 递归查找所有 url 字段并替换测速地址
  function replaceUrl(obj) {
    if (Array.isArray(obj)) {
      obj.forEach(item => replaceUrl(item));
      return;
    }

    if (obj && typeof obj === "object") {
      for (const key in obj) {
        if (key === "url" && typeof obj[key] === "string") {
          obj[key] = obj[key].replace(
            "http://www.gstatic.com/generate_204",
            "http://www.apple.com/library/test/success.html"
          );
        } else {
          replaceUrl(obj[key]);
        }
      }
    }
  }

  replaceUrl(config);

  return config;
}
