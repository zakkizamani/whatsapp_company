// src/utils/templateConstants.js
import { 
    Phone, 
    Link2, 
    MessageSquare, 
    Copy, 
    Workflow,
    ShoppingBag,
    Bell,
    Shield
  } from 'lucide-react';
  
  // Category options with examples
  export const TEMPLATE_CATEGORIES = [
    {
      value: 'MARKETING',
      label: 'Marketing',
      description: 'Promotional content, offers, and campaigns',
      icon: ShoppingBag,
      gradient: 'from-purple-500 to-pink-500',
      example: {
        header: 'Summer Sale is On! 🌞',
        body: 'Get 25% OFF on all summer collections. Use code SUMMER25 at checkout. Limited time offer!',
        footer: 'Terms and conditions apply',
        buttons: [{ text: 'Shop Now', type: 'URL' }]
      }
    },
    {
      value: 'UTILITY',
      label: 'Utility',
      description: 'Order updates, notifications, and alerts',
      icon: Bell,
      gradient: 'from-blue-500 to-cyan-500',
      example: {
        header: 'Order Update',
        body: 'Good news! Your order #12345 has been shipped and will arrive by tomorrow.',
        footer: 'Track your package',
        buttons: [{ text: 'Track Order', type: 'URL' }]
      }
    },
    {
      value: 'AUTHENTICATION',
      label: 'Authentication',
      description: 'OTP, verification codes, and security',
      icon: Shield,
      gradient: 'from-green-500 to-emerald-500',
      example: {
        header: 'Verification Code',
        body: 'Your WhatsApp verification code is: 123456. Do not share this code with anyone.',
        footer: 'Code expires in 10 minutes',
        buttons: [{ text: 'Copy Code', type: 'COPY_CODE' }]
      }
    }
  ];
  
  // Button types
  export const BUTTON_TYPES = {
    PHONE_NUMBER: { icon: Phone, label: 'Call Phone Number' },
    URL: { icon: Link2, label: 'Visit Website' },
    QUICK_REPLY: { icon: MessageSquare, label: 'Quick Reply' },
    COPY_CODE: { icon: Copy, label: 'Copy Code' },
    FLOW: { icon: Workflow, label: 'Flow Button' }
  };
  
  // Languages
  export const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'id', name: 'Indonesian' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'pt_BR', name: 'Portuguese (Brazil)' }
  ];
  
  // Header types
  export const HEADER_TYPES = [
    { value: 'NONE', label: 'None' },
    { value: 'TEXT', label: 'Text' },
    { value: 'IMAGE', label: 'Image' },
    { value: 'VIDEO', label: 'Video' },
    { value: 'DOCUMENT', label: 'Document' }
  ];
  
  // Initial template data structure
  export const INITIAL_TEMPLATE_DATA = {
    name: '',
    category: '',
    language: 'en',
    header: {
      type: 'NONE',
      text: '',
      media_url: '',
      media_id: ''
    },
    body: {
      text: '',
      parameterType: 'none',
      examples: [],
      namedExamples: []
    },
    footer: {
      text: ''
    },
    buttons: []
  };
  
  // Template limits
  export const TEMPLATE_LIMITS = {
    NAME_MAX_LENGTH: 512,
    HEADER_TEXT_MAX_LENGTH: 60,
    BODY_TEXT_MAX_LENGTH: 1024,
    FOOTER_TEXT_MAX_LENGTH: 60,
    BUTTON_TEXT_MAX_LENGTH: 25,
    COPY_CODE_MAX_LENGTH: 15,
    MAX_BUTTONS: 10,
    MAX_URL_BUTTONS: 2
  };