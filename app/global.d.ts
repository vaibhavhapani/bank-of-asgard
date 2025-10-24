declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

interface Window {
  config: {
    API_BASE_URL: string;
    API_SERVICE_URL: string;
    APP_BASE_URL: string;
    ASGARDEO_BASE_URL: string;
    APP_CLIENT_ID: string;
    APP_NAME: string;
    DISABLED_FEATURES: string[];
    TRANSFER_THRESHOLD: number;
    IDENTITY_VERIFICATION_PROVIDER_ID: string;
    IDENTITY_VERIFICATION_CLAIMS: string[]
  }
}
