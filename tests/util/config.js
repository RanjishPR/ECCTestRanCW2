const app_cred =  require("./bp-app-env");
const mock_cred = require("./mock-srv-env");

const domainChecker = require("./domainChecker");

const vcap = app_cred.system_env_json.VCAP_SERVICES;
const appenv = app_cred.application_env_json.VCAP_APPLICATION;
const mockenv = mock_cred.application_env_json.VCAP_APPLICATION;

const mockserverurl = mockenv.application_uris[0];
const tokenurl = vcap.xsuaa[0].credentials.url;

const appurl = appenv.application_uris[0];
const domain = domainChecker(appurl.replace(/^[^.]+\./, ''));
const org = vcap.connectivity[0].credentials.identityzone;
const appId = vcap.destination[0].instance_guid;


const bpAppRoute = org+".launchpad."+domain;
const appApiPath = appId+".comsapbpBusinessPartnersone.comsapbpBusinessPartners-1.0.1";

module.exports = {
    "token_url": tokenurl,
    "service_domain": "https://" +appurl +"/odata/v4/",
    "enterprise_messaging": {
        "grant_type": "client_credentials",
        "client_id": vcap["enterprise-messaging"][0].credentials.messaging[2].oa2.clientid,
		"client_secret": vcap["enterprise-messaging"][0].credentials.messaging[2].oa2.clientsecret
    },
    "xsuaa": {
        "grant_type": "client_credentials",
        "client_id": vcap.xsuaa[0].credentials.clientid,
        "client_secret": vcap.xsuaa[0].credentials.clientsecret
    },
    "mock": {
        "url": "https://" + mockserverurl +"/odata/v4/",
        "api": "op-api-business-partner-srv/A_BusinessPartner"
    },
    "bp_app": {
        "home": "https://"+bpAppRoute+"/"+appApiPath+"/index.html#Shell-home",
        "main": "https://"+bpAppRoute+"/"+appApiPath+"/index.html#fe-lrop-v4",
        "auth": tokenurl+"/login"
    }
}
