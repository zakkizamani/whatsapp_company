export const CONFIG = {
  API_BASE_URL: 'https://api.stg.solusiuntuknegeri.com',
  ENDPOINTS: {
    LOGIN: '/auth/account/login',
    PRIVILEGES: '/auth/account/privilege',
    USER_ACCOUNT: '/user/me/account',
    // WhatsApp Business API endpoints
    COMPANY_ABOUT: '/notification-gateway/company/about',
    COMPANY_CREDENTIAL: '/notification-gateway/company/credential',
    SET_WHATSAPP_CREDENTIAL: '/notification-gateway/company/set_credential/whatsapp',
    COMPANY_LIST: '/notification-gateway/company/list',
    COMPANY_DETAILS: '/notification-gateway/company/about',
    COMPANY_FIND: '/notification-gateway/company/find',
    // Template endpoints
    GET_TEMPLATE_LIBRARY : '/notification-gateway/template/library',
    GET_TEMPLATES: '/notification-gateway/find',
    GET_TEMPLATE_BY_ID: '/notification-gateway/template/get', // GET /template/get/{id}
    CREATE_TEMPLATE: '/notification-gateway/template/create',
    UPDATE_TEMPLATE: '/notification-gateway/template/edit', // PUT /template/edit/{id}
    DELETE_TEMPLATE: '/notification-gateway/template/delete', // DELETE /template/{id}
    CREATE_TEMPLATE_FROM_LIBRARY: '/notification-gateway/template/create_from_library',
  },
  STORAGE_KEYS: {
    REMEMBERED_USER: 'user',
    REMEMBERED_PASSWORD: 'password',
    TOKEN_ERP: 'tokenErp',
    LOGGED_IN_USER: 'loggedInUser',
    EXPIRED_SESSION: 'expiredSession',
    USER_PRIVILEGES: 'userPrivileges',
    USER_ACCOUNT: 'userAccount'
  },
  VALIDATION: {
    MIN_USERNAME_LENGTH: 3,
    MIN_PASSWORD_LENGTH: 6
  },
  AUTHORIZED_ROLES: {
    ADMIN_COMPANY: 'admin_company',
    ADMIN_WHATSAPP: 'master_notification_gateway'
  }
};